FROM node:18.1.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# installing dependencies
RUN npm install

COPY . ./

# env file
RUN cp env.example .env

# running migrations and starting the server
CMD npx typeorm-ts-node-esm migration:run -d src/config/data-source.ts ; npm run start:dev