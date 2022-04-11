const {
  fetchArticle,
  updateArticleVotes,
  fetchArticles,
  fetchArticleComments,
  createArticleComment,
  deleteArticleComment,
} = require('../models/articles-models');

exports.getArticles = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const topic = req.query.topic;

  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;
  const { username, body } = req.body;

  createArticleComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
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
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
