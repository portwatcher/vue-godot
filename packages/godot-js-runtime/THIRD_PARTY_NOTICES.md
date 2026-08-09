# Third-party notices

Godot JavaScript Runtime pins the following upstream projects. Source archive
hashes and complete commits are recorded in `native/deps.lock.json`.

## godot-cpp

- Project: https://github.com/godotengine/godot-cpp
- Revision: `e4b7c25e721ce3435a029087e3917a30aa73f06b`
- License: MIT
- Use: compiled Godot 4.4 GDExtension C++ bindings

The upstream copyright and MIT license are retained in the bootstrapped source
tree and must be included in source and binary release archives.

## QuickJS-ng

- Project: https://github.com/quickjs-ng/quickjs
- Revision: `433941b99fb3c5e7f98b7ebd78727972bcf467ee` (`v0.15.0`)
- License: MIT
- Use: embedded JavaScript engine source; compilation begins in Phase 2

The upstream copyright and MIT license are retained in the bootstrapped source
tree and must be included in source and binary release archives.

## SCons

- Project: https://www.scons.org/
- Version: `4.8.1`
- License: MIT
- Use: build-time tool only; not linked or shipped as a runtime dependency

The exact universal Python wheel is checksum-pinned and installed into an
ignored local build environment.
