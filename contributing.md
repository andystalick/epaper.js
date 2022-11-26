# Contributing to this project

_Note this document is a rough draft_

This project uses pnpm workspaces to link the different packages together into a monorepo. When developing locally, you should use pnpm instead of npm. To get started...

* Install pnpm

    Since v16.13, Node.js is shipping Corepack for managing package managers. This is an experimental feature, so you need to enable it by running: `corepack enable`

    This will automatically install pnpm on your system. However, it probably won't be the latest version of pnpm.

    With Node.js v16.17 or newer, you may install the latest version of pnpm by just specifying the tag: `corepack prepare pnpm@latest --activate`

* Clean out any npm temporary files with something like `git clean -xfd`

* Run `pnpm install` from the root of the project. This will install all dependencies and symlink all the packages together

* Add a link to your new package in the root `tsconfig.json`

* Edit `packages/cli/deviceFactory.ts` to include your new package

* Add your device in `packages/cli/package.json` with the source `"workspace:^"`

* Running `pnpm build:clean` will compile the typescript for all the packages. You can do an incremental build (only build what changed) by running `pnpm build`

* You can build the c / c++ code for your package by running `pnpm build:clean` from the root of the `packages/<package>` directory. You can build all the typescript code and all the c/c++ code by running `pnpm -r build:clean` from the root of the project.

Hopefully that's enough to get you started.