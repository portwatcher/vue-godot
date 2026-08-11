#ifndef GODOT_JS_RUNTIME_SCOPED_JS_VALUE_HPP
#define GODOT_JS_RUNTIME_SCOPED_JS_VALUE_HPP

#include "quickjs.h"

namespace godot_js_runtime {

class ScopedJSValue {
public:
	ScopedJSValue(JSContext *context, JSValue value) : context(context), value(value) {
	}

	~ScopedJSValue() {
		if (context != nullptr) {
			JS_FreeValue(context, value);
		}
	}

	ScopedJSValue(const ScopedJSValue &) = delete;
	ScopedJSValue &operator=(const ScopedJSValue &) = delete;

	ScopedJSValue(ScopedJSValue &&other) noexcept :
			context(other.context), value(other.value) {
		other.context = nullptr;
		other.value = JS_UNDEFINED;
	}

	ScopedJSValue &operator=(ScopedJSValue &&other) noexcept {
		if (this == &other) {
			return *this;
		}
		if (context != nullptr) {
			JS_FreeValue(context, value);
		}
		context = other.context;
		value = other.value;
		other.context = nullptr;
		other.value = JS_UNDEFINED;
		return *this;
	}

	JSValue get() const {
		return value;
	}

	JSValue release() {
		JSValue released = value;
		value = JS_UNDEFINED;
		context = nullptr;
		return released;
	}

private:
	JSContext *context;
	JSValue value;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_SCOPED_JS_VALUE_HPP
