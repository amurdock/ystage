# [1.3.0](https://github.com/amurdock/ystage/compare/v1.2.3...v1.3.0) (2019-01-21)


### Features

* **run:** Include forwarded parameters for run command ([e79be3c](https://github.com/amurdock/ystage/commit/e79be3c))

## [1.2.3](https://github.com/amurdock/ystage/compare/v1.2.2...v1.2.3) (2019-01-16)


### Bug Fixes

* **Configuration:** fixed configuration for loglevel and path ([1c892a0](https://github.com/amurdock/ystage/commit/1c892a0))

## [1.2.2](https://github.com/amurdock/ystage/compare/v1.2.1...v1.2.2) (2019-01-10)


### Bug Fixes

* **stage:** Switch back to using relative paths as absolute paths won't work in a docker container. ([351074a](https://github.com/amurdock/ystage/commit/351074a))

## [1.2.1](https://github.com/amurdock/ystage/compare/v1.2.0...v1.2.1) (2019-01-10)


### Bug Fixes

* **stage:** Fix logging of correct command. ([55bc2ba](https://github.com/amurdock/ystage/commit/55bc2ba))
* **stage:** Fix resolution of development dependencies. ([811d57a](https://github.com/amurdock/ystage/commit/811d57a))

# [1.2.0](https://github.com/amurdock/ystage/compare/v1.1.0...v1.2.0) (2019-01-09)


### Features

* **stage:** Initial implementation of the new stage command. ([5036281](https://github.com/amurdock/ystage/commit/5036281))

# [1.1.0](https://github.com/amurdock/ystage/compare/v1.0.0...v1.1.0) (2019-01-07)


### Features

* **commands/run.js:** Allow filtering of the run command based on a git commit sha. ([408b128](https://github.com/amurdock/ystage/commit/408b128))
* **commands/run.js:** Complete initial release of run command, added logging and fixed error handli ([eb72557](https://github.com/amurdock/ystage/commit/eb72557))
* **src/commands/run.js:** Added a --include-dependencies command line argument to enable the inclus ([d432d77](https://github.com/amurdock/ystage/commit/d432d77))
* **src/commands/run.js:** Added pattern filter. ([b46761c](https://github.com/amurdock/ystage/commit/b46761c))
* **src/commands/run.js:** Added stage argument to run command ([ebd88f5](https://github.com/amurdock/ystage/commit/ebd88f5))

# 1.0.0 (2018-12-16)


### Features

* **component:** Added commitzen ([6a40c48](https://github.com/amurdock/ystage/commit/6a40c48))
