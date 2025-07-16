# AI Blog Hub

An intelligent blog platform powered by Google's Gemini AI, built with Next.js. Create, publish, and discover amazing blog content with AI assistance.

## ✨ New Features

### 🔐 **User Authentication**

- **Login & Signup Pages**: Beautiful authentication forms with proper validation
- **Guest Access**: Continue using the platform without creating an account
- **User Sessions**: Local storage for maintaining login state
- **Responsive Auth UI**: Mobile-friendly login and signup experiences

### 🏠 **Home Page & Publishing System**

- **Browse Published Blogs**: View all published blogs in a beautiful card layout
- **Publish Your Blogs**: One-click publishing from the write page
- **Author Attribution**: Add your name to published blogs
- **Real-time Updates**: See newly published blogs instantly

### ✍️ **Enhanced Writing Experience**

- **Full Blog Generation**: Generate complete blog posts from a single topic
- **AI-Assisted Writing**: Real-time AI suggestions as you write (VS Code Copilot style)
- **Smart Auto-completion**: Context-aware text suggestions based on your title and content
- **Keyboard Shortcuts**: Tab to accept, Esc to dismiss suggestions

## 🔒 Security Setup (IMPORTANT)

Before running the application, you need to set up your Gemini API key securely:

1. **Get your API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Copy `.env.local.example` to `.env.local`** (if it doesn't exist, create it)
3. **Add your API key** to `.env.local`:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```
4. **Never commit** your API key to version control

> ⚠️ **Security Note**: See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

### Full Blog Generation

1. Enter a topic in the "Generate Full Blog" section
2. Click "Generate Full Blog"
3. AI will create a complete blog post

### AI-Assisted Writing

1. Go to the "AI-ASSISTED BLOG" section
2. Enter a blog title
3. Start writing in the content area
4. AI will suggest completions as you type (after 10+ characters)
5. Accept or reject suggestions to continue writing

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/     # Full blog generation endpoint
│   │   └── suggest/      # AI suggestion endpoint
│   ├── page.tsx          # Main application page
│   └── layout.tsx        # Root layout
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Google Gemini AI** - AI text generation
- **Lodash Debounce** - Optimized API calls

## Environment Variables

Create a `.env.local` file with:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Google Gemini AI](https://ai.google.dev/) - AI model documentation
- [Tailwind CSS](https://tailwindcss.com/) - styling framework

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important for deployment:**

1. Add your `GEMINI_API_KEY` as an environment variable in your deployment platform
2. Never include `.env.local` in your deployed code

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
