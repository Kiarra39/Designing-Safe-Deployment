const request = require('supertest');
const app = require('../src/index');

describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/orders', () => {
  it('should return orders array', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
  });
});

describe('POST /api/orders', () => {
  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ customerId: 'cust-789', amount: '59.99' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('pending');
  });

  // Missing: test for missing fields
  // Missing: test for invalid amount
  // Missing: test for duplicate orders
});

describe('GET /api/orders/:id', () => {
  it('should return 404 for unknown order', async () => {
    const res = await request(app).get('/api/orders/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
