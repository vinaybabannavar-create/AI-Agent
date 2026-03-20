# AI Agent Builder System - Frontend

Next.js frontend for the AI Agent Builder System with a modern, responsive UI.

## Features

- **User Authentication**: Signup and login functionality
- **Dashboard**: Main control panel for AI agents
- **Document Upload**: Upload and process documents
- **Chat Interface**: Interactive AI chat
- **History Tracking**: View analysis history
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14.2.3
- **Language**: TypeScript
- **UI**: React 18
- **PDF Generation**: jsPDF
- **Styling**: CSS Modules

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set `NEXT_PUBLIC_API_URL` to your backend URL.

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the recommended platform for Next.js applications:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via GitHub**:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
   - Add environment variable:
     - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)
   - Click "Deploy"

3. **Deploy via CLI**:
   ```bash
   cd frontend
   vercel
   ```

### Deploy to Netlify

1. Create a new site on [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Configure:
   - **Base Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
5. Deploy

### Important: Environment Variables

After deployment, you **must** update your backend's `FRONTEND_URL` environment variable to match your deployed frontend URL:

```bash
# Example for Render backend
FRONTEND_URL=https://your-app.vercel.app
```

This is required for CORS to work correctly.

## Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` | Yes |

> **Note**: All environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Dashboard pages
│   │   ├── page.tsx       # Main dashboard
│   │   └── history/       # History view
│   ├── chat/              # Chat interface
│   ├── documents/         # Document management
│   │   ├── upload/        # Upload page
│   │   └── [id]/          # Document detail
│   └── context/           # React contexts
│       └── AuthContext.tsx
├── public/                # Static assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js config
└── .env.example           # Environment template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` in `.env.local` is correct
- Check that the backend is running and accessible
- Ensure CORS is properly configured on the backend

### Build Failures
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Check for TypeScript errors with `npm run lint`

### Environment Variables Not Working
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Restart the development server after changing `.env.local`
- For production, set variables in your hosting platform's dashboard

## License

This project is part of the AI Agent Builder System.
