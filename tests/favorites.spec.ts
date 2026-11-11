import { test, expect } from '@playwright/test';
import { loginUser, createArticle, authHeader } from '../helpers/api.helpers';

test.describe('Favorites', () => {
  test('Favorite and unfavorite article', async ({ request }) => {
    const { output } = await loginUser(request);
    const { article } = await createArticle(request, output.token);

    const fav = await request.post(`articles/${article.slug}/favorite`, { headers: authHeader(output.token) });
    expect(fav.status()).toBe(200);
    const favBody = await fav.json();
    expect(favBody.article.favorited).toBe(true);
    expect(favBody.article.favoritesCount).toBe(1);

    const unfav = await request.delete(`articles/${article.slug}/favorite`, { headers: authHeader(output.token) });
    expect(unfav.status()).toBe(200);
    const unfavBody = await unfav.json();
    expect(unfavBody.article.favorited).toBe(false);
    expect(unfavBody.article.favoritesCount).toBe(0);
  });
});
