### Can I Login Backend - authentication Assignment

#### Table of contents

- [Introduction](#Introduction)

- [Technologies](#Technologies)

- [Setup](#Setup)

- [Availble Scripts](#Available-Scripts)

- [Availble Routes](#Available-Routes)

- [Endpoint Usage](#Endpoint-Usage)

- [Environment Variables](#Environment-Variables)

- [Package Issues](#Package-issues)

- [Improvements](#Improvements)

#### Introduction

This project was build on Express and node.js, written in Typescript, using mongoDB as our database.

The goal of the backend was to do :

1. Register a new user. 
2. Login as a user. 
3. Access report as a user. 

Hence, a model called users has been created to store email, password, first name and last name, with a schema of

```
{email : string, password: string, firstName: string, lastName: string}
```
The email is used as the unique identifier. In my coding process, I was using username initially. However, to really control the uniqueness as well as ease of access for the user in terms of remembering their login, the email is used. 

The password uses bcrypt to hash the password, and will be taken to compare during the login. This is to ensure the security of the password from being leaked. 

For the model, an emailValidator and passwordValidator has been written as custom validators. 
I was using regex at the start. However, I decide to spend time on the validator because of how unmaintainable regex can be. 
Hence, the validators are written and validated by a certain set of test cases. 

There are only GET and POST routes at the moment. PUT, PATCH and delete use case are not available at the moment. However, implementation for such use cases like changing user details can require PUT or PATCH in the future. 

Cors is applied to whitelist the frontend URl that we are using for the backend.

cookie-parser and jwtwebtoken is used to pass the user identity from the backend service to the frontend. 

For testing, I use Jest, along with supertest mongodb-memory-server to mock the data.

Husky is implemented for pre-commit hooks and linting with pretty-quick.

nodemon is used to allow monitoring of script during the development of the backend.

As the project is written in Typescript, ts-node is used. ts-node can allow ts files to run without building a js file copy. 

Link to Frontend: https://github.com/nicchunglow/can-i-login

#### Technologies

    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.5",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.12.13"

##### DevDependencies:

    "@babel/preset-typescript": "^7.14.5",
    "@types/express": "^4.17.12",
    "@types/jest": "^26.0.23",
    "husky": "4.3.8",
    "jest": "^27.0.4",
    "mongodb-memory-server": "^6.9.6",
    "nodemon": "^2.0.7",
    "prettier": "^2.3.1",
    "pretty-quick": "^3.1.0",
    "supertest": "^6.1.3",
    "ts-jest": "^27.0.3",
    "ts-node": "^10.0.0",
    "tslint": "^6.1.3",
    "typescript": "^4.3.2"

#### Setup

To run this project, git clone and install it locally using npm:

```

$ cd ../

$ git clone git@github.com:nicchunglow/can-i-login-backend.git

$ npm install

$ npm start

```

## Available Scripts

In the project directory, you can run:

```
    "start": "ts-node src/index.ts",
    "start-dev": "nodemon src/index.ts",
    "test": "jest --watchAll",
    "testd": "jest --detectOpenHandles --watchAll",
    "testc": "jest --coverage --watchAll"
```

For husky, we have a pre-commit to lint our code
      "pre-commit": "pretty-quick --staged"

## Available Routes

```
    0: "GET   /",
    "1": "POST /users/register",
    "2": "POST /users/login",
    "3": "GET /reports",
    "4": "GET /auth",
```

## Endpoint Usage

    0: "GET   /",

You can just call this endpoint without any query or params to get all the saved locations.
You will receive the directory of all the apis available. 

    "1": "POST /users/register",

You register a user, which require a body with:

```
{
    "email": string,
    "password": string, 
    "firstName": string, 
    "lastName" : string
}
```

    "2": "POST /users/login",

To login, you will require a body with : 

```
{
    "email": string,
    "password": string, 
}
```


    "3": "GET /reports",

This is a fake "reports" to show that a user is login to access the reports.
You will not need any req.body for this api. 

    "4": "GET /auth",
This is a auth api to show that you are a user at the home page.
You will not need any req.body for this api. 

## Environment Variables

- FRONTEND_URL="http://localhost:3001" <- example url 
- MONGODB_URI="mongodb://localhost:27017/CanILoginDB" <- example local db.
- JWT_SECRET_KEY = //this is to be generated and used for the jwt signing.

## Improvements

- add dockerisation to this project.
- Increase usability in the project through endpoints.

