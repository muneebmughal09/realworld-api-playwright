export type Input = {
  email: string;
  username: string;
  password: string;
};

export type Output = {
  email: string;
  username: string;
  token: string;
  bio?: string | null;
  image?: string | null;
};

export type registerUserResult = {
  input: Input;
  output: Output;
};

export type ArticleInput = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

export type Article = ArticleInput & {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
  author: { username: string; following: boolean };
};

export type Comment = {
  id: number;
  body: string;
  author: { username: string };
};
