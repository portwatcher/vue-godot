#include <algorithm>
#include <cstdlib>
#include <functional>
#include <iostream>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

#include "godot_js_runtime/runtime/module_resolver.hpp"
#include "godot_js_runtime/runtime/module_format.hpp"
#include "godot_js_runtime/runtime/resource_provider.hpp"
#include "godot_js_runtime/runtime/runtime_host.hpp"
#include "godot_js_runtime/runtime/source_map.hpp"

namespace {

using godot_js_runtime::ConsoleLevel;
using godot_js_runtime::ConsoleMessage;
using godot_js_runtime::ConsoleSink;
using godot_js_runtime::EvaluationResult;
using godot_js_runtime::ModuleKind;
using godot_js_runtime::ModuleResolution;
using godot_js_runtime::ResourceProvider;
using godot_js_runtime::RuntimeHost;
using godot_js_runtime::RuntimeOptions;
using godot_js_runtime::SourceMap;
using godot_js_runtime::SourceMapRegistry;

class MemoryResources final : public ResourceProvider {
public:
	std::unordered_map<std::string, std::string> files;

	bool exists(const std::string &path) const noexcept override {
		return files.find(path) != files.end();
	}

	bool read_text(
			const std::string &path,
			std::string &contents,
			std::string &error) const noexcept override {
		const auto iterator = files.find(path);
		if (iterator == files.end()) {
			error = "Missing memory resource: " + path;
			return false;
		}
		contents = iterator->second;
		return true;
	}
};

class RecordingConsole final : public ConsoleSink {
public:
	std::vector<ConsoleMessage> messages;

