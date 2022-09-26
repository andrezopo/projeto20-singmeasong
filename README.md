# projeto20-singmeasong
A project of music recommendation. The focus is to practice creating tests in general (unit, integration and e2e)

<p align="center">
  <img  src="https://media.istockphoto.com/vectors/music-notes-with-curves-and-swirls-vector-id1320186474" height="300px">
</p>
<h1 align="center">
  Sing me a Song
</h1>
<div align="center">

  <h3>Tested With</h3>

  <img src="https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e" height="30px"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" height="30px"/>
  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<br/>

# Description

Sing me a song is a music recommendation application where people can vote the best recommendations and create their own ones.

</br>

## Features

-   Load recommendations from homepage
-   Get the top voted recommendations
-   Get a random recommendation
-   Upvote a recommendation
-   Downvote a recommendation

</br>

## Test Reference

### In order to properly do the tests, you must follow some instructions

## Environment Variables Back-end

To run this project, you will need to add the following environment variables to your .env file and .env.test file

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName # in .env.test recommended /DatabaseName_test`

`PORT = number #recommended:5000`

</br>

## Environment Variables Front-end

In Front-end, you will need to add the following environment variables to your .env file

`REACT_APP_API_BASE_URL=http://localhost:5000 #must use the same port number as the PORT in Back-end`

</br>

## Run Locally

Clone the project

```bash
  git clone https://github.com/andrezopo/projeto20-singmeasong
```

Go to the project directory

```bash
  cd projeto20-singmeasong/
```

Install dependencies both in front-end and back-end

```bash
  npm install
```

Install dev dependencies in back-end

```bash
  npm install dotenv-cli jest prisma supertest ts-jest ts-node typescrypt nodemon eslint @faker-js/faker @types/cors @types/dotenv @types/express @types/jest @types/joi @types/node @types/supertest -D
```

Create database both in test and production environment

```bash
  npx dotenv -e .env.test prisma migrate dev && npx dotenv -e .env.test prisma db seed
```
```bash
  npx prisma migrate dev && npx prisma db seed
```
Install dev dependencies in front-end

```bash
  npm install cypress @types/jest @faker-js/faker -D
```

Start the both back-end and front-end servers

## Back-end

```bash
  npm run dev
```
## Front-end

```bash
  npm start
```

Now you're free to run the tests of the project and create your own

## To run the tests in back-end use the following commands in shell

### Unit tests

```bash
  npm run test:unit
```

### Integration tests

```bash
  npm run test:integration
```

</br>

## Lessons Learned

In this project I learned a lot about testing back-end function and routes through Jest, mocking other functions to isolate the unit testing ones and learned how to manipulate cypress

</br>

## Acknowledgements

-   [Awesome Badges](https://github.com/Envoy-VC/awesome-badges)

</br>

## Authors

-   André Zopolato is a Mechanical Engineer graduated by FEB - UNESP and a student at Driven Education and is putting effort into it to switch careers. Nowadays he works with Engineering, 
    looking forward to become a Dev.
<br/>

#
