const db = require('../db/connection.js');

exports.fetchArticle = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  console.log('inside model');
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((res) => {
      if (res.rows.length === 0)
        return Promise.reject({ status: 404, msg: 'Path not found ' });
      return res.rows[0];
    });
};
