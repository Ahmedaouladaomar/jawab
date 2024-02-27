FROM node:18.1.0-alpine3.14

WORKDIR /app

COPY package.json package-lock.json ./

# installing dependencies
RUN npm install

COPY . ./

CMD ["npm", "run", "dev"]