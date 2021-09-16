# Lumy design decisions

This document attempts to answer questions why particular technology or architectural approach was chosen in Lumy.

When making these choices we were using a set of user stories collected by the DHARPA team during Q1 2021. As some user stories were contradicting, vague and inconclusive we tried to group and skim them to come up with a set of core requirements that were unlikely to change, leaving room for the other requirements that could evolve and change during the course of the project. The likelihood of change of requirements was also the key factor of making certain decisions: choosing technology and design patterns that would give us flexibility and allow us to avoid rewriting the software if requirements change.

Main areas of interest from the DHARPA project description have also been taken into account.

It has also been decided that Lumy should use [Kiara](https://github.com/DHARPA-Project/kiara) as the processing engine. At DHARPA Kiara is treated as a standalone project with its own goals, therefore Lumy would need to adapt to Kiara design decisions, as Kiara developers would not necessarily accept feature requests from Lumy.

## Core requirements

DHARPA project description emphasized that we are building an `extensible` platform that provides a set of `tools` to let a `wider audience` conduct `reproducible` `experiments`.

The platform revolves around the four main aspects:

- data management
- workflow
- visualisation
- environment

**Data management**

The platform should provide interfaces for managing data items in user's data repository. Data repository management is handled by `Kiara`: lifecycle, metadata, conversion/format, entities, metadata, attaching notes to data item versions. However we assume that certain aspects have to be handled by Lumy: moving data in and out of Kiara domain, metadata templates management, data conversion in certain cases. It is also not clear whether Kiara will handle note taking.

**Workflow**

The platform should be able to load and execute data processing workflows. The execution engine is `Kiara`, which is responsible for parsing, loading and execution of the workflows. Kiara is not responsible for execution orchestration.

**Visualisation**

The platform should provide reusable rich UI elements for visualising and exploring data processed by workflows.

**Environment**

The platform should be available to a wider audience and should not require the user to have programming skills. The platform should run on a desktop computer (Windows, Mac, Linux). However there is a high chance it will be expected that the platform becomes available in cloud later.

## Platform technical overview

The platform can be split into the following functional blocks for the sake of this document:

- `Engine`
- `Middleware`
- `Server/Orchestrator`
- `Front End`
- `App Container`

### Engine

The engine is the lowest level block. It is responsible for executing a workflow and managing data. It provides API that is used to control workflow loading and execution and perform data operations: read, list, create, delete.

It has been decided that `Kiara` should be used as the engine. No investigation of alternative solutions has been done on Lumy side.

The engine is controlled entirely by the middleware which declares a set of abstract interfaces that engine wrapper should implement (see [Middleware](#middleware) section). This means that `Kiara` can be replaced with another engine if needed, without rewriting the middleware apart from the engine wrapper. There is also no need to change the code of the front end.

### Middleware

[The middleware](https://github.com/DHARPA-Project/lumy-middleware) is the layer that allows the front to use the engine and it also contains the most of the business logic needed by the front end that is not handled in the engine. If Lumy was a typical web application with the front end part and the server part, the middleware would be called the server part. All business logic that is not handled by either the engine or the front end, is handled by the middleware.

We chose to write the middleware in Python for the following reasons:

- the `Kiara` engine is written in Python, so having the middleware in Python will make it much easier to use `Kiara` API.
- the Server/Orchestrator layer that needs to run the Python engine will integrate a Python middleware easier than any other language (see [Server/orchestrator](#server--orchestrator)).
- at the start of the project the responsibilities of the engine and the middleware were not clearly defined, so having the common language between the two would make it easier to make changes on the go.

The middleware manages the engine. The middleware is the only mean of interaction with the engine for the front end.

The middleware exposes its API to the front end as a set of [predefined messages](https://github.com/DHARPA-Project/lumy/tree/master/schema/json) in JSON format that are sent to and from the middleware via [WebSockets](https://en.wikipedia.org/wiki/WebSocket) using a [Pub/Sub abstraction](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern).

**Messages**

All the messages are declared in [JSON schema](https://json-schema.org/). JSON is a human readable cross platform format which can be easily deserialised into native objects in both Python and JavaScript. Protocol Buffers, Flat Buffers and Apache Thrift were considered as message formats instead of JSON. They all have the benefit of being smaller when serialised, but they all come with overhead of managing their schemas. The message size is not a problem for Lumy because we do not expect to have very high message rates between the front end and the middleware, and in a desktop application there is no network overhead.

Having messages defined with JSON schema allows us to generate Python and JavaScript code for all messages at once, ensuring that the messages in the front end and the middleware are always in sync.

**Websockets**

The choice of the websockets is justified by the fact that the front end, written in JavaScript/TypeScript and run in the browser (see [Front end](#front-end)) can only communicate with the middleware using a standard HTTP protocol or a WebSockets protocol.

Lumy is a highly interactive application which requires a full duplex communication channel between the front end and the middleware to allow the middleware send messages to the front end asynchronously. Full duplex communication channel is only supported by WebSockets, therefore building the middleware API as a RESTful API or alike was not practical.

The [Pub/Sub pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) is used in both Middleware and the front end as an abstraction layer to make it easier to work with websockets. This is a standard pattern used in the industry when working with websockets.

Messages that middleware deals with are grouped into several logical namespaces (e.g. workflow related messages, notes related messages). Middleware uses several websocket channels to keep the namespaces physically separate: one namespace per websocket channel.

Middleware does not manage the websocket channels lifecycle. Instead it uses [Server/orchestrator](#server--orchestrator) API to request websocket channels when needed.

In terms of code organisation the middleware is technically a library that provides a set of websocket channel listeners which serve as an entry point. It needs a [Server/orchestrator](#server--orchestrator) to execute it.

### Server / Orchestrator

The orchestrator is needed to start and run the middleware process. It also provides the middleware with an API to request websocket channels.

We chose to use the [Jupyter Server](https://github.com/jupyter-server/jupyter_server) as the orchestrator because of a number of benefits:

- It provides an easy to use API for managing the websockets both on the client side (front end) and the server side (middleware). If not Jupyter Server, we would have to write and maintain the websocket management code ourselves because we could not find another popular and well maintained solution to replace it.
- It provides an API for managing Python kernels. The middleware and the engine currently run in a single Python kernel process, however there is a high chance that later there will be a need to run several Python processes in parallel: one process per workflow and possibly each within its own virtual environment to avoid dependency versions conflicts.
- It provides a backend for a number of scientific applications that we often use: Jupyter Notebook, Jupyter Lab, Voila. This means that we can, if needed, integrate Lumy with any of these apps.
- Lumy can be seamlessly launched from within [Jupyter Lab](https://jupyter.org/) as an extension and gain access to developer tools available in Jupyter Lab including the possibility to connect a Jupyter Notebook to the middleware process.
- It provides authentication mechanism out of the box which is used in [Jupyter Hub](https://jupyterhub.readthedocs.io/en/stable/index.html). This is not needed for the desktop version of Lumy, but it will be there ready to use when we decide to release a cloud version of the application.
- It provides a number of extra services that may be needed in Lumy later, like an embedded database.
- It has a small memory footprint, especially if it only runs the middleware.

As was mentioned above the only real alternative to Jupyter Server would be an in house server application that we would have to write and maintain.

### Front End

The front end is the part of the application that the user sees and interacts with.
It also communicates with the middleware in an asynchronous manner to reflect the state of data values and workflow processing.

The front end is a standard web application written in JavaScript/TypeScript. The only alternatives would be desktop only UI frameworks like [Qt](https://www.qt.io/), but we never really considered it because the JavaScript/TypeScript environment provides access to high quality visualisation components and UI design frameworks, it is much easier to find engineers who can work with JS/TS and it is web centric - allowing us to run Lumy in the web environment later when we need.

The front end code can be written in JavaScript or TypeScript (which is then transpiled into JavaScript). We give preference to TypeScript because it provides support of strong types which helps us to avoid a whole range of bugs and save a lot of time and effort on quality assurance.

We chose [React](https://reactjs.org/) as the web framework for the front end. The other modern alternative would be [Vue](https://vuejs.org/), but we chose react because is is more popular and it is easier to find developers with React experience.

We chose [Material UI](https://material-ui.com/) as the UI design framework. The other alternatives considered were Blueprint, Lightning, Semantic. Even though some of the alternatives have been designed specifically for data driven apps, it has been decided that the open source popularity of Material UI and in-house experience with this framework would make it the choice.

The front end follows the [React context pattern](https://reactjs.org/docs/context.html) to access the middleware. The middleware access layer is an [implementation](https://github.com/DHARPA-Project/lumy/blob/master/packages/jupyter-support/src/kernelContext.ts) of [an interface](https://github.com/DHARPA-Project/lumy/blob/master/packages/client-core/src/common/context.ts#L39) that follows the Pub/Sub pattern. Such abstraction allows us to have alternative implementations of the middleware access layer. We used this opportunity to implement a [Sandbox context](https://github.com/DHARPA-Project/lumy/blob/master/packages/module-sandbox/src/backEndContext/sandbox/index.ts#L399) which replaces the actual middleware with an in-memory implementation which can be used during development of the UI components without having to run the real middleware and engine.

**modularity**

The `Kiara` engine allows us to use third party modules and execute third party workflows after they have been installed into the environment.

In a similar fashion the front end can render third party pages and components after they have been installed into the environment. Third party pages and components are distributed as JavaScript files that can be dynamically loaded by Lumy if the workflow file declares them. This is a standard pattern for web based portal and dashboard applications. Dynamic loading of pages and components is described in details [here](https://github.com/DHARPA-Project/lumy/tree/master/packages/modules) and [here](https://github.com/DHARPA-Project/lumy/tree/master/packages/module-core).

Using this approach allows us to draw a clear line between the application UI and the workflow UI. We don't need to release a new version of Lumy every time a new workflow is created.

### App Container

Front end being a web application needs a container to render. Typically it is a browser and this is how it can run by developers. For a desktop application we needed a container that will maintain the look and feel of a native desktop application.

As Lumy does not need any specific features of the host operating system, our only requirements for the container were:

- being able to start a child process of the Server/Orchestrator.
- render browser page view in the main window
- being available for Mac, Windows and Linux platforms

We chose [Electron](https://www.electronjs.org/) as the container because it satisfies all the requirements and is the most popular and well maintained framework for cross platform desktop applications. There are many [alternatives](https://github.com/sudhakar3697/electron-alternatives) to Electron available right now. However they are less popular than Electron and do not provide any particular benefits.
