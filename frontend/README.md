# Frontend - Angular Application

This is the Angular frontend for the rempo application built with Angular CLI version 20.3.10.

## Setup

1. Install Node.js dependencies:
```bash

npm install
```

2. Run the development server:
```bash
npm start
```
or
```bash
ng serve
```

The frontend will be available at `http://localhost:4200`.

## Build for Production

```bash
npm run build
```
or
```bash
ng build
```

The production build will be in the `dist/` directory.

## Environment Configuration

Environment-specific configurations are in `src/environments/`:
- `environment.ts` - Development configuration (points to `http://localhost:8000/api`)
- `environment.prod.ts` - Production configuration (uses `API_URL` environment variable)

For production deployment, set the `API_URL` environment variable to point to your backend API.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
