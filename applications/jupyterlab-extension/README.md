# Lumy JupyterLab extension

Created from [this starter project](https://github.com/DHARPA-Project/jupyterlab-extension-example).

Code for packaging Lumy as a JupyterLab extension. See [this guide](https://jupyterlab.readthedocs.io/en/stable/extension/extension_tutorial.html#extension-tutorial) for more information about developing JupyterLab extensions.

## Running in development mode

Make sure you have `JupyterLab 3.x` installed.

Preferably run JupyterLab and commands below in a dedicated virtual environment. VSCode configuration for this project assumes that virtual environment is located in `.venv` directory in the root of this project. You can create `.venv` symlink to your existing virtual environment.

In a terminal session start JupyterLab:

```shell
jupyter lab
```

In another terminal session (in this directory):

```shell
# Install dependencies
yarn install

# Install python package (similar to pip install -e)
# Makes the extension available in JupyterLab in development mode.
yarn develop
```

Then build and watch files for changes and recompile run:

```shell
yarn watch
```

When the compilation is complete, reload the JupyterLab browser window. This will make JupyterLab reload Lumy extension code.
