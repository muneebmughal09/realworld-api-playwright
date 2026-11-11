import { test, expect } from '@playwright/test';
import { loginUser, authHeader } from '../helpers/api.helpers';

test.describe('Current user', () => {
  test('Get current user', async ({ request }) => {
    const { input, output } = await loginUser(request);
    const response = await request.get('user', { headers: authHeader(output.token) });
    expect(response.status()).toBe(200);
    const { user } = await response.json();

    expect(user.email).toBe(input.email);
    expect(user.username).toBe(input.username);
    expect(user.token).toBeTruthy();
  });

  test('Get current user without token', async ({ request }) => {
    const response = await request.get('user');
    expect(response.status()).toBe(401);
  });

  test('Update current user bio', async ({ request }) => {
    const { output } = await loginUser(request);
    const bio = `Bio ${Date.now()}`;
    const response = await request.put('user', {
      headers: authHeader(output.token),
      data: { user: { bio } },
    });
    expect(response.status()).toBe(200);
    expect((await response.json()).user.bio).toBe(bio);
  });
});
