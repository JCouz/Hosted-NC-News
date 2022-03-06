const {
  fetchArticle,
  updateArticleVotes,
  fetchArticles,
} = require("../models/articles-models");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticle(article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const article_id = req.params.article_id;

  const { inc_votes } = req.body;

  updateArticleVotes(article_id, inc_votes)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};
