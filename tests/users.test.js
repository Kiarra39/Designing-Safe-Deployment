const request = require('supertest');
const app = require('../src/index');

describe('POST /api/users', () => {
  it('should create user with valid data', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
  });
});

describe('GET /api/users/:id', () => {
  it('should return user for valid id', async () => {
    const res = await request(app).get('/api/users/cust-123');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Arjun Mehta');
  });

  it('should return 404 for unknown user', async () => {
    const res = await request(app).get('/api/users/unknown-999');
    expect(res.statusCode).toBe(404);
  });

  // Flaky: this test depends on ANALYTICS_ENDPOINT being unreachable
  // and will behave differently in different environments
  it('should still return user if analytics is down', async () => {
    process.env.ANALYTICS_ENDPOINT = 'http://unreachable-host.invalid';
    const res = await request(app).get('/api/users/cust-123');
    expect(res.statusCode).toBe(200);
  });
});