	void write(const ConsoleMessage &message) noexcept override {
		messages.push_back(message);
	}
};

void expect(bool condition, const std::string &message) {
	if (!condition) {
		std::cerr << "[native-test] assertion failed: " << message << '\n';
		std::exit(EXIT_FAILURE);
	}
}

void expect_ok(const EvaluationResult &result, const std::string &operation) {
	if (!result.ok) {
		const std::string detail = result.exception.has_value()
				? godot_js_runtime::format_exception(*result.exception)
				: std::string("missing exception detail");
		std::cerr << "[native-test] " << operation << " failed: " << detail << '\n';
		std::exit(EXIT_FAILURE);
	}
}

void expect_failure(const EvaluationResult &result, const std::string &operation) {
	expect(!result.ok, operation + " unexpectedly succeeded");
	expect(result.exception.has_value(), operation + " did not return exception detail");
}

RuntimeOptions leak_checked_options() {
	RuntimeOptions options;
	options.abort_on_leaks = true;
	return options;
}

void test_evaluation_exceptions_console_and_features() {
	MemoryResources resources;
	RecordingConsole console;
	RuntimeHost runtime(resources, console, leak_checked_options());

	expect(runtime.is_running(), "runtime did not start");
	expect(RuntimeHost::live_runtime_count() == 1, "live runtime counter did not increment");
	expect(!RuntimeHost::runtime_version().empty(), "runtime version is empty");
	expect(RuntimeHost::quickjs_version() == "0.15.0", "unexpected QuickJS-ng version");
	expect(runtime.memory_usage_bytes() > 0, "runtime memory usage was not reported");

	const EvaluationResult arithmetic = runtime.evaluate_script(
			"1 + 2",
			"res://tests/arithmetic.js");
	expect_ok(arithmetic, "arithmetic evaluation");
	expect(arithmetic.value == "3", "arithmetic result was not converted to text");

	const EvaluationResult console_result = runtime.evaluate_script(
			"console.debug('debug'); console.log('log'); console.info('info'); console.warn('careful', 7); console.error('error')",
			"res://tests/console.js");
	expect_ok(console_result, "console evaluation");
	expect(console.messages.size() == 5, "console levels were not routed to the host");
	const std::vector<ConsoleLevel> expected_levels = {
		ConsoleLevel::DEBUG,
		ConsoleLevel::LOG,
		ConsoleLevel::INFO,
		ConsoleLevel::WARNING,
		ConsoleLevel::ERROR,
	};
	for (std::size_t index = 0; index < expected_levels.size(); ++index) {
		expect(console.messages[index].level == expected_levels[index], "console level changed in transit");
	}
	expect(console.messages[3].text == "careful 7", "console arguments were not joined");
	expect(
			console.messages[0].source.find("res://tests/console.js") != std::string::npos,
			"console source context was not captured");

	const EvaluationResult failure = runtime.evaluate_script(
			"throw new TypeError('phase-two-boom')",
			"res://tests/exception.js");
	expect_failure(failure, "exception conversion");
	expect(failure.exception->name == "TypeError", "exception name was not preserved");
	expect(
			failure.exception->message.find("phase-two-boom") != std::string::npos,
			"exception message was not preserved");
	expect(
			failure.exception->source == "res://tests/exception.js",
			"exception source was not preserved");
	expect(failure.exception->line > 0, "exception line was not captured");
	expect(failure.exception->column > 0, "exception column was not captured");

	const EvaluationResult valid_module = runtime.validate_syntax(
			"export const result = 17\n",
			"res://tests/valid-module.mjs",
			true);
	expect_ok(valid_module, "compile-only module syntax validation");
	const EvaluationResult invalid_module = runtime.validate_syntax(
			"export const valid = 1\nexport const broken = ;\n",
			"res://tests/invalid-module.mjs",
			true);
	expect_failure(invalid_module, "invalid module syntax validation");
	expect(
			invalid_module.exception->source == "res://tests/invalid-module.mjs",
			"syntax validation did not preserve its source path");
	expect(
			invalid_module.exception->line == 2,
			"syntax validation did not preserve its source line; received " +
					std::to_string(invalid_module.exception->line));

	const EvaluationResult virtual_module = runtime.evaluate_script(
			"globalThis.evalFeatureCount = 0",
			"res://tests/features.js");
	expect_ok(virtual_module, "feature setup");
	expect(
			std::find(
					RuntimeHost::runtime_features().begin(),
					RuntimeHost::runtime_features().end(),
					"quickjs-ng") != RuntimeHost::runtime_features().end(),
			"runtime feature list is incomplete");
}

void test_promises_interrupt_memory_and_job_limits() {
	MemoryResources resources;
	RecordingConsole console;
	RuntimeHost runtime(resources, console, leak_checked_options());
	const EvaluationResult scheduled = runtime.evaluate_script(
			"globalThis.promiseValue = 0; Promise.resolve().then(() => { globalThis.promiseValue = 42 })",
			"res://tests/promise.js");
	expect_ok(scheduled, "Promise scheduling");
	const EvaluationResult jobs = runtime.pump_jobs();
	expect_ok(jobs, "Promise job pump");
	expect(jobs.jobs_executed > 0, "Promise job pump did not execute a job");
	const EvaluationResult promise_value = runtime.evaluate_script("globalThis.promiseValue");
	expect_ok(promise_value, "Promise result read");
	expect(promise_value.value == "42", "Promise job did not update the global value");

	RuntimeOptions interrupt_options = leak_checked_options();
	interrupt_options.execution_timeout_milliseconds = 10;
	RuntimeHost interrupted(resources, console, interrupt_options);
	const EvaluationResult infinite_loop = interrupted.evaluate_script(
			"while (true) {}",
			"res://tests/interrupt.js");
	expect_failure(infinite_loop, "interrupt handler");
	expect(
			infinite_loop.exception->message.find("interrupted") != std::string::npos,
			"interrupt exception did not identify the interruption");

	RuntimeOptions requested_interrupt_options = leak_checked_options();
	requested_interrupt_options.execution_timeout_milliseconds = 0;
	RuntimeHost requested_interrupt(resources, console, requested_interrupt_options);
	requested_interrupt.request_interrupt();
	const EvaluationResult requested = requested_interrupt.evaluate_script(
			"while (true) {}",
			"res://tests/requested-interrupt.js");
	expect_failure(requested, "requested interrupt");
	expect(
			requested.exception->message.find("interrupted") != std::string::npos,
			"requested interrupt was not observed by QuickJS-ng");

	RuntimeOptions memory_options = leak_checked_options();
	memory_options.memory_limit_bytes = 4 * 1024 * 1024;
	RuntimeHost memory_limited(resources, console, memory_options);
	const EvaluationResult allocation = memory_limited.evaluate_script(
			"new ArrayBuffer(32 * 1024 * 1024)",
			"res://tests/memory-limit.js");
	expect_failure(allocation, "allocator memory limit");

	RuntimeOptions job_options = leak_checked_options();
	job_options.max_jobs_per_pump = 3;
	RuntimeHost job_limited(resources, console, job_options);
	expect_ok(
			job_limited.evaluate_script(
					"function repeat() { Promise.resolve().then(repeat) } repeat()",
					"res://tests/job-limit.js"),
			"recursive Promise scheduling");
	const EvaluationResult limited_jobs = job_limited.pump_jobs();
	expect_failure(limited_jobs, "Promise job limit");
	expect(limited_jobs.jobs_executed == 3, "Promise job limit executed an unexpected count");
}

void test_module_resolution() {
	const ModuleResolution relative = godot_js_runtime::normalize_resource_path(
			"res://scripts/player/main.mjs",
			"../shared/math.mjs");
	expect(relative.ok, "relative resource path did not normalize");
	expect(relative.path == "res://scripts/shared/math.mjs", "relative path normalized incorrectly");

	const ModuleResolution escaped = godot_js_runtime::normalize_resource_path(
			"res://main.mjs",
			"../../outside.mjs");
	expect(!escaped.ok, "resource path traversal was accepted");
	const ModuleResolution bare = godot_js_runtime::normalize_resource_path(
			"res://main.mjs",
			"node:fs");
	expect(!bare.ok, "unsupported bare module was accepted");
	const ModuleResolution runtime_module = godot_js_runtime::normalize_resource_path(
			"res://main.mjs",
			"godot-js");
	expect(runtime_module.ok && runtime_module.virtual_module, "godot-js was not virtualized");
	const ModuleResolution compatibility_module = godot_js_runtime::normalize_resource_path(
			"res://main.mjs",
			"godot-jsb");
	expect(
			compatibility_module.ok && compatibility_module.virtual_module,
			"godot-jsb was not virtualized");

	const ModuleResolution extension = godot_js_runtime::resolve_module(
			"res://main.mjs",
			"./helper",
			ModuleKind::ES_MODULE,
			[](const std::string &path) {
				return path == "res://helper.mjs";
			});
	expect(extension.ok && extension.path == "res://helper.mjs", "ESM extension lookup failed");
}

void test_esm_json_cycles_cache_and_bad_paths() {
	MemoryResources resources;
	RecordingConsole console;
	resources.files = {
		{ "res://main.mjs", R"JS(
import { collectGarbage, runtimeVersion, quickJSVersion, runtimeFeatures, hasFeature } from 'godot-js'
import { value } from './value'
import settings from './settings.json'
import { cycleValue } from './cycle/a.mjs'
import './once.mjs'
import './once.mjs'
globalThis.esmResult = JSON.stringify({
  value,
  name: settings.name,
  cycle: cycleValue(),
  runtime: runtimeVersion(),
  quickjs: quickJSVersion(),
  features: runtimeFeatures().length,
  supported: hasFeature('source-maps'),
  gc: collectGarbage() === undefined,
  loads: globalThis.esmLoads,
})
Promise.resolve().then(() => { globalThis.esmPromise = 'drained' })
)JS" },
		{ "res://value.mjs", "export const value = 17\n" },
		{ "res://settings.json", R"JSON({"name":"resource-json"})JSON" },
		{ "res://cycle/a.mjs", R"JS(
import { readA } from './b.mjs'
export const nameA = 'a'
export function cycleValue() { return readA() }
)JS" },
		{ "res://cycle/b.mjs", R"JS(
import { nameA } from './a.mjs'
export function readA() { return nameA + '-cycle' }
)JS" },
		{ "res://once.mjs", "globalThis.esmLoads = (globalThis.esmLoads || 0) + 1\n" },
		{ "res://bad.mjs", "import './missing.mjs'\n" },
	};

	RuntimeHost runtime(resources, console, leak_checked_options());
	expect_ok(runtime.evaluate_module("res://main.mjs"), "ES module entry");
	const EvaluationResult result = runtime.evaluate_script("globalThis.esmResult");
	expect_ok(result, "ES module result read");
	expect(result.value.find("resource-json") != std::string::npos, "JSON ESM import failed");
	expect(result.value.find("a-cycle") != std::string::npos, "ESM circular dependency failed");
	expect(result.value.find("\"loads\":1") != std::string::npos, "ESM cache executed a module twice");
	expect(
			result.value.find(
					"\"runtime\":\"" + RuntimeHost::runtime_version() + "\"") !=
					std::string::npos,
			"godot-js runtime version failed");
	expect(result.value.find("\"quickjs\":\"0.15.0\"") != std::string::npos, "godot-js QuickJS version failed");
	expect(result.value.find("\"supported\":true") != std::string::npos, "godot-js feature probe failed");
	expect(result.value.find("\"gc\":true") != std::string::npos, "godot-js garbage collection hook failed");

	const EvaluationResult jobs = runtime.pump_jobs();
	expect_ok(jobs, "ESM Promise drain");
	const EvaluationResult promise = runtime.evaluate_script("globalThis.esmPromise");
	expect_ok(promise, "ESM Promise value read");
	expect(promise.value == "drained", "ESM Promise job did not run");

	const EvaluationResult missing = runtime.evaluate_module("res://bad.mjs");
	expect_failure(missing, "missing ES module path");
	expect(
			missing.exception->message.find("Cannot resolve module") != std::string::npos,
			"missing ES module error did not identify resolution failure");
}

void test_commonjs_json_cycles_cache_and_vite_chunks() {
	expect(
			godot_js_runtime::detect_javascript_module_format(
					"res://dist/app.js",
					"\xEF\xBB\xBF\n  \"use strict\";\n/*! godotjs:format=commonjs */\nexports.default = 1") ==
					godot_js_runtime::JavaScriptModuleFormat::COMMONJS,
			"generated CommonJS .js metadata was not detected");
	expect(
			godot_js_runtime::detect_javascript_module_format(
					"res://plain.js",
					"export default 1") ==
					godot_js_runtime::JavaScriptModuleFormat::ES_MODULE,
			"plain .js did not default to ESM");
	expect(
			godot_js_runtime::detect_javascript_module_format(
					"res://forced.cjs",
					"module.exports = 1") ==
					godot_js_runtime::JavaScriptModuleFormat::COMMONJS,
			".cjs extension did not select CommonJS");
	expect(
			godot_js_runtime::detect_javascript_module_format(
					"res://forced.mjs",
					"/*! godotjs:format=commonjs */\nexport default 1") ==
					godot_js_runtime::JavaScriptModuleFormat::ES_MODULE,
			".mjs extension did not remain ESM");

	MemoryResources resources;
	RecordingConsole console;
	resources.files = {
		{ "res://entry.cjs", R"JS(
const runtime = require('godot-js')
const settings = require('./settings.json')
const cycle = require('./cycle/a')
const onceA = require('./once')
const onceB = require('./once')
globalThis.cjsResult = JSON.stringify({
  name: settings.name,
  cycle: cycle.fromB + ':' + cycle.seenByB,
  same: onceA === onceB,
  loads: globalThis.cjsLoads,
  version: runtime.quickJSVersion(),
  supported: runtime.hasFeature('commonjs'),
  gc: runtime.collectGarbage() === undefined,
})
Promise.resolve().then(() => require('./chunks/chunk.js')).then((chunk) => {
  globalThis.cjsChunk = chunk.asyncContractMarker
})
module.exports = { ok: true }
)JS" },
		{ "res://settings.json", R"JSON({"name":"commonjs-json"})JSON" },
		{ "res://cycle/a.js", R"JS(
exports.name = 'a'
const b = require('./b')
exports.fromB = b.name
exports.seenByB = b.fromA
)JS" },
		{ "res://cycle/b.js", R"JS(
exports.name = 'b'
const a = require('./a')
exports.fromA = a.name
)JS" },
		{ "res://once.js", R"JS(
globalThis.cjsLoads = (globalThis.cjsLoads || 0) + 1
module.exports = { marker: 'once' }
)JS" },
		{ "res://chunks/chunk.js", "exports.asyncContractMarker = 'vite-relative-chunk'\n" },
		{ "res://bad.cjs", "require('./missing')\n" },
	};

	RuntimeHost runtime(resources, console, leak_checked_options());
	expect_ok(runtime.evaluate_commonjs("res://entry.cjs"), "CommonJS entry");
	const EvaluationResult result = runtime.evaluate_script("globalThis.cjsResult");
	expect_ok(result, "CommonJS result read");
	expect(result.value.find("commonjs-json") != std::string::npos, "CommonJS JSON require failed");
	expect(result.value.find("b:a") != std::string::npos, "CommonJS circular dependency failed");
	expect(result.value.find("\"same\":true") != std::string::npos, "CommonJS cache identity failed");
	expect(result.value.find("\"loads\":1") != std::string::npos, "CommonJS module executed twice");
	expect(result.value.find("\"version\":\"0.15.0\"") != std::string::npos, "godot-js CommonJS API failed");
	expect(result.value.find("\"gc\":true") != std::string::npos, "godot-js CommonJS garbage collection hook failed");

	const EvaluationResult jobs = runtime.pump_jobs();
	expect_ok(jobs, "Vite-style CommonJS chunk Promise drain");
	const EvaluationResult chunk = runtime.evaluate_script("globalThis.cjsChunk");
	expect_ok(chunk, "Vite-style chunk result read");
	expect(chunk.value == "vite-relative-chunk", "relative Vite chunk did not load");
	expect(
			runtime.consume_changed_resource_module_paths().empty(),
			"unchanged CommonJS graph reported a file change");
	resources.files["res://chunks/chunk.js"] =
			"exports.asyncContractMarker = 'vite-relative-chunk-rebuilt'\n";
	const std::vector<std::string> changed_paths =
			runtime.consume_changed_resource_module_paths();
	expect(
			changed_paths ==
					std::vector<std::string>{ "res://chunks/chunk.js" },
			"rebuilt Vite chunk was not reported as a changed module dependency");
	expect(
			runtime.consume_changed_resource_module_paths().empty(),
			"consumed Vite chunk change was reported twice");

	expect_ok(runtime.evaluate_commonjs("res://entry.cjs"), "cached CommonJS entry");
	const EvaluationResult loads = runtime.evaluate_script("globalThis.cjsLoads");
	expect_ok(loads, "CommonJS load count read");
	expect(loads.value == "1", "cached CommonJS entry was evaluated again");

	const EvaluationResult missing = runtime.evaluate_commonjs("res://bad.cjs");
	expect_failure(missing, "missing CommonJS path");
	expect(
			missing.exception->message.find("Cannot resolve module") != std::string::npos,
			"missing CommonJS error did not identify resolution failure");
	expect(missing.exception->source == "res://bad.cjs", "CommonJS error source was not captured");
	expect(missing.exception->line > 0 && missing.exception->column > 0, "CommonJS error location was incomplete");
}

void test_source_maps_and_fallback() {
	const std::string map_json =
			R"JSON({"version":3,"sources":["../src/original.ts"],"names":[],"mappings":"AASI"})JSON";
	std::string parse_error;
	const std::optional<SourceMap> source_map = SourceMap::parse(
			map_json,
			"res://dist/mapped.js",
			parse_error);
	expect(source_map.has_value(), "source map did not parse: " + parse_error);
	const auto original = source_map->original_position(1, 1);
	expect(original.has_value(), "source map did not resolve a generated position");
	expect(original->source == "res://src/original.ts", "source map path resolved incorrectly");
	expect(original->line == 10 && original->column == 5, "source map VLQ decoded incorrectly");

	SourceMapRegistry registry;
	expect(
			registry.register_map("res://dist/mapped.js", map_json, parse_error),
			"source map registry rejected a valid map");
	expect(
			registry.remap_stack("at run (res://dist/mapped.js:1:1)") ==
					"at run (res://src/original.ts:10:5)",
			"source-map stack remapping failed");

	MemoryResources resources;
	RecordingConsole console;
	resources.files["res://dist/mapped.js.map"] = map_json;
	RuntimeHost runtime(resources, console, leak_checked_options());
	const EvaluationResult mapped = runtime.evaluate_script(
			"throw new Error('mapped failure')\n//# sourceMappingURL=mapped.js.map",
			"res://dist/mapped.js");
	expect_failure(mapped, "source-mapped exception");
	expect(mapped.exception->source_mapped, "exception was not marked source-mapped");
	expect(mapped.exception->source == "res://src/original.ts", "exception source was not remapped");
	expect(mapped.exception->line == 10, "exception line was not remapped");

	resources.files["res://dist/invalid.js.map"] = "{not-json";
	const EvaluationResult fallback = runtime.evaluate_script(
			"throw new Error('fallback failure')\n//# sourceMappingURL=invalid.js.map",
			"res://dist/invalid.js");
	expect_failure(fallback, "invalid source-map fallback");
	expect(!fallback.exception->source_mapped, "invalid source map was applied");
	expect(fallback.exception->source == "res://dist/invalid.js", "generated source fallback was lost");
	expect(
			std::any_of(
					console.messages.begin(),
					console.messages.end(),
					[](const ConsoleMessage &message) {
						return message.text.find("Could not parse source map") != std::string::npos;
					}),
			"invalid source map did not produce a graceful warning");
}

void test_deterministic_teardown() {
	expect(RuntimeHost::live_runtime_count() == 0, "runtime leaked before teardown stress test");
	MemoryResources resources;
	RecordingConsole console;
	RuntimeOptions options = leak_checked_options();
	for (int iteration = 0; iteration < 128; ++iteration) {
		{
			RuntimeHost runtime(resources, console, options);
			expect_ok(
					runtime.evaluate_script(
							"({ iteration: " + std::to_string(iteration) + " }).iteration",
							"res://tests/teardown.js"),
					"teardown stress evaluation");
			runtime.collect_garbage();
			runtime.shutdown();
			runtime.shutdown();
			expect(!runtime.is_running(), "shutdown was not idempotent");
		}
		expect(RuntimeHost::live_runtime_count() == 0, "runtime instance leaked during teardown stress");
	}
}

} // namespace

int main() {
	const std::vector<std::pair<std::string, std::function<void()>>> tests = {
		{ "evaluation, exceptions, console, features", test_evaluation_exceptions_console_and_features },
		{ "Promises, interrupt, memory, job limits", test_promises_interrupt_memory_and_job_limits },
		{ "module resolution", test_module_resolution },
		{ "ESM, JSON, cycles, cache, bad paths", test_esm_json_cycles_cache_and_bad_paths },
		{ "CommonJS, JSON, cycles, cache, Vite chunks", test_commonjs_json_cycles_cache_and_vite_chunks },
		{ "source maps and fallback", test_source_maps_and_fallback },
		{ "deterministic teardown", test_deterministic_teardown },
	};

	for (const auto &test : tests) {
		test.second();
		std::cout << "[native-test] PASS " << test.first << '\n';
	}
	std::cout << "[native-test] PASS all " << tests.size() << " groups\n";
	return EXIT_SUCCESS;
}
