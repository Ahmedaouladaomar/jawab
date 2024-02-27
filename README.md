# Jawab
Jawab is a web application in which you can post your questions and wait for people to provide an answer.

## Built with

This project was built with the following technoligies:

- NestJS
- Postgresql
- ReactJS
- MantineUI
- Docker

Programming language: 
- JavaScript
- TypeScript

CSS pre-processor:
 - Sass

## Get the project running

If you want to run the project locally please follow these commands to run api (One after one):
```
cd api
cp env.example .env
npm install
npm run start:dev
```

For the client side:
```
cd client
npm install
npm run dev
```

<strong>Important:</strong> for the .env file, change DB_HOST value to localhost if you want to run the project locally and you should have the postgresql service running with a database named accordingly.

If you want to run the project in Docker run the following command in the root folder:
```
docker-compose up -d
```


