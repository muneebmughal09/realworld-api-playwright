import { test, expect } from '@playwright/test';
import { registerUser, authHeader } from '../helpers/api.helpers';

test.describe('Profiles', () => {
  test('Get profile', async ({ request }) => {
    const { output } = await registerUser(request);

    const response = await request.get(`profiles/${output.username}`, {
      headers: authHeader(output.token),
    });
    expect(response.status()).toBe(200);
    const { profile } = await response.json();
    expect(profile.username).toBe(output.username);
    expect(profile.following).toBe(false);
  });

  test('Follow and unfollow user', async ({ request }) => {
    const follower = (await registerUser(request)).output;
    const target = (await registerUser(request)).output;

    const follow = await request.post(`profiles/${target.username}/follow`, {
      headers: authHeader(follower.token),
    });
    expect(follow.status()).toBe(200);
    expect((await follow.json()).profile.following).toBe(true);

    const unfollow = await request.delete(`profiles/${target.username}/follow`, {
      headers: authHeader(follower.token),
    });
    expect(unfollow.status()).toBe(200);
    expect((await unfollow.json()).profile.following).toBe(false);
  });
});