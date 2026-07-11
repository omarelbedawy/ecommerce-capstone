const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/db');

// these tests hit a real (test) database - make sure DATABASE_URL in .env
// points somewhere safe to wipe, not your dev data

const testEmail = 'jest_test_user@shop.com';

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: testEmail } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testEmail } });
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  it('creates a new user and returns tokens', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jest Test User',
      email: testEmail,
      password: 'TestPass123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
  });

  it('rejects a duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jest Test User',
      email: testEmail,
      password: 'TestPass123!',
    });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'TestPass123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'WrongPassword',
    });

    expect(res.status).toBe(401);
  });
});
