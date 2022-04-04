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

describe.only("GET /api/articles", () => {
  test("status 200 - should return an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(12);
        response.body.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
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
  test("status:200 - should return an array of comments for the specified article_id", () => {
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
});

test("status: 404 responds with message when path not found", () => {
  return request(app)
    .get("/api/trees")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Path not found");
    });
});
