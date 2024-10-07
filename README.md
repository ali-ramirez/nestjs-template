<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="images/nestjs.png" alt="Nest Logo" width="512" /></a>
</p>

<h1 align="center">⭐ NestJS Service Template ⭐</h1>

<p align="center">
  Template for new services based on NestJS with the Best Practices and Ready for Production
</p>

<p align="center">
  <a href="https://github.com/AlbertHernandez/nestjs-service-template/actions/workflows/node.yml?branch=main"><img src="https://github.com/AlbertHernandez/nestjs-service-template/actions/workflows/node.yml/badge.svg?branch=main" alt="nodejs"/></a>
  <a href="https://nodejs.org/docs/latest-v20.x/api/index.html"><img src="https://img.shields.io/badge/node-20.x-green.svg" alt="node"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-5.x-blue.svg" alt="typescript"/></a>
  <a href="https://docs.nestjs.com/v10/"><img src="https://img.shields.io/badge/npm-10.x-red.svg" alt="npm"/></a>
  <a href="https://fastify.dev/"><img src="https://img.shields.io/badge/Web_Framework-Fastify_⚡-black.svg" alt="fastify"/></a>
  <a href="https://swc.rs/"><img src="https://img.shields.io/badge/Compiler-SWC_-orange.svg" alt="swc"/></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Test-Vitest_-yellow.svg" alt="swc"/></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Dockerized 🐳_-blue.svg" alt="docker"/></a>
  <a href="https://opentelemetry.io/"><img width="150" height="50" src="https://opentelemetry.io/img/logos/opentelemetry-horizontal-color.svg" alt="opentelemetry"/></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## 🌟 What is including this template?

1. 🐳 Fully dockerized service ready for development and production environments with the best practices for docker, trying to provide a performance and small image just with the code we really need in your environments.
2. 👷 Use [SWC](https://swc.rs/) for compiling and running the tests of the service. As commented in the own [NestJS docs](https://docs.nestjs.com/recipes/swc), this is approximately x20 times faster than default typescript compiler that is the one that comes by default in NestJS.
3. ⚡️ Use [Fastify](https://fastify.dev/) as Web Framework. By default, [NestJS is using Express](https://docs.nestjs.com/techniques/performance) because is the most widely-used framework for working with NodeJS, however, this does not imply is the one is going to give us the most performance. Also, NestJS is fully compatible with Fastify, so we are providing this integration by default. You can check [here](https://github.com/fastify/benchmarks#benchmarks) comparison between different web frameworks.
4. 🐶 Integration with [husky](https://typicode.github.io/husky/) to ensure we have good quality and conventions while we are developing like:
   - 💅 Running the linter over the files that have been changed
   - 💬 Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to ensure our commits have a convention.
   - ✅ Run the tests automatically.
   - ⚙️ Check our project does not have type errors with Typescript.
   - 🙊 Check typos to ensure we don't have grammar mistakes.
5. 🗂️ Separate tests over production code. By default, NestJS is combining in the same folder, the `src`, the unit tests and the code we are developing for production. This is something I personally don't like so here I am separating this and having a dedicated folder for the unit tests.
6. 🧪 Testing with [Vitest](https://vitest.dev/) and [supertest](https://github.com/ladjs/supertest) for unit and e2e tests.
7. 🤜🤛 Combine unit and e2e test coverage. In the services we may have both type of tests, unit and e2e tests, and usually we would like to see what is the combined test coverage, so we can see the full picture.
8. 🐦‍🔥 Usage of ESModules instead of CommonJS, which is the standard in JavaScript.
9. Advanced Logging with Winston and Correlation IDs
   🚀 This service uses Winston as the logging library to provide highly customizable and flexible logging across different environments. Winston allows us to create multiple log levels (info, error, debug, etc.), and it integrates well with different output formats like JSON, which is helpful for centralized log management systems.

## 🧑‍💻 Developing

First, we will need to create our .env file, we can create a copy from the example one:

```bash
cp .env.example .env
```

The project is fully dockerized 🐳, if we want to start the app in **development mode**, we just need to run:

```bash
docker-compose up -d my-service-dev
```

This development mode will work with **hot-reload** and expose a **debug port**, port `9229`, so later we can connect to it from our editor.

Now, you should be able to start debugging configuring using your IDE. For example, if you are using vscode, you can create a `.vscode/launch.json` file with the following configuration:

```json
{
  "version": "0.1.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to docker",
      "restart": true,
      "port": 9229,
      "remoteRoot": "/app"
    }
  ]
}
```

Also, if you want to run the **production mode**, you can run:

```bash
docker-compose up -d my-service-production
```

This service is providing just a health endpoint which you can call to verify the service is working as expected:

```bash
curl --request GET \
  --url http://localhost:3000/health
```

If you want to stop developing, you can stop the service running:

```bash
docker-compose down
```

Also, if you want to run the **testing mode**, you can run:

```bash
docker-compose up -d my-service-test
```

## ⚙️ Building

```bash
npm run build
```

## ✅ Testing

The service provide different scripts for running the tests, to run all of them you can run:

```bash
npm run test
```

If you are interested just in the unit tests, you can run:

```bash
npm run test:unit
```

Or if you want e2e tests, you can execute:

```bash
npm run test:e2e
```

## Project setup

```bash
$ npm install
```

## 💅 Linting

To run the linter you can execute:

```bash
npm run lint
```

And for trying to fix lint issues automatically, you can run:

```bash
npm run lint:fix
```

## 💅 Prettier

To run the Prettier you can execute:

```bash
npm run prettier:check
```

And for trying to fix issues automatically, you can run:

```bash
npm run prettier:write
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test:unit

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
