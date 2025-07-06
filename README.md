# Privacy-First URL Shortener

🔒 A zero-tracking, cookie-free URL shortener that doesn't store your data in databases. URLs are encoded directly in the shortened link for maximum privacy.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Privacy Focused**: No tracking, no cookies, no database storage
- **Instant Shortening**: Generate short URLs in milliseconds
- **Base64 Encoding**: URLs are encoded directly in the shortened link
- **Custom Aliases**: Option to create memorable short URLs (requires backend implementation)
- **Modern UI**: Beautiful dark/light mode with interactive animations
- **URL Preview**: Verify destination before visiting
- **No Dependencies**: Works with any deployment platform

## How It Works

The URL shortener encodes your original URL using Base64 encoding and makes it URL-safe by replacing special characters. The encoded string becomes part of the shortened URL. When someone visits the short URL:

1. The encoded string is extracted from the URL path
2. Special characters are reverted to Base64 format
3. The string is decoded back to the original URL
4. User is redirected to the original destination

All processing happens client-side with no server storage involved.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/url-shortener.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser at:
```
http://localhost:3000
```

## Usage

1. Enter your long URL in the input field
2. Optionally add a custom alias (3-30 characters, letters/numbers only)
3. Click "Shorten URL"
4. Copy your new short URL or preview the destination

> **Note**: Custom aliases require backend implementation to work properly. The demo allows creating them but not resolving.

## Technologies Used

- Next.js (App Router)
- React.js
- Tailwind CSS
- Framer Motion (animations)
- JavaScript Base64 encoding

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request