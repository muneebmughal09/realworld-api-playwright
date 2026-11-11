import { test, expect } from '@playwright/test';
import type { Article } from '../types/user.types';
import { loginUser, createArticle, authHeader } from '../helpers/api.helpers';

test.describe('Articles', () => {
  test('Create article', async ({ request }) => {
    const { input: user, output } = await loginUser(request);
    const { input, article } = await createArticle(request, output.token);

    expect(article.slug).toBeTruthy();
    expect(article.title).toBe(input.title);
    expect(article.body).toBe(input.body);
    expect(article.tagList).toEqual(input.tagList);
    expect(article.author.username).toBe(user.username);
  });

  test('Create article without token', async ({ request }) => {
    const response = await request.post('articles', {
      data: { article: { title: 't', description: 'd', body: 'b', tagList: [] } },
    });
    expect(response.status()).toBe(401);
  });

  test('Get article by slug', async ({ request }) => {
    const { output } = await loginUser(request);
    const { article } = await createArticle(request, output.token);

    const response = await request.get(`articles/${article.slug}`, {
      headers: authHeader(output.token),
    });
    expect(response.status()).toBe(200);
    expect((await response.json()).article.slug).toBe(article.slug);
  });

  test('List articles by author', async ({ request }) => {
    const { input: user, output } = await loginUser(request);
    const { article } = await createArticle(request, output.token);

    const response = await request.get('articles', {
      params: { author: user.username },
      headers: authHeader(output.token),
    });
    expect(response.status()).toBe(200);
    const { articles } = await response.json();
    expect(articles.map((a: Article) => a.slug)).toContain(article.slug);
  });

  test('Update article', async ({ request }) => {
    const { output } = await loginUser(request);
    const { article } = await createArticle(request, output.token);
    const newBody = `Updated ${Date.now()}`;

    const response = await request.put(`articles/${article.slug}`, {
      headers: authHeader(output.token),
      data: { article: { body: newBody } },
    });
    expect(response.status()).toBe(200);
    expect((await response.json()).article.body).toBe(newBody);
  });

  test('Delete article', async ({ request }) => {
    const { output } = await loginUser(request);
    const { article } = await createArticle(request, output.token);

    const before = await request.get(`articles/${article.slug}`, {
      headers: authHeader(output.token),
    });
    expect(before.status()).toBe(200);

    const del = await request.delete(`articles/${article.slug}`, {
      headers: authHeader(output.token),
    });
    expect([200, 204]).toContain(del.status());

    const after = await request.get(`articles/${article.slug}`, {
      headers: authHeader(output.token),
    });
    expect(after.status()).toBe(404);
  });
});