# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.8](https://github.com/leonied7/vue-validate-form/compare/v0.0.7...v0.0.8) (2021-02-18)


### Features

* pass name in slot ([5e26eec](https://github.com/leonied7/vue-validate-form/commit/5e26eec171786754a1152c5722ba20eadc111fa2))
* remove validators ([0e1313d](https://github.com/leonied7/vue-validate-form/commit/0e1313d78a20e50d65e8a42aa65441ecfa5821f4))
* return register validators ([8833a19](https://github.com/leonied7/vue-validate-form/commit/8833a194deba35cf872fd0f41afa7faf25923366))

### [0.0.7](https://github.com/leonied7/vue-validate-form/compare/v0.0.6...v0.0.7) (2020-12-22)


### Bug Fixes

* remove clonedeep dependencies ([d38d943](https://github.com/leonied7/vue-validate-form/commit/d38d943faf9cc47a705b0cdb8aa51272a698deb2))

### [0.0.6](https://github.com/leonied7/vue-validate-form/compare/v0.0.5...v0.0.6) (2020-12-22)


### Bug Fixes

* remove umd in dist ([425dbce](https://github.com/leonied7/vue-validate-form/commit/425dbce78abb8e7091b09b2ea960f8d068f97fa8))
* remove umd version ([f3eb000](https://github.com/leonied7/vue-validate-form/commit/f3eb000898d2348279507d1c510753a9fb2f93bd))

### [0.0.5](https://github.com/leonied7/vue-validate-form/compare/v0.0.4...v0.0.5) (2020-12-22)


### Bug Fixes

* add core-js for umd version ([2c5e278](https://github.com/leonied7/vue-validate-form/commit/2c5e2787c82f303e9a59216f95a1e37ef6b5e09f))

### [0.0.4](https://github.com/leonied7/vue-validate-form/compare/v0.0.4-alpha.6...v0.0.4) (2020-12-01)


### Features

* add resolver prop for validate by scheme ([38917bc](https://github.com/leonied7/vue-validate-form/commit/38917bcd62d1831aebd838b7cd146aaa6cd1c8b1))
* move validators to external package ([1c6cf52](https://github.com/leonied7/vue-validate-form/commit/1c6cf52a87c5fa2a7feaaf492d3d1803749ae5be))


### Bug Fixes

* add transpile async/await ([d7dbdf5](https://github.com/leonied7/vue-validate-form/commit/d7dbdf5aade0b9f30fc1b5bbaa6dd542bebe8653))

### [0.0.4-alpha.6](https://github.com/leonied7/vue-validate-form/compare/v0.0.4-alpha.5...v0.0.4-alpha.6) (2020-11-21)


### Bug Fixes

* check firstInvalidField on exists ([57b2452](https://github.com/leonied7/vue-validate-form/commit/57b2452726b3c83caf376b4688c581a760de3514))
* rename vue => js ([55afd01](https://github.com/leonied7/vue-validate-form/commit/55afd01f80710dd51b3ec4506bb1ed6114c57f8c))

### [0.0.4-alpha.5](https://github.com/leonied7/vue-validate-form/compare/v0.0.4-alpha.4...v0.0.4-alpha.5) (2020-11-15)


### Features

* add firstError in ValidationField slot ([ca94efc](https://github.com/leonied7/vue-validate-form/commit/ca94efc1baa2814072297e3753bee807cb34192d))

### [0.0.4-alpha.4](https://github.com/leonied7/vue-validate-form/compare/v0.0.4-alpha.3...v0.0.4-alpha.4) (2020-11-13)


### Bug Fixes

* add name for validators in browser config ([b39876c](https://github.com/leonied7/vue-validate-form/commit/b39876c0eb1fdfc43c25ac0745cdfb674a1b73de))

### [0.0.4-alpha.3](https://github.com/leonied7/vue-validate-form/compare/v0.0.4-alpha.2...v0.0.4-alpha.3) (2020-11-13)


### Features

* add pattern validator ([b353974](https://github.com/leonied7/vue-validate-form/commit/b353974c0d3726e80598109f0b250da73e424e8b))
* add validators ([4d9b0d2](https://github.com/leonied7/vue-validate-form/commit/4d9b0d28b0c03ec482a3282a688cfa0a035417c9))
* build validators ([6fe05fb](https://github.com/leonied7/vue-validate-form/commit/6fe05fb61b7a56463ff1f86aa0f0bf7b11aea18e))


### Bug Fixes

* rename main.js => index.js ([2192b4e](https://github.com/leonied7/vue-validate-form/commit/2192b4ea0899a9496a9e6b2089394bd982176f2f))
* set flatValue by field on addField ([5d2db79](https://github.com/leonied7/vue-validate-form/commit/5d2db79e147c60bc6e22459afb87e140fc222aa7))
* trigger validateField only if value changed ([5be8593](https://github.com/leonied7/vue-validate-form/commit/5be859369a182841e219475150d9437c2ac9512e))

### [0.0.4-alpha.2](https://github.com/leonied7/vue-validate-form/compare/v0.0.4-alpha.1...v0.0.4-alpha.2) (2020-11-13)


### Features

* add ability to set error in ValidateField ([07d0a85](https://github.com/leonied7/vue-validate-form/commit/07d0a85f373d00dee2a9f7868d27ba57ee5c0ff0))
* emit event `should-focus` ([bcc943b](https://github.com/leonied7/vue-validate-form/commit/bcc943b03083a6c54927ae590a77e22e349a0548))
* pass to slot setErrors, setFieldError ([4585057](https://github.com/leonied7/vue-validate-form/commit/4585057db4bc4c0f101ebcaa0919d73d26a0a39b))
* reset without values reset to previous defaults ([0262c27](https://github.com/leonied7/vue-validate-form/commit/0262c27e00741ca2d9b474cd9110d7a1e3bc1c7c))


### Bug Fixes

* change focusFirstInvalidField => focusInvalidField ([51503da](https://github.com/leonied7/vue-validate-form/commit/51503da02f86a448d2073ae11ac0cbdb4af54e9c))
* re-check validate on submit ([976efb3](https://github.com/leonied7/vue-validate-form/commit/976efb36f35cc6fe06edd9ba5f8ca4ac70f4db71))
* remove depend isequal, value => params in rules ([2628304](https://github.com/leonied7/vue-validate-form/commit/26283047841d6750cb26755f5b3360057295d91f))
* remove setErrors, rename setFieldError => setError ([dcc2d41](https://github.com/leonied7/vue-validate-form/commit/dcc2d41be802ec3c2fa779f3501b03348e033649))

### [0.0.4-alpha.1](https://github.com/leonied7/vue-validate-form/compare/v0.0.4-alpha.0...v0.0.4-alpha.1) (2020-11-08)

### [0.0.4-alpha.0](https://github.com/leonied7/vue-validate-form/compare/v0.0.3...v0.0.4-alpha.0) (2020-11-08)

### [0.0.3](https://github.com/leonied7/vue-validate-form/compare/v0.0.2...v0.0.3) (2020-11-08)


### Features

* add github action ([b3207fb](https://github.com/leonied7/vue-validate-form/commit/b3207fbc1df5925b0d3968bc3a79b48b49fe2cf8))
* add reset method ([d2d3e91](https://github.com/leonied7/vue-validate-form/commit/d2d3e913f85239aed2e2e8e04e37136c087c2b8f))


### Bug Fixes

* add lodash.clonedeep to external ([1374f4a](https://github.com/leonied7/vue-validate-form/commit/1374f4a883b3f23001dbe8e1c294aa1527220a1d))
* release yml syntax ([b51be1f](https://github.com/leonied7/vue-validate-form/commit/b51be1f3b3b35f97e5d62739c5191fe6ee151ab5))

### 0.0.2 (2020-11-04)


### Features

* add eslint/prettier ([d066a0a](https://github.com/leonied7/vue-validate-form/commit/d066a0afe52e9fbd43ea3c39c7a42aa4c192099d))
* add methods for errors ([b555e4b](https://github.com/leonied7/vue-validate-form/commit/b555e4ba24778fa641dcb60a4676c2cff8496c93))
* add methods for errors ([5bde554](https://github.com/leonied7/vue-validate-form/commit/5bde5546dda07930ef1e65ed91e00387f55e1426))
* add standard-version, update rollup config ([6ae8056](https://github.com/leonied7/vue-validate-form/commit/6ae8056e1a957590ea98646a36409ba64cca6a57))
* add validator`s container, check validator on submit ([47aed55](https://github.com/leonied7/vue-validate-form/commit/47aed5591ec31fe87e2fbc6c03ddb0a0edf78466))
* change value => modelValue and change => update:modelValue ([eea70cf](https://github.com/leonied7/vue-validate-form/commit/eea70cf789e4ae5cdb55bfa1658b3f44d54ecffc))
* check field validate on value change ([b720483](https://github.com/leonied7/vue-validate-form/commit/b72048319c8004cb48941fe00e13731ba8bca531))
* minimal concept ([2390b08](https://github.com/leonied7/vue-validate-form/commit/2390b08ae934e6f738a113d702d551be0412041b))
* transform values as nested object ([53d8376](https://github.com/leonied7/vue-validate-form/commit/53d8376f2c616b948e73451542b2c1aff724dba9))
* update concept ([1dde304](https://github.com/leonied7/vue-validate-form/commit/1dde30482331a2e4669c5ae90ccecb9659f29a41))
* ValidationField work as controlled/uncontrolled ([c776faf](https://github.com/leonied7/vue-validate-form/commit/c776faf78f932a603a753bb1a6941e30b4afc86d))


### Bug Fixes

* change package name ([0153115](https://github.com/leonied7/vue-validate-form/commit/01531156f1114fcb6e26dcf1e580aaa90510c459))
* require => required for modelValue ([74a6eb6](https://github.com/leonied7/vue-validate-form/commit/74a6eb6357edb04a3d2affe08b254556f68f1b4d))
