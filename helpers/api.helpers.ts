import { expect, APIRequestContext } from '@playwright/test';
import type { Input, Output, registerUserResult, ArticleInput, Article } from '../types/user.types';

/** Unique suffix so every test creates its own isolated data (safe for parallel runs). */
export function uniqueId(): string {
  return `${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

export function authHeader(token: string) {
  return { Authorization: `Token ${token}` };
}

export async function registerUser(request: APIRequestContext): Promise<registerUserResult> {
  const id = uniqueId();
  const user: Input = {
    email: `test${id}@gmail.com`,
    username: `Test${id}`,
    password: `test${id}`,
  };
  const response = await request.post('users', { data: { user } });
  expect(response.status()).toBe(201);
  const body = await response.json();
  return { input: user, output: body.user };
}

export async function loginUser(request: APIRequestContext): Promise<{ input: Input; output: Output }> {
  const { input } = await registerUser(request);
  const credentials: Pick<Input, 'email' | 'password'> = {
    email: input.email,
    password: input.password,
  };
  const response = await request.post('users/login', { data: { user: credentials } });
  expect(response.status()).toBe(200);
  const body = await response.json();
  return { input, output: body.user };
}

export async function createArticle(
  request: APIRequestContext,
  token: string
): Promise<{ input: ArticleInput; article: Article }> {
  const id = uniqueId();
  const article: ArticleInput = {
    title: `Article ${id}`,
    description: `Description ${id}`,
    body: `Body ${id}`,
    tagList: [`tag${id}`],
  };
  const response = await request.post('articles', {
    headers: authHeader(token),
    data: { article },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  return { input: article, article: body.article };
}
