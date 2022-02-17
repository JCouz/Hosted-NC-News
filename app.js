const express = require('express');
const { getTopics } = require('./controllers/topics-controller.js');
const { getArticle } = require('./controllers/articles-controllers');
const app = express();
app.use(express.json());

app.get('/api', (req, res) => {
  res.status(200).send({ msg: 'all ok' });
});

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: 'Path not found' });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 400) res.status(400).send({ msg: 'Bad request' });
  else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'server error' });
});

module.exports = app;
