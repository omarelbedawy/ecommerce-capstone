import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();

    if (body.email === 'customer@shop.com' && body.password === 'Customer123!') {
      return HttpResponse.json({
        user: { id: 1, name: 'Test Customer', email: body.email, role: 'CUSTOMER' },
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
      });
    }

    return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }),

  http.get('/api/products', () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: 'Test Product', description: 'A product for testing', price: 9.99, stock: 5, category: { name: 'Test' } },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 12,
      totalPages: 1,
    });
  }),

  http.get('/api/categories', () => {
    return HttpResponse.json([{ id: 1, name: 'Test' }]);
  }),
];

export const server = setupServer(...handlers);
