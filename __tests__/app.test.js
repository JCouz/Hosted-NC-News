const db = require('../db/connection.js');
const app = require('../app.js');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('/api', () => {
  test('status 200 - returns an all ok message', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe('all ok');
      });
  });
});

describe('GET /api/topics', () => {
  test('status 200 - should return an array of topic objects', () => {
    return request(app)
      .get('/api/topics')
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

describe('GET /api/articles/:article_id', () => {
  test('status:200 - should return an article object containing 7 keys', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 100,
          })
        );
      });
  });
  test('status: 404 responds with message when path not found', () => {
    return request(app)
      .get('/api/articles/10000')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Path not found');
      });
  });
  test('status: 400 responds with message when given a bad request', () => {
    return request(app)
      .get('/api/articles/person')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
});

test('status: 404 responds with message when path not found', () => {
  return request(app)
    .get('/api/trees')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Path not found');
    });
});
