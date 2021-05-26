# Jupyter App

This is a Jupyter platform based app that runs Lumy only. It can be thought of as a JupyterLab instance without any other widgets but Lumy. Jupyter platform here manages kernel, connections for the Lumy web app and authentication. The rest is a pure web app.

The app is based on the standalone Jupyter server apps examples [here](https://github.com/jupyterlab/jupyterlab/tree/master/examples).

The Lumy app can run either in the browser or in Electron.

## Running in electron

Build the web app and the electron app:

```
yarn webapp:build
yarn electron:build
```

Run electron:

```
yarn electron:serve
```

**NOTE**: Electron app will check if you have a sandboxed Conda ready in the expected location (see below). If it is not found, the app will download Conda and install it there with all dependencies.

Depending on the OS, Conda will be installed in:

- **Mac**: `~/.local/share/Lumy/miniconda` and a symbolic link created in `~/Library/Application\ Support/Lumy/miniconda`
- **Win**: `C:\apps\Lumy\miniconda`
- **Linux**: `~/.local/share/Lumy/miniconda`

#### Virtual environment

If you already have a virtual environment with the Lumy middleware and Kiara already installed, you can tell the app to avoid installing and using the sandboxed Conda environment. To do this, start the app with the following flag:

```
SKIP_CONDA=1 yarn electron:serve
```

You need to make sure that you also have [JupyterLab Server](https://github.com/jupyterlab/jupyterlab_server) installed and the virtual environment activated:

```
pip install jupyterlab_server
```

## Running in browser

## Starting the back end

The backend needs to be started separately.

Build the back end:

```
yarn electron:build
```

### With sandboxed Conda

On Mac/Linux:

```
bash src/server/scripts/run/macnix.sh
```

On Win:

```
powershell.exe src/server/scripts/run/win.ps1
```

## With custom virtual environment

Same as above, but with the `--skip-conda` argument.

## Starting the web app

Build the Lumy web app entry point.

```
yarn webapp:build
```

## Running in development mode

To enable Webpack hot reloading we can proxy the Jupyter endpoints from the app and load the web app part via Webpack.

```
yarn webapp:serve
```

## Building for production

```
yarn webapp:build
```

## Useful Electron app flags

- `FORCE_POWERSHELL=1 yarn electron:serve` - force use of PowerShell installer / backend runner on Mac. PowerShell `pwsh` needs to be installed.
- `SKIP_CONDA=1 yarn electron:serve` - skip installer and Conda environment activation. Useful for working with a custom virtual environment.
- `FORCE_INSTALL=1 yarn electron:serve` - force re-running the Conda installer even if the environment is ready. This will update all python dependencies.
