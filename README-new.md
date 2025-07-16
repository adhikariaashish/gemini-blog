# AI Blog Hub

An intelligent blog platform powered by Google's Gemini AI, built with Next.js. Create, publish, and discover amazing blog content with AI assistance.

## ✨ Features

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

## 🚀 Quick Start

1. **Set up your API key** in `.env.local`:

   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

2. **Install and run**:

   ```bash
   npm install
   npm run dev
   ```

3. **Visit the app**: Open `http://localhost:3000`

## 📱 How to Use

### **Landing Page** (`/`)

- Beautiful landing page with feature overview
- Auto-redirects to home page after 3 seconds
- Quick access to writing, browsing, login, and signup

### **Authentication** (`/login`, `/signup`)

- **Login Page**: Sign in with email and password
- **Signup Page**: Create new account with full name, email, and password
- **Guest Access**: Use "Continue as guest" to skip authentication
- **Auto Login**: Successful authentication redirects to home page

### **Home Page** (`/home`)

- Browse all published blogs
- See author names and publication dates
- Access login/signup buttons in header
- Click "Write Blog" to create new content

### **Write Page** (`/write`)

- **Full Generation**: Enter topic → Generate → Publish
- **AI-Assisted**: Enter title → Write with AI suggestions → Publish
- Real-time VS Code Copilot-style suggestions
- Optional author name input
- Authentication buttons in header

## 🎯 Key Features

- **Authentication System**: Login and signup with form validation
- **VS Code Copilot-Style Suggestions**: Grayed-out text appears inline as you type
- **One-Click Publishing**: Instantly share your blogs with others
- **Responsive Design**: Works perfectly on desktop and mobile
- **Sample Content**: Includes demo blogs to showcase the platform
- **Clean Navigation**: Easy switching between writing, browsing, and authentication

## 🔧 Technical Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Google Gemini AI** for content generation
- **React hooks** for state management

## 🛣️ Site Structure

```
/                 - Landing page (redirects to /home)
/home            - Browse published blogs
/write           - Create new blogs
/login           - User authentication (login)
/signup          - User registration
/api/blogs       - Publishing & fetching endpoint
/api/generate    - Full blog generation
/api/suggest     - AI writing suggestions
```

## 🚀 Deployment

1. **Vercel** (recommended): Connect repo → Add API key → Deploy
2. **Other platforms**: Ensure Node.js 18+ and add environment variables

## 🔮 Coming Soon

- **User Authentication Backend**: Secure user management with database
- **Blog Detail Pages**: Full reading experience with comments
- **User Profiles**: Personal dashboards and blog management
- **Search & Filtering**: Find blogs by keywords and categories
- **Social Features**: Follow authors, like posts, and more

---

**Create amazing blogs with the power of AI! 🚀**
