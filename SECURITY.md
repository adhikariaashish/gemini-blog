# Security Guide

## ⚠️ IMPORTANT: API Key Security

Your Gemini API key has been removed from the codebase for security reasons. Follow these steps to set it up securely:

### 1. Get Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key or use an existing one
3. Copy the API key

### 2. Set Up Environment Variables

1. Open the `.env.local` file in your project root
2. Replace `your_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Security Best Practices

#### ✅ DO:

- Keep your API key in `.env.local` (already in .gitignore)
- Use environment variables in your code: `process.env.GEMINI_API_KEY`
- Regenerate API keys periodically
- Use different API keys for development and production

#### ❌ DON'T:

- Commit API keys to git repositories
- Share API keys in code, emails, or chat
- Hardcode API keys in source files
- Use production API keys in development

### 4. If Your API Key Was Exposed:

1. **Immediately revoke** the exposed key in Google AI Studio
2. **Generate a new API key**
3. **Update your `.env.local`** file with the new key
4. **Check git history** to ensure no sensitive data was committed

### 5. Additional Security Measures:

- Set up API key restrictions in Google Cloud Console
- Monitor API usage for unexpected activity
- Use API key rotation policies
- Consider using Google Cloud IAM for production deployments

## Environment File Example:

```bash
# .env.local
GEMINI_API_KEY=your_actual_api_key_here

# Add other environment variables as needed
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Production Deployment:

When deploying to platforms like Vercel, Netlify, or Heroku:

1. Add environment variables through their dashboard/CLI
2. Never include `.env.local` in production builds
3. Use platform-specific secret management features
