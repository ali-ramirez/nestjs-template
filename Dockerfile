# Base stage with common dependencies
FROM node:20-alpine3.18 AS base

ENV DIR /app
WORKDIR $DIR
ARG NPM_TOKEN

# Install dependencies only once and cache node_modules in base stage
COPY package*.json ./
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    npm ci && \
    rm -f .npmrc

# Development stage
FROM base AS dev

ENV NODE_ENV=development

# Copy everything except files listed in .dockerignore
COPY . ./

# Expose dev port
EXPOSE ${PORT:-3000}

# Development-specific command
CMD ["npm", "run", "start:dev"]

# Build stage for production
FROM base AS build

RUN apk update && apk add --no-cache dumb-init=1.2.5-r2

# Copy everything except files listed in .dockerignore
COPY . ./

# Ejecutar la build (transpilar código si es necesario, generar estáticos, etc.)
RUN npm run build

# Eliminar devDependencies, dejando solo las dependencias de producción
RUN npm prune --production

# Production stage
FROM node:20-alpine3.18 AS production

ENV NODE_ENV=production
ENV USER=node

# Create the logs directory and set permissions
RUN mkdir -p /logs && chown -R $USER:$USER /logs

# Copy build artifacts and runtime dependencies from build stage
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build app/package*.json .
COPY --from=build app/node_modules node_modules
COPY --from=build app/dist dist

# Set non-root user for better security
USER $USER

# Expose production port
EXPOSE ${PORT:-3000}

# Start the app in production using dumb-init to handle signals properly
CMD ["dumb-init", "node", "dist/main.js"]

# Testing stage
FROM base AS test

ENV NODE_ENV=test

# Copy the entire project directory to the test stage
COPY . ./


# Command to run unit and integration tests
CMD ["npm", "run", "test"]
