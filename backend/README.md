# AI Agent Builder System - Backend

FastAPI backend for the AI Agent Builder System with multi-modal analysis capabilities.

## Features

- **Authentication**: User registration and login
- **Document Analysis**: Multi-agent system for processing documents
- **Vision Processing**: OCR and image analysis using Tesseract
- **PDF Processing**: Extract and analyze PDF content

## Tech Stack

- **Framework**: FastAPI
- **OCR**: Tesseract OCR, pytesseract
- **PDF Processing**: pdfplumber
- **Computer Vision**: OpenCV
- **Server**: Uvicorn/Gunicorn

## Local Development

### Prerequisites

- Python 3.10 or higher
- Tesseract OCR installed on your system

### Installation

1. **Install Tesseract OCR**:
   - **Windows**: Download from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
   - **macOS**: `brew install tesseract`
   - **Linux**: `sudo apt-get install tesseract-ocr`

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure as needed.

### Running the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using Python module
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Deployment

### Using Docker

The included `Dockerfile` is production-ready:

```bash
# Build image
docker build -t ai-agent-backend .

# Run container
docker run -p 8000:8000 -e FRONTEND_URL=https://your-frontend.vercel.app ai-agent-backend
```

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT`
4. Add environment variables:
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://your-app.vercel.app`)
   - `ENVIRONMENT`: `production`

### Deploy to Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will auto-detect the Dockerfile
4. Add environment variables:
   - `FRONTEND_URL`: Your frontend URL
   - `PORT`: `8000` (Railway will override this automatically)

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` | Yes |
| `PORT` | Server port | `8000` | No |
| `ENVIRONMENT` | Environment name | `development` | No |

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status.

### Authentication
```
POST /auth/signup
POST /auth/login
```

### Analysis
```
POST /analyze
```
Run multi-agent analysis on uploaded documents.

## Project Structure

```
backend/
├── agents/              # AI agent modules
│   ├── text_agent.py
│   ├── vision_agent.py
│   ├── validation_agent.py
│   └── fusion_agent.py
├── analysis/            # Analysis management
│   └── manager.py
├── auth/                # Authentication routes
│   └── routes.py
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker configuration
└── .env.example         # Environment template
```

## Troubleshooting

### Tesseract Not Found
If you get "Tesseract not found" errors:
- Ensure Tesseract is installed
- On Windows, add Tesseract to your PATH or set `TESSERACT_CMD` environment variable

### CORS Errors
- Verify `FRONTEND_URL` in `.env` matches your frontend URL exactly
- Check that the frontend is making requests to the correct backend URL

### Port Already in Use
```bash
# Use a different port
uvicorn main:app --reload --port 8001
```

## License

This project is part of the AI Agent Builder System.
