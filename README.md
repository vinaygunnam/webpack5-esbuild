# MicroFrontends with Webpack 5, ESBuild and Module Federation

This repo intends to serve as a quick start to build micro frontends that can be used to compose an client application.

This repo is built using popular libraries such as the following,

- [ESBuild](https://esbuild.github.io/)
- [Webpack 5](https://webpack.js.org/)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)

## Instructions

1. Install dependencies.
   ```sh
   npm install
   yarn
   pnpm install
   ```
2. Serve the app or microfrontend for local development.
   ```sh
   npm run serve
   yarn serve
   pnpm serve
   ```
3. Build the microfrontend. Please use `NODE_ENV=production` for a production quality build.
   ```sh
   NODE_ENV=production npm run build
   NODE_ENV=production yarn build
   NODE_ENV=production pnpm build
   ```

## Configuration

All configuration is consolidated in the file `configuration.json`.

- `name`: This is the unique identifier that identifies a microfrontend in a given app composition.
- `port`: This is the network port used for local development.
- `resources`: Artifacts to expose from the current microfrontend.

## Output

The build output is placed in the `dist` folder along with the following artifacts:

1. `version.txt`: This indicates the version (read from `package.json`) of the current build/deployment.
2. `metadata.json`: This lists the microfrontend identifier and the list of resources available for consumption.
