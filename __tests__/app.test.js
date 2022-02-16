const db = require('../db/connection.js');
const app = require('../app.js');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index.js');
const errors = require('../error-handling.js');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('/api', () => {
  test('returns an all ok message', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe('all ok');
      });
  });
});

describe('GET /api/topics', () => {
  test('should return an array of topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          console.log(topic);
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

test('status: 404 responds with message when path not found', () => {
  return request(app)
    .get('/api/trees')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Path not found');
    });
});
