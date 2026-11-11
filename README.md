# RealWorld API Test Automation (Playwright + TypeScript)

![API Tests](https://github.com/YOUR_USERNAME/realworld-api-playwright/actions/workflows/playwright.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-API%20Testing-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)

An end-to-end **API automation suite** for the public [RealWorld "Conduit"](https://realworld-docs.netlify.app/) backend (`https://api.realworld.show/api/`). It covers authentication, user profiles, articles, comments, favorites and tags, and runs automatically on every push through GitHub Actions.

## Highlights

- **Typed end to end**: request and response shapes are defined in TypeScript, so bad payloads are caught at compile time.
- **Isolated, parallel-safe tests**: every test registers its own user and creates its own data with unique IDs, so tests never depend on each other or on leftover state.
- **Reusable helpers**: `registerUser`, `loginUser`, `createArticle` and `authHeader` keep tests short and readable.
- **Positive and negative coverage**: happy paths plus unauthorized access, wrong credentials and ownership checks.
- **Real bugs documented, not hidden**: known API defects are tracked with `test.fail()`. If the API gets fixed, the suite flags it.
- **CI/CD ready**: GitHub Actions runs type-check and tests on push, on pull requests and on a daily schedule, and publishes the HTML report as an artifact.

## What is covered

| Area | Scenarios |
|---|---|
| **Auth** | Register (valid, duplicate email, invalid email), login (valid, wrong password) |
| **Current user** | Get user, get user without token (401), update bio |
| **Profiles** | Get profile, follow and unfollow |
| **Articles** | Create, create without token (401), get by slug, list by author, update, delete, cannot delete another user's article |
| **Comments** | Add, list, delete |
| **Favorites** | Favorite and unfavorite, with `favoritesCount` verification |
| **Tags** | Get tags |

## Defects found

| Endpoint | Expected | Actual |
|---|---|---|
| `POST /users` (duplicate email) | `422` | `201`, duplicate accepted |
| `POST /users` (malformed email) | `422` | `201`, invalid email accepted |

These are marked with `test.fail()` in `tests/auth.spec.ts`.

## Project structure

```
.
├── .github/workflows/playwright.yml   # CI pipeline
├── helpers/api.helpers.ts             # Reusable API helpers
├── types/user.types.ts                # TypeScript models
├── tests/
│   ├── auth.spec.ts
│   ├── user.spec.ts
│   ├── profiles.spec.ts
│   ├── articles.spec.ts
│   ├── comments.spec.ts
│   ├── favorites.spec.ts
│   └── tags.spec.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Getting started

```bash
git clone https://github.com/YOUR_USERNAME/realworld-api-playwright.git
cd realworld-api-playwright
npm install
npm test
```

API tests use Playwright's request context only, so **no browser download is needed**.

### Useful commands

| Command | Description |
|---|---|
| `npm test` | Run the full suite |
| `npm run test:auth` | Run only auth tests |
| `npm run test:articles` | Run only article tests |
| `npm run report` | Open the HTML report |
| `npm run typecheck` | Type-check the project |

## Author

**Muhammad Muneeb**, QA Automation Engineer
[LinkedIn](www.linkedin.com/in/muhammad-muneeb-173614366) · [GitHub](https://github.com/muneebmughal09)
