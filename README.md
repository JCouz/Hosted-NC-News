# Northcoders News API

Northcoders News API is a RESTful api that uses Node.js, Express.js & PSQL.
It is deployed via Heroku, which you can visit [here](https://jcouz-nc-news.herokuapp.com/api).

## Summary

This API and all of its endpoints were created using test driven development via Jest and Supertest.

You may fork/clone this repo as you wish. Once cloned and within the repo locally, please follow the instillation instructions below.

## Instillation

Firstly, please ensure you have a minimum of Node v17.2.0 & PSQL v12.9 in order to avoid any issues when using this repo.

If you do not have the correct version of Node click [here](https://nodejs.org/en/download/) to install the latest version.
If you do not have the correct version of PSQL installed click [here](https://www.postgresql.org/download/) to install the latest version.

Following this, please install the dependencies with:

```
npm install
```

You will also need to create the following files in the root directory:

`.env.test (contents: PGDATABASE=nc_news_test)`
`.env.development (contents: PGDATABASE=nc_news)`

Then, please run the follow commands ro ensure the database is seeded.

```
npm run setup-dbs
npm run seed
```

When all the previous commands have been carried out, you can run the test with:

```
npm test
```

## Tech Used

- [Express](https://expressjs.com/) - Web framework for Node.js
- [PSQL](https://www.postgresql.org/) - Open source relational database
- [JEST](https://jestjs.io/) - JavaScript testing framework
- [Supertest](https://www.npmjs.com/package/supertest) - HTTP testing framework
