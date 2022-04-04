const db = require("../db/connection.js");

exports.fetchArticles = async () => {
  const result = await db.query(
    "SELECT * , (SELECT COUNT(*)::int FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles ORDER BY created_at DESC;"
  );
  return result.rows;
};

exports.fetchArticle = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      "SELECT articles.*, (SELECT COUNT(*)::int FROM comments WHERE comments.article_id = $1) AS comment_count FROM articles WHERE article_id = $1",
      [article_id]
    )
    .then((res) => {
      console.log(res.rows);

      if (res.rows.length === 0)
        return Promise.reject({ status: 404, msg: "Path not found" });
      return res.rows[0];
    });
};

exports.fetchArticleComments = async (article_id) => {
  const result = await db.query(
    "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;",
    [article_id]
  );
  return result.rows;
};

exports.updateArticleVotes = async (article_id, inc_votes) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request. Invalid article_id",
    });
  }
  if (isNaN(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request. Invalid inc_votes",
    });
  }

  const result = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
    [inc_votes, article_id]
  );

  return result.rows[0];
};

exports.createArticleComment = async (article_id, username, body) => {
  const result = await db.query(
    "INSERT INTO comments(body, article_id, author, votes, created_at) VALUES ($3, $1, $2, 0, NOW()) RETURNING *;",
    [article_id, username, body]
  );

  return result.rows[0];
};
