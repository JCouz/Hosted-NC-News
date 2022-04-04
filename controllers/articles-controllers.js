const {
  fetchArticle,
  updateArticleVotes,
  fetchArticles,
  fetchArticleComments,
  createArticleComment,
  deleteArticleComment,
} = require("../models/articles-models");

exports.getArticles = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const topic = req.query.topic;

  fetchArticles(sort_by, order, topic)
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

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleComments(article_id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

exports.postArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;
  const { username, body } = req.body;

  createArticleComment(article_id, username, body)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  deleteArticleComment(comment_id)
    .then(() => {
      res.status(204).send();
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
