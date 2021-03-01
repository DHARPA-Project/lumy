# JupyterLab extension for DHARPA VRE

Created from [this starter project](https://github.com/DHARPA-Project/jupyterlab-extension-example).

## Running in development mode

Make sure you have `JupyterLab 3.x` installed.

Preferably run JupyterLab and commands below in a dedicated virtual environment. VSCode configuration for this project assumes that virtual environment is located in `.venv` directory in the root of this project. You can symlink your existing virtual environment there.

In a terminal session start JupyterLab:

```shell
jupyter lab
```

In another terminal session:

```shell
# Install dependencies
yarn install

# Install python package (similar to pip install -e)
# Makes the extension available in JupyterLab in development mode.
yarn develop
```

Then to watch files for changes and recompile run:

```shell
yarn watch
```
