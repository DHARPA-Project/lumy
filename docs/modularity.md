# Lumy modules and workflow

Lumy is designed to be easily extended by plug-ins. A third party workflow can be opened and executed in Lumy without any extra user involvement. The application will install all required Kiara dependencies and packages that contain workflow UI pages that the user will be interacting with. All information needed for this to happen is provided in a `Lumy workflow` file.

## Lumy workflow

Lumy workflow is a YAML file. The structure of this file is defined in the [corresponding JSON schema](../schema/json/types/workflow/LumyWorkflow.json).

In this document we will use an imaginary `linear_classifier` workflow to explore the content of a Lumy workflow.

The imaginary `linear_classifier` Kiara pipeline defines the standard [Linear classifier](https://en.wikipedia.org/wiki/Linear_classifier#Definition) function with the following formula:

```
y = threshold(W•x + b)
```

where:

- `W` and `x` are vectors
- `b` is a scalar
- `•` is a vector dot product and
- `threshold` function returns `1` if its argument is greater than `0`, and returns `0` otherwise.
- the result `y` is a scalar (`1` or `0`)

It is provided by a `kiara_modules.math` Python package and is defined as follows:

```json
{
  "module_type_name": "linear_classifier",
  "doc": "Calculates y = threshold(W•x + b)",
  "steps": [
    {
      "module_type": "math.dot_product",
      "step_id": "dot_product"
    },
    {
      "module_type": "math.sum",
      "step_id": "sum",
      "input_links": {
        "a": "dot_product.result"
      }
    },
    {
      "module_type": "math.threshold",
      "step_id": "threshold",
      "input_links": {
        "x": "sum.result"
      }
    }
  ],
  "input_aliases": {
    "dot_product__w": "w",
    "dot_product__x": "x",
    "sum__b": "b"
  },
  "output_aliases": {
    "threshold__result": "y"
  }
}
```

The corresponding Lumy workflow that uses the pipeline above is defined as follows:

```yaml
processing:
  workflow:
    name: math.linear_classifier
  dependencies:
    pythonPackages:
      - name: kiara-modules.math>=0.1.0
  data:
    transformations:
      - sourceType: vector
        targetType: array
        # view: default
        pipeline:
          name: math.vector_to_array
      - sourceType: array
        targetType: vector
        # view: default
        pipeline:
          name: math.array_to_vector
ui:
  dependencies:
    pythonPackages:
      - name: lumy-modules.math>=0.1.1
  pages:
    - id: vectorEntry
      component:
        id: vectorEntryPanel
        url: lumymodule://math_ui
      meta:
        label: Vector data entry
      mapping:
        inputs:
          - pageIoId: weights
            workflowIoId: w
            workflowStepId: dot_product
          - pageIoId: data
            workflowIoId: x
            workflowStepId: dot_product
    - id: biasAdjustmentAndResult
      component:
        id: biasAdjustmentAndResultPanel
        url: lumymodule://math_ui
      meta:
        label: Bias adjustment and result display
      mapping:
        inputs:
          - pageIoId: bias
            workflowIoId: b
            workflowStepId: sum
        outputs:
          - pageIoId: result
            workflowIoId: result
            workflowStepId: threshold
          - pageIoId: weights
            workflowIoId: w
            workflowStepId: dot_product
          - pageIoId: data
            workflowIoId: x
            workflowStepId: dot_product
      layout:
        dataPreview:
          - type: output
            id: weights
          - type: output
            id: data
meta:
  label: Linear classifier
```

> :warning: Lumy workflow is not the same thing as Kiara workflow. Kiara workflow does all data processing and can be executed in Kiara outside of Lumy. Lumy workflow contains all information missing in a Kiara workflow but needed for a Kiara workflow to be executed in Lumy.

There are three main parts of a Lumy workflow: processing, ui and metadata.

### Lumy workflow - processing part

The name of the Kiara workflow (pipeline) that is being executed in this workflow is referenced as follows:

```yaml
workflow:
  name: math.linear_classifier
```

The Kiara workflow mentioned is likely not shipped by default with Lumy and is provided by an external Python package. Lumy can be instructed to install missing Python package (or packages) as follows:

```yaml
dependencies:
  pythonPackages:
    - name: kiara-modules.math>=0.1.0
```

Note the Pythonic syntax of the package id, it is the same as in `requirements.txt`.

#### Data type conversion

Linear classifier formula works with vectors. The `linear_classifier` Kiara pipeline assumes that `W` and `x` are vectors. This is a custom Kiara type provided as a Python class which is understood by modules that work with it. In Python this class may be implemented on top of Numpy arrays or use its own internal data structures.

In Kiara world we do not care about the particular data type implementation because all the steps of the workflow know how to deal with it. However in Lumy the situation is different. Lumy has both a back end and a front end parts. To be transferred between the two parts all data needs to be serialised on the back end and deserialised on the front end and vise versa.

Lumy only knows how to serialise/deserialise the following data types:

- JSON supported primitives: integer, float, boolean, string, null
- JSON supported containers: array, dict/object
- Apache Arrow Table

The custom `vector` type is not one of these types. This means that we need to provide instructions how to convert between the custom `vetor` type and a type that Lumy knows how to deal with (`array` in our example). To do this we define a `transformation` section:

```yaml
data:
  transformations:
    - sourceType: vector
      targetType: array
      # view: default
      pipeline:
        name: math.vector_to_array
    - sourceType: array
      targetType: vector
      # view: default
      pipeline:
        name: math.array_to_vector
```

Since we want to allow the user to enter the vectors via the UI and also be able to render the vectors, we need to define two converters: `vector` -> `array` and `array` -> `vector`.

A converter is a standard Kiara module that must expose one input called `source` and one output called `target`.

> In some cases a custom type can be converted to a standard type in more than one way. For example a `network_graph` type can be represented as a `table` of nodes or a `table` of edges. Two different transformer modules will be needed to convert between the two. To tell Lumy which converter to use we will need to tag every `transformations` entry with a `view` tag. This tag will be used later in the UI section.

### Lumy workflow - UI part

Since workflows are prepared by third parties, UI pages are not included in Lumy. The standard way of distributing UI pages for workflows is preparing and publishing them as Python packages, the same way as Kiara. The Python packages dependencies are listed the same way as Kiara modules in the processing part.

```yaml
dependencies:
  pythonPackages:
    - name: lumy-modules.math>=0.1.1
```

#### Mapping Kiara inputs/outputs to Lumy pages inputs/outputs

For the end user a Kiara workflow can be seen as a set of inputs (data points that can be modified to trigger processing) and outputs (read only data points that react to modifications in inputs). These inputs and outputs can be represented as UI elements spread across one or more workflow pages.

In our imaginary linear classifier workflow we defined two pages:

- a data entry page where the user enters values for the `weights` vector and the `data` vector. This page has two standard text input fields that take comma separated vector values that do all input validation: one for `weights` and another for `data`.
- a bias entry and result rendering page. It contains a text field where the user enters the `bias` value and a fat bold dot that turns green if the result of the function is `1` and red if it is `0`.

Pages are defined in the `ui.pages` section. A page definition has several sections:

```yaml
- id: vectorEntry
  component:
    id: vectorEntryPanel
    url: lumymodule://math_ui
  meta:
    label: Vector data entry
  mapping:
    inputs:
      - pageIoId: weights
        workflowIoId: w
        workflowStepId: dot_product
      - pageIoId: data
        workflowIoId: x
        workflowStepId: dot_product
```

The `id` is required to distinguish between pages. It can be any (preferably human readable) text.

The `component` section defines the React UI component to use to render this page. It contains the component `id` and the `url` of the module that provides this component. The module URL references modules provided by the `lumy-modules.math` package defined in the dependencies section above. See the `modules` section of this document to understand how UI modules are exposed in Python packages.

The `metadata` section defines a `label` used as the title of the page.

The `mapping` section maps inputs and outputs between Kiara workflow and Lumy workflow.
Each input and output has an ID it is referenced by in the page UI component (`pageIoId`) and a pair of IDs referencing Kiara workflow step (`workflowStepId`) and its input or output (`workflowIoId`).

In this example the UI page component sets data on `weights` input when the user modifies the weights via the text field. Using the mapping Lumy understand it needs to set the `w` input value on the `dot_product` step of the Kiara workflow.

```typescript
const [weights, , setWeights] = useStepInputValue<number[]>(stepId, 'weights', { fullValue: true })
```

> an optional `view` field can be specified here to hint which particular data type transformer should be used here.

Page mapping has optional `layout` section that is reserved for hints for the application about rendering of the page. The `dataPreview` subsection instructs Lumy to render certain inputs and outputs in the Data Preview side panel:

```yaml
layout:
  dataPreview:
    - type: output
      id: weights
    - type: output
      id: data
```

In the example above the instructions tell Lumy to render `weights` and `data` vectors in the data preview side panel when the user is on the `biasAdjustmentAndResult` page.

> an optional `view` field can be specified here to hint which particular data type transformer should be used here.

## Developing, preparing and distributing Lumy UI modules

Lumy UI modules are used to render Lumy workflow pages which allow the user to see and edit data from inputs/outputs of a Kiara workflow that the Lumy workflow uses.

UI modules are simple React components that use Lumy hooks to access data. The components are loaded into Lumy as JavaScript code. This means that they need to be bundled as a single JavaScript file and made publicly available for Kiara to be able to download and used them.

The standard way of distributing Lumy UI modules are Python packages (see distribution section later).

### Development

Lumy UI modules are independent pieces of code and developers do not need to have Lumy or Kiara installed and running to write and test them. A simple mock data processing function can be used to mimic processing that normally happens in the back end part of Lumy (see [this example](https://github.com/DHARPA-Project/lumy/blob/master/packages/modules/src/networkAnalysisDataVis/index.tsx)).

```typescript
import { withMockProcessor } from '@lumy/client-core'

// ...

const mockProcessor = (inputValues: InputValues): MockProcessorResult<InputValues, OutputValues> => {
  // do something with inputValues ...
  return {
    inputs: {
      /* input values */
    },
    outputs: {
      /* output values */
    }
  }
}

const MyPage = ({}: ModuleProps): JSX.Element => {
  // ...
  return <div>// ...</div>
}

export default withMockProcessor(MyPage, mockProcessor)
```

Modules are normally developed in the module sandbox app. The sandbox app is a simple React app which is compiled and served using the `webpack dev server`:

```bash
webpack serve -c webpack.config.js
```

A sample webpack config file can be found [here](https://github.com/DHARPA-Project/lumy/blob/master/packages/modules/webpack.config.js).

The app is enabled by placing the following code into the top level `index.ts` file of the UI module project (see [this example](https://github.com/DHARPA-Project/lumy/blob/master/packages/modules/src/index.ts)):

```typescript
if (process.env.NODE_ENV !== 'production') {
  require('@lumy/module-sandbox').sandbox()
}
```

The environment variable condition ensures that the sandbox code is not bundled into the module file when it is built for use in Lumy.

### Registering a UI component

A React component that will be used in a workflow needs to be registered and assigned a package wide unique ID:

```typescript
import { lumyComponent } from '@lumy/module-core'
import MyVerySpecialWorkflowPage from './pages/MyVerySpecialWorkflowPage'

lumyComponent('myVerySpecialPage')(MyVerySpecialWorkflowPage)
```

### Bundling and releasing

The UI module has to be compiled into a single JavaScript file that later will be loaded by Lumy. More than one UI module can be declared and bundled in one file (see [this example](https://github.com/DHARPA-Project/lumy/blob/master/packages/modules/src/index.ts)). Compilation is handled by `webpack`.

The standard and recommended way of distributing the modules is by preparing them as a Python module which contains the module JavaScript code as a resource and a simple function that reads this resource file and returns it as a string (See [this example](https://github.com/DHARPA-Project/lumy/blob/master/packages/modules/pkg/lumy_modules/network_analysis/__init__.py)):

```python
import pkgutil

def get_code() -> str:
    return pkgutil.get_data(__name__, "resources/index.js").decode('utf-8')
```

> :warning: Non `.py` files are omitted by python `sdist` and `bdist_wheel` commands. To make sure `.js` files are included into the final package, add the following line to the `MANIFEST.in` file: `recursive-include pkg/* *.js`

This function then needs to be assigned a `plugin ID` and registered in the `setup.py` (or `setup.cfg`) file, which will make it discoverable by Lumy when the package is installed into the Lumy Python environment. The following declaration is added to the `entry_points` list in the `setup.py` or the `setup.cfg` files:

```python
'lumy.modules': [
    'plug_in_id = lumy_modules.my_plug_in:get_code'
]
```

This method will be familiar for those who has experience writing and distributing custom Kiara modules.

See `lumy-middleware` documentation for more information about how Lumy does dynamic loading of these plug-ins.

#### Releasing

It's a two step process:

- Prepare JavaScript bundle: `NODE_ENV=production webpack build -c webpack.config.js`
- Build the Python package: `python setup.py sdist bdist_wheel`
- Publish the package to [pypi.org](https://pypi.org/) (see [this tutorial](https://packaging.python.org/tutorials/packaging-projects/))

#### Using a module in Lumy workflow

A module is referenced in a Lumy workflow like this:

```yaml
component:
  id: myComponentId
  url: lumymodule://plug_in_id
```

##### Alternative methods of loading a module

A module can also be loaded

- from a URL, e.g. `https://foo.com/plugin-file.js`. This method is not recommended because it requires the user to be connected to the Internet.
- a file on disk: `file://../foo/com/plugin-file.js`. This method should only be used during development.
