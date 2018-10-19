# React TypeScript Runtime

React TS Runtime is a package that contains all the tooling you need to build your React project written in TypeScript.

# Setup

```bash
mkdir yourproject
cd yourproject
npm init -y
npm install react-ts-runtime --save-dev
```

Create an [src/index.tsx](/demos/single-page-react/src/index.tsx)

Create an [src/index.html](/demos/single-page-react/src/index.html)

Set the scripts section to the following in your package.json

```json
{
    "start": "react-ts-runtime run",
    "build": "react-ts-runtime build",
}
```

Run ```npm start``` to start the project up in development mode.

Run ```npm run build``` to build the project.

# Demos

[Single page React application](/demos/single-page-react/)

[Server side rendering](/demos/server-side-rendering/)