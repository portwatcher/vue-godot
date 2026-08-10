#ifndef GODOT_JS_RUNTIME_SCRIPT_METADATA_KEY_HPP
#define GODOT_JS_RUNTIME_SCRIPT_METADATA_KEY_HPP

#include "godot_js_runtime/runtime/scoped_js_value.hpp"

namespace godot_js_runtime {

inline constexpr char SCRIPT_METADATA_KEY[] = "godotjs.script-metadata";

inline JSAtom script_metadata_atom(JSContext *context) {
	ScopedJSValue global(context, JS_GetGlobalObject(context));
	ScopedJSValue symbol_constructor(
			context,
			JS_GetPropertyStr(context, global.get(), "Symbol"));
	ScopedJSValue symbol_for(
			context,
			JS_GetPropertyStr(context, symbol_constructor.get(), "for"));
	ScopedJSValue key(context, JS_NewString(context, SCRIPT_METADATA_KEY));
	if (JS_IsException(global.get()) || JS_IsException(symbol_constructor.get()) ||
			JS_IsException(symbol_for.get()) || JS_IsException(key.get())) {
		return JS_ATOM_NULL;
	}
	JSValueConst arguments[] = { key.get() };
	ScopedJSValue symbol(
			context,
			JS_Call(
					context,
					symbol_for.get(),
					symbol_constructor.get(),
					1,
					arguments));
	return JS_IsException(symbol.get())
			? JS_ATOM_NULL
			: JS_ValueToAtom(context, symbol.get());
}

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_SCRIPT_METADATA_KEY_HPP
