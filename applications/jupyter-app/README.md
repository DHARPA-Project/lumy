# Jupyter App

This is a Jupyter platform based app that runs VRE only. It can be thought of as a JupyterLab instance without any other widgets but VRE. Jupyter platform here manages kernel, connections for VRE and authentication. The rest is pure VRE webapp.

The app is based on the standalone Jupyter server apps examples [here](https://github.com/jupyterlab/jupyterlab/tree/master/examples).

## Prerequisites

You will need a [Jupyterlab Server](https://github.com/jupyterlab/jupyterlab_server) installed:

```
pip install jupyterlab_server
```

If you already have JupyterLab installed in virtual environment, this server is already installed.

## Running

Build the VRE webapp entry point.

```
yarn build
```

Run the VRE app:

```
python main.py
```

## Running in development mode

To enable Webpack hot reloading we can proxy the Jupyter endpoints from the app and load the webapp part via Webpack.

In one terminal session start the app:

```
python main.py
```

In the other session start Webpack dev server in watch mode.

```
yarn serve
```

Access the Webpack dev server via http://localhost:8080
The first time the Jupyter app is started, the webapp accessed via webpack dev server will not be able to authenticate with Jupyter. To authenticate, copy the token displayed in the output of the `yarn start` terminal session and append it to the webpack dev server URL: `http://localhost:8080?token=<token-from-the-other-session>`.

## Running as an Electron app

**NOTE**: This will work in "development" mode. Packaging has not been sorted out yet.

Build webapp part:

```
yarn build
```

Build electron part:

```
yarn compile-electron
```

Start electron:

```
yarn run-electron
```
