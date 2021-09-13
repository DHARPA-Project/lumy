# Lumy (Electron) Jupyter App

This package contains two things:

- a JupyterLab server platform based app that runs Lumy only. It can be thought of as a JupyterLab instance with all other widgets and extensions removed. Jupyter platform manages kernel, connections for the Lumy web app and authentication.
- Electron desktop app code. This code creates a browser window, starts conda installer if needed and launches the Lumy JupyterLab server app mentioned above.w

The JupyterLab server app is based on the standalone Jupyter server apps examples that can be found[here](https://github.com/jupyterlab/jupyterlab/tree/master/examples).

## Table of contents

- [Running in Electron](#running-in-electron)
  - [With dedicated Conda environment](#with-dedicated-conda-environment)
  - [With existing virtual environment](#with-existing-virtual-environment)
- [Running in browser (development)](#running-in-browser)
- [Useful Electron app flags](#useful-electron-app-flags)
- [Middleware version](#middleware-version)

## Running in electron

Build the web app and the electron app:

```
yarn webapp:build
yarn electron:build
```

### With dedicated Conda environment

Start Lumy within the dedicated Conda environment:

```
yarn electron:serve
```

**NOTE**: Electron app will check if you have a sandboxed Conda ready in the expected location (see below). If it is not found, the app will download Conda and install it there with all dependencies.

Depending on the OS, Conda will be installed in:

- **Mac**: `~/.local/share/Lumy/miniconda` and a symbolic link created in `~/Library/Application\ Support/Lumy/miniconda`
- **Win**: `C:\apps\Lumy\miniconda`
- **Linux**: `~/.local/share/Lumy/miniconda`

### With existing virtual environment

#### Virtual environment

If you already have a virtual environment with the Lumy middleware and Kiara already installed, you can tell the app to avoid installing and using the sandboxed Conda environment. To do this, start the app with the following flag:

```
SKIP_CONDA=1 yarn electron:serve
```

**NOTE** You need to make sure that you also have [JupyterLab Server](https://github.com/jupyterlab/jupyterlab_server) installed and the virtual environment activated:

```
pip install jupyterlab_server
```

## Running in browser

This method is useful for running Lumy app in a development environment outside of an Electron app and JupyterLab.

### Starting the back end

The backend needs to be started separately. Prepare the back end startup code:

```
yarn electron:build
```

#### Starting backend within a dedicated Conda environment

On Mac/Linux:

```
bash src/server/scripts/run/macnix.sh
```

On Windows:

```
powershell.exe src/server/scripts/run/win.ps1
```

#### Starting backend within existing virtual environment

Same as above, but with the `--skip-conda` argument.

### Starting the web app

Build the Lumy web app:

```
yarn webapp:build
```

To enable Webpack hot reloading we can proxy the Jupyter endpoints from the app and load the web app part via Webpack. The [webpack file](webpack.config.webapp.js) contains all the code needed for it.

```
yarn webapp:serve
```

## Useful Electron app flags

- `FORCE_POWERSHELL=1 yarn electron:serve` - force use of PowerShell installer / backend runner on Mac. PowerShell `pwsh` needs to be installed.
- `SKIP_CONDA=1 yarn electron:serve` - skip installer and Conda environment activation. Useful for working with a custom virtual environment.
- `FORCE_INSTALL=1 yarn electron:serve` - force re-running the Conda installer even if the environment is ready. This will update all python dependencies.

## Middleware version

The version of the middleware to be used by the app is defined in `package.json` file under `lumy.middleware.version`. This is the version that is compiled into electron main process file. This version is checked by the startup script and an installer is launched if the installed version of the middleware is different from the required version. The installer updates the version of the middleware.

You can override the version by starting the electron process with `MIDDLEWARE_VERSION` environmental variable set to the version you want it to install. Alternatively if you want to run the app with whatever version of the middleware is installed in the virtual environment, you can set the version to `any`. This method is useful during development.
