# Network analysis modules

Code for the Lumy UI modules used in the default Network Analysis workflow.

# Development

The modules can be developed outside of Lumy in the module sandbox app. The sandbox app is a simple React app which is compiled and served using the `webpack dev server`.

The app is enabled by placing the following code into the top level `index.ts` file:

```javascript
if (process.env.NODE_ENV !== 'production') {
  require('@lumy/module-sandbox').sandbox()
}
```

The environment variable condition ensures that the sandbox code is not bundled into the module file when it is built for use in Lumy.

The sandbox app is started using the following command which monitors files for changes and hot swaps the code in the page:

```sh
yarn start
```

# Releasing

To release the module it has to be compiled into a single JavaScript file. Compilation is handled by `webpack`.

The standard and recommended way of distributing the modules is by preparing them as a Python module which contains the module JavaScript code as a resource and a simple function that reads this resource file and returns it as a string.

As an example in the project the `get_code` function located in `pkg/lumy_modules/network_analysis/__init__.py` does this job.

This function then needs to be assigned a `plugin ID` and registered in the `setup.py`, which will make it discoverable by Lumy when the package is installed into the Lumy Python environment. The following declaration is added to the `entry_points` list in the `setup.py` or the `setup.cfg` files:

```python
'lumy.modules': [
    'plug_in_id = lumy_modules.my_plug_in:get_code'
]
```

See `lumy-middleware` documentation for more information on dynamic loading of plug-ins.

## Building process

It's a two step process:

- Prepare JavaScript bundle: `yarn build`
- Build the Python package: `python setup.py sdist bdist_wheel`

## Using in Lumy workflow without a Python package

A module bundled prepared with `yarn build` can be referenced in a Lumy workflow using the following alternative methods:

- as a file URL, e.g. `https://foo.com/plugin-file.js`
- as a file on disk: `file://../foo/com/plugin-file.js`. This method should only be used during development.
