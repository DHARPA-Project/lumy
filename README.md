# DHARPA VRE mono repo

## Structure

All front end Typescript packages are in `packages` directory, except the `jupyterlab-extension` package which is in `applications` directory.

All back end Python packages are in `backend`.

JSON schema files are in `schema/json`.

### Front end packages

Configuration files for [eslint](https://eslint.org/), [prettier](https://prettier.io/) and base configuration file (`tsconfig.base.json`) for Typescript are here, in the top level directory.

Use [yarn](https://yarnpkg.com/) instead of `npm` because `yarn` has mono repo support without external packages.

### Back end packages

TBD

### VSCode support

A `.vscode` directory contains basic settings for linter, formatter and Python.
If working with python, the settings expect `virtualenv` directory to be in this top directory as `.venv`.

### Code generation

Data types are defined as JSON schemas. Corresponding Python and TypeScript code is generated from the schemas. Code can be regenerated from `tools` directory (run `yarn install` there first):

```
yarn gen
```

### Code health check

To lint and type check all code (especially useful before pushing to GitHub which runs this as a post push action):

```
yarn verify
```

Or do it separately for each language:

```
yarn typescript:check
yarn python:check
```

## Running in development mode

### Running within JupyterLab

Convenient because it manages iPython kernels and either terminal or a notebook can be attached to a running kernel.

#### 1. Virtualenv

Prepare a dedicated [virtualenv](https://virtualenv.pypa.io/en/latest/user_guide.html#introduction) with Python 3.7+.

```
virtualenv .venv
source .venv/bin/activate
```

#### 2. Install Python requirements

Jupyter Lab

```
pip install jupyterlab>=3.0.0
```

VRE middleware in development mode

```
pip install -e backend/jupyter-middleware
```

#### 3. Install Jupyter Lab extension

The following steps are executed in `applications/jupyterlab-extension` directory.

Prepare dependencies and install the extension into Jupyter Lab:

```
yarn install
yarn develop
```

Start Jupyter Lab in a terminal session:

```
jupyter lab
```

In _another_ terminal session start the watcher process that will watch for changes in the Typescript code, recompile them and make them available in Jupyter Lab extension:

```
yarn watch
```

Jupyter Lab tab needs to be reloaded to get the changes applied.

### Running front end as a standalone web app with mocked back end

The following steps are executed in `applications/standalone` directory.

```
yarn install
```

Then start [Webpack dev server](https://webpack.js.org/configuration/dev-server/) that will watch and recompile TypeScript files and then reload the browser tab.

```
yarn start
```

The web app is available on [http://localhost:8080/](http://localhost:8080/).

## Modules panels

Modules panels components are in `packages/modules`. Generally one file per module, mapped to module by `id` in the `index.ts`.


## Repository structure overview

<img width="1007" alt="Screen Shot 2021-03-18 at 18 15 40" src="https://user-images.githubusercontent.com/89853/111668423-05a09480-8816-11eb-92c4-6629dffe6ef9.png">
