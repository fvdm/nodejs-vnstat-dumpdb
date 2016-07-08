#### 2.0.1 (2016-7-8)

##### Chores

* **cleanup:** Cleaner err check ([38ccf031](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/38ccf031626b39e8e35fd50e501dd6b8c08a483d))
* **package:**
  * Renamed UNLICENSE file to LICENSE ([de90bbce](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/de90bbcedca5a5c25c62bf4377f956c22efb2649))
  * Renamed UNLICENSE file to LICENSE ([860e318c](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/860e318c71a16f7410c3bb3e3d9a028d3b206979))
  * Updated dev deps ([e8037624](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/e80376243546fb8b785dc42e102eb3ba4acd294e))
  * gitignore .*_history files ([fb0e61bb](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/fb0e61bb972b63a63963ba9a8288dfcce9c76397))
  * update eslint to version 3.0.0 ([44a2f072](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/44a2f072b4fbf9df7051ebfd1c483bbecf6e0c6c))

##### Documentation Changes

* **badges:**
  * Added dependencies and coverage ([46492a2c](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/46492a2c3c2ad0b7071e6b16923ec6953845ca20))
  * Add npm version for changelog ([14b5bf57](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/14b5bf57337610d2d996b6eefded721e33514691))

##### Bug Fixes

* **getStats:** Fixed iface iteration break ([c2352093](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/c2352093cdb67eae7a2b505617df3212eb2b980a))
* **errors:**
  * Report command failed instead of stderr ([735a911e](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/735a911ea4b2bcd75e027b4c7662951a8579a335))
  * More useful invalid interface error ([c0884cbd](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/c0884cbde218a53f0bcb90b9ccd28ecc563d028d))
* **setup:** Fixed config defaults ([cae6985b](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/cae6985ba9931440991695be57aa29a0fa1596b7))

##### Other Changes

* **cleanup:** Removed unused vars ([6ad03f98](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/6ad03f98b197000144aa13f2fec45d7f6082de8c))
* **undefined:**
  * always run both test commands ([e480cc5f](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/e480cc5f2dc77bf24bb6ce42d3b658bad48a25ea))
  * added files to include on npm ([a94a96d4](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/a94a96d4aff0a86ad73f15442e4dc4052ab5df03))

##### Refactors

* **main:**
  * Undo return values ([6bda67f1](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/6bda67f1f6d9ef8106e80e28c652167e70528c31))
  * Added return values ([a76c0b11](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/a76c0b11662a807a77cfff88460a5553dec12325))
* **errors:** Moved errors to function ([b4918cc8](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/b4918cc8481819cdc4e2e75da7aae9278acd596c))
* **preinstall:**
  * Allow custom bin path ([c4582057](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/c45820574d041bafd1389624c3621ba0415c22bf))
  * Be quiet when vnstat is correct ([3297174a](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/3297174a7b810ac864a0d685b20a84168dec05b9))
* **package:** Minimum supported node v4.0 ([5f7d16b2](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/5f7d16b262dccf558f77aba3e916771edb258a4f))

##### Tests

* **script:**
  * Undo return value checks ([16d51377](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/16d51377498bfc17f43e6874ae4a7f975902bf8b))
  * Fixed return value checks, whitespace ([9342c651](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/9342c651bfa1612f7a15167d7c3f6e9406ff8d21))
  * Added return value checks ([d1f3785e](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/d1f3785e1e9120bde42bd0ee0782a2b2be64a50f))
  * Added more error tests ([5aa72849](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/5aa72849d7c791092beae97256cf4bfe9dae6fab))
  * Fixed broken iface config ([a7804a04](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/a7804a04e20981ad835e7b0e3973eae06f529864))
  * Fixed iface settings ([5dc5578f](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/5dc5578f9c6e3f0e8bc3786a00c6bc2c2f9aa068))
  * Fixed getStats all array ([e118ae16](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/e118ae16b6c704164543866f7ccc3a457d421c12))
  * Config defaults, bin, iface ([d6e34322](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/d6e34322439be89212267a0038e1aa65818ad417))
* **ci:** Run local bin instead of replacing system vnstat ([982fffaa](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/982fffaa101f0e6f29682dbc40bd4d726ecb94b1))
* **package:** Add coverage dev deps and runner ([44c4a429](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/44c4a4290e0f43db7709d9a33040c85cedbef1b3))
* **lint:** Updated eslint config for ES6 ([c6facff6](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/c6facff60c1466a08b5e83c2936e68abd2e3db12))
* **undefined:** add node v6 to Travis config ([6ff96248](https://github.com/fvdm/nodejs-vnstat-dumpdb/commit/6ff962489d78c0df9c7d5aaa609ffe18653d5439))

