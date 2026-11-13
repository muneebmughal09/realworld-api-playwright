import { test, expect } from '@playwright/test';
import { registerUser, loginUser } from '../helpers/api.helpers';

test.describe('Auth', () => {
  // test('Register with valid credentials', async ({ request }) => {
  //   const { input, output } = await registerUser(request);
  //   expect(output.email).toBe(input.email);
  //   expect(output.username).toBe(input.username);
  //   expect(output.token).toBeTruthy();
  // });

  // test('Register with duplicate email', async ({ request }) => {
  //   test.fail(true, 'Known API issue: duplicate emails are accepted (returns 201 instead of 422)');
  //   const { input } = await registerUser(request);
  //   const response = await request.post('users', {
  //     data: { user: { email: input.email, username: `Dup${Date.now()}`, password: 'test12345' } },
  //   });
  //   expect(response.status()).toBe(422);
  // });

  test('Register with invalid email', async ({ request }) => {
    const response = await request.post('users', {
      data: { user: { email: 'not-an-email', username: `Inv${Date.now()}`, password: 'test12345' } },
    });
    expect(response.status()).toBe(422);
  });

  test('Login with valid credentials', async ({ request }) => {
    const { input, output } = await loginUser(request);
    expect(output.email).toBe(input.email);
    expect(output.token).toBeTruthy();
    expect(output).not.toHaveProperty('password');
  });

  test('Login with wrong password', async ({ request }) => {
    const { input } = await registerUser(request);
    const response = await request.post('users/login', {
      data: { user: { email: input.email, password: 'wrong-password' } },
    });
    expect([401, 403, 422]).toContain(response.status());
  });
});
