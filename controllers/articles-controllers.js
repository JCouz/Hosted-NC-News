const { fetchArticle } = require('../models/articles-models');

exports.getArticle = (req, res, next) => {
  console.log('inside controller');
  const article_id = req.params.article_id;
  fetchArticle(article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch(next);
};
