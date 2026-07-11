const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/db');

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/products', () => {
  it('returns a paginated list', async () => {
    const res = await request(app).get('/api/products?page=1&limit=5');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('totalCount');
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  it('filters by search term', async () => {
    const res = await request(app).get('/api/products?search=keyboard');

    expect(res.status).toBe(200);
    // every result should actually contain the search term somewhere
    for (const product of res.body.data) {
      const matchesName = product.name.toLowerCase().includes('keyboard');
      const matchesDesc = product.description.toLowerCase().includes('keyboard');
      expect(matchesName || matchesDesc).toBe(true);
    }
  });

  it('sorts by price ascending', async () => {
    const res = await request(app).get('/api/products?sort=price_asc&limit=20');

    const prices = res.body.data.map((p) => p.price);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});

describe('GET /api/products/:id', () => {
  it('returns 404 for a product that does not exist', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.status).toBe(404);
  });
});
