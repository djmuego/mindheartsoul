<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1BBHJm_iIra5KHfAhQS8VqSnkpK3cdCcE

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key:
   - Copy `.env.example` to `.env.local`
   - Get your API key from: https://makersuite.google.com/app/apikey
   - Replace `PLACEHOLDER_API_KEY` with your actual key
3. Run the app:
   `npm run dev`

**Note:** The app will work without an API key, but AI features will show a friendly "temporarily unavailable" message.
