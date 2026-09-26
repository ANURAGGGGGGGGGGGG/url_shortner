# URL Shortener

🔗 A minimal, fast URL shortener built with Next.js and MongoDB. Short links are resolved server-side, with optional custom aliases and a dark/light UI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Short Codes**: Random 7-character codes via `nanoid`
- **Custom Aliases**: Claim a memorable `/s/your-alias` slug
- **Instant Redirects**: Server-side `302` straight to the destination
- **Click Counting**: Every visit increments a `clicks` counter
- **URL Validation**: Only `http://` and `https://` are accepted
- **Duplicate Protection**: Unique index on `shortCode` rejects collisions
- **Modern UI**: Dark/light mode with Framer Motion animations, respects `prefers-reduced-motion`
- **No Cookies, No Tracking**: Nothing identifies the visitor

## Tech Stack

- **Next.js 15** (App Router, React Server Components)
- **React 19**
- **MongoDB** via **Mongoose 9**
- **Tailwind CSS 4**
- **Framer Motion 12**
- **nanoid 6**

## How It Works

Shortening and resolving are two separate server routes.

**Shorten** — `POST /api/shorten`

1. The client posts `{ originalUrl, customAlias }`.
2. The URL is parsed and rejected unless the protocol is `http:` or `https:`.
3. The code is your `customAlias`, or a random `nanoid(7)` if you left it blank.
4. The code is validated against `^[a-zA-Z0-9_-]{3,30}$` and checked for uniqueness.
5. A document is saved and the short URL is returned.

**Redirect** — `GET /s/[shortCode]`

1. The code is looked up in MongoDB.
2. `clicks` is incremented on the matched document.
3. The visitor is redirected `302` to `originalUrl`, or given a `404` if unknown.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database

Create a `.env.local` file in the project root:

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

You can paste the connection string straight from **MongoDB Atlas → Connect → Drivers**. The app throws on startup if `MONGODB_URI` is missing.

> `.env*` is already in `.gitignore` — keep your credentials local and never commit them.

### 4. Run the development server

```bash
npm run dev
```

### 5. Open your browser

```
http://localhost:3000
```

## Usage

1. Enter a long URL (must start with `http://` or `https://`).
2. Optionally claim an alias — 3–30 characters, letters, numbers, `_`, or `-`.
3. Click **Shorten URL**.
4. Copy the result, or preview the destination before visiting.

## API

### `POST /api/shorten`

**Body**

```json
{
  "originalUrl": "https://example.com/a/very/long/path",
  "customAlias": "my-alias"
}
```

`customAlias` is optional — omit it to get a random 7-character code.

**Responses**

| Status | Body                                          | Meaning                       |
| ------ | --------------------------------------------- | ----------------------------- |
| `201`  | `{ success, shortCode, shortUrl, originalUrl }` | Created                       |
| `400`  | `{ error }`                                   | Missing/invalid URL or alias  |
| `409`  | `{ error }`                                   | Alias already taken           |
| `500`  | `{ error }`                                   | Server or database error      |

### `GET /s/[shortCode]`

| Status | Response              | Meaning                     |
| ------ | --------------------- | --------------------------- |
| `302`  | Redirect header       | `shortCode` resolved        |
| `404`  | `Short URL not found.` | Unknown or deleted code     |
| `500`  | `Unable to redirect.` | Server or database error    |

## Project Structure

```
app/
├── api/shorten/route.js     # POST — create a short URL
├── page.js                  # Home page (shorten form + result)
├── layout.js                # Root layout, metadata
├── globals.css              # Tailwind + theme tokens
└── s/[shortCode]/route.js   # GET  — resolve and redirect
lib/
└── mongodb.js               # Cached Mongoose connection
models/
└── ShortUrl.js              # Schema: shortCode, originalUrl, createdAt, clicks
```

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | Run ESLint                 |

## Deployment

Works anywhere Next.js runs. Add `MONGODB_URI` to your host's environment variables (e.g. **Vercel → Settings → Environment Variables**), then deploy.

> **Atlas note:** if you added your client IP to the database access list, remember to allow `0.0.0.0/0` (or `::/0`) for serverless hosts that use dynamic egress IPs.

## Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

[MIT](LICENSE)
