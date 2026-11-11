import { test, expect } from '@playwright/test';
import type { Comment } from '../types/user.types';
import { loginUser, createArticle, authHeader } from '../helpers/api.helpers';

test.describe('Comments', () => {
  test('Add comment', async ({ request }) => {
    const { input: user, output } = await loginUser(request);
    const { article } = await createArticle(request, output.token);
    const body = `Nice ${Date.now()}`;

    const response = await request.post(`articles/${article.slug}/comments`, {
      headers: authHeader(output.token),
      data: { comment: { body } },
    });
    expect([200, 201]).toContain(response.status());
    const { comment } = await response.json();
    expect(comment.body).toBe(body);
    expect(comment.author.username).toBe(user.username);
  });

  test('Get comments', async ({ request }) => {
    const { output } = await loginUser(request);
    const { article } = await createArticle(request, output.token);
    const body = 'First!';

    const created = await request.post(`articles/${article.slug}/comments`, {
      headers: authHeader(output.token),
      data: { comment: { body } },
    });
    expect([200, 201]).toContain(created.status());

    const response = await request.get(`articles/${article.slug}/comments`, {
      headers: authHeader(output.token),
    });
    expect(response.status()).toBe(200);
    const { comments } = await response.json();
    expect(comments.map((c: Comment) => c.body)).toContain(body);
  });

  test('Delete comment', async ({ request }) => {
    const { output } = await loginUser(request);
    const { article } = await createArticle(request, output.token);

    const created = await request.post(`articles/${article.slug}/comments`, {
      headers: authHeader(output.token),
      data: { comment: { body: 'delete me' } },
    });
    expect([200, 201]).toContain(created.status());
    const { comment } = await created.json();

    const del = await request.delete(`articles/${article.slug}/comments/${comment.id}`, {
      headers: authHeader(output.token),
    });
    expect([200, 204]).toContain(del.status());

    const list = await request.get(`articles/${article.slug}/comments`, {
      headers: authHeader(output.token),
    });
    expect(list.status()).toBe(200);
    const { comments } = await list.json();
    expect(comments.map((c: Comment) => c.id)).not.toContain(comment.id);
  });
});