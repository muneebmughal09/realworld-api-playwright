import { test, expect } from '@playwright/test';

test.describe('Tags', () => {
  test('Get tags', async ({ request }) => {
    const response = await request.get('tags');
    expect(response.status()).toBe(200);
    const { tags } = await response.json();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
  });
});
