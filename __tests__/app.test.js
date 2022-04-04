const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api", () => {
  test("status 200 - returns an all ok message", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe("all ok");
      });
  });
});

describe("GET /api/topics", () => {
  test("status 200 - should return an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("Status 200 - Returns an array of articles including comment_count excluding body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: articles }) => {
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Status 200 - Returns an array of articles using default sort and ordering", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: articles }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Status 200 - should return an array of articles objects sorted by created_at DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body: articles }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Status 200 - should return an array of articles whose topic is cats", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: articles }) => {
        articles.forEach((article) => {
          expect(article.topic).toEqual("cats");
        });
      });
  });
  test("Status 200 - should return an array of articles objects sorted by created_at ", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=ASC")
      .expect(200)
      .then(({ body: articles }) => {
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("Status 400 - invalid sort_by query ", () => {
    return request(app).get("/api/articles?sort_by=bananas").expect(400);
  });
  test("Status 400 - invalid order query ", () => {
    return request(app).get("/api/articles?order=bananas").expect(400);
  });
  test("Status 404 - invalid topic query ", () => {
    return request(app).get("/api/articles?topic=bananas").expect(404);
  });
  test("Status 200 - valid topic query but no articles match so reponds with empty array", () => {
    return request(app).get("/api/articles?topic=paper").expect(200);
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status:201 - should return an object containing the added comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "Hello World!" })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: "butter_bridge",
            body: "Hello World!",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test("status:201 - should return an object containing the added comment ignoring unnecessary properties", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Hello World!",
        prop1: "ABC",
        prop2: 456,
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: "butter_bridge",
            body: "Hello World!",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test("Status 400 - invalid id", () => {
    return request(app)
      .post("/api/articles/no-an-id/comments")
      .send({
        username: "butter_bridge",
        body: "Hello World!",
      })
      .expect(400);
  });
  test("Status 404 - Non existent id", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        username: "butter_bridge",
        body: "Hello World!",
      })
      .expect(404);
  });
  test("Status 400 - missing required field", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
      })
      .expect(400);
  });
  test("Status 404 - username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "mr_nobody",
        body: "Hello World!",
      })
      .expect(404);
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200 - should return an article object containing 7 keys", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          })
        );
      });
  });
  test("status: 404 responds with message when path not found", () => {
    return request(app)
      .get("/api/articles/10000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
  test("status: 400 responds with message when given a bad request", () => {
    return request(app)
      .get("/api/articles/person")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status:200 - should return an updated article where votes = 101", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 101,
          })
        );
      });
  });
  test("status:200 - should return an updated article where votes = 0", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test("status: 400 responds with message when body is malformed", () => {
    return request(app)
      .patch("/api/articles/10000")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request. Invalid inc_votes");
      });
  });
  test("status: 400 responds with message when body is malformed", () => {
    return request(app)
      .patch("/api/articles/10000")
      .send({ vote: -1000 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request. Invalid inc_votes");
      });
  });
});

describe("GET /api/users", () => {
  test("status 200 - should return an array of objects containing username property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(4);
        response.body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200 - should return an article object with a comment count of 11", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            comment_count: 11,
          })
        );
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Status:200 - should return an array of comments for the specified article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(11);
        response.body.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("Status 400 - Not an ID ", () => {
    return request(app).get("/api/articles/no-an-id/comments").expect(400);
  });
  test("Status 404 - Non existent ID ", () => {
    return request(app).get("/api/articles/9999/comments").expect(404);
  });
  test("Status 200 - Valid ID, no comments ", () => {
    return request(app).get("/api/articles/11/comments").expect(200);
  });
});
test("status: 404 responds with message when path not found", () => {
  return request(app)
    .get("/api/trees")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Path not found");
    });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status:204 - should return nothing", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("status:404 - should return non existent id", () => {
    return request(app).delete("/api/comments/9999999").expect(404);
  });
  test("status:400 - should return bad request", () => {
    return request(app).delete("/api/comments/abc").expect(400);
  });
});
