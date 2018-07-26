# node-ex

This tool solves a problem with running scripts in (specifically) Lerna monorepos. Your monorepo will probably common tools, but each package might have its own specific tools and versions. The package specific tools will be found in `./packages/foo/node_modules/.bin`, and the common packages in `./node_modules/.bin`. However, npm scripts in the nested package will only reference the local binaries. Packages like [`link-parent-bin`](https://www.npmjs.com/package/link-parent-bin) allow you to override the nested package binaries with the parent, but these prevent the nested package from being able to install and of its own tools.

`node-ex` is a simple tool which executes a command with all parent `node_module/.bin` folders placed in the PATH of the command. Your nested binaries, if present, will override the shared binaries.

### Usage

```
npm install -g @mixer/execute-nested-binary
```

You can run your commands by prefixing them with `node-ex`:

```
$ node-ex prettier --help
Usage: prettier [options] [file/glob ...]
```

You can also pass `--where` before the binary to print out its location on your hard drive:

```
$ node-ex --where prettier
/Users/copeet/Github/potatoes/node_modules/.bin
```
