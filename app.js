const express = require('express');
const { getTopics } = require('./controllers/topics-controller.js');
const { getArticle } = require('./controllers/articles-controllers');
const {
  customError,
  trigger404,
  trigger500,
} = require('./controllers/error-handling.js');
const app = express();
app.use(express.json());

app.get('/api', (req, res) => {
  res.status(200).send({ msg: 'all ok' });
});

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);

app.all('/*', trigger404);
app.use(customError);
app.use(trigger500);

module.exports = app;
