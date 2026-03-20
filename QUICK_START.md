# Quick Start Guide

## Running the Backend

### Option 1: Using uvicorn directly
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Option 2: Using Python module
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at:** `http://localhost:8000`

---

## Running the Frontend

### First time setup (install dependencies)
```bash
cd frontend
npm install
```

### Run development server
```bash
cd frontend
npm run dev
```

**Frontend will be available at:** `http://localhost:3000`

---

## Running Both Together

### Terminal 1 (Backend)
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 (Frontend)
```bash
cd frontend
npm run dev
```

---

## Environment Variables

### Backend
Create a `.env` file in the `backend` directory (optional for local development):
```env
FRONTEND_URL=http://localhost:3000
PORT=8000
```

### Frontend
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Troubleshooting

### Backend Issues
- **Port already in use**: Change the port number: `--port 8001`
- **Module not found**: Install dependencies: `pip install -r requirements.txt`
- **Python not found**: Make sure Python 3.10+ is installed

### Frontend Issues
- **Port 3000 in use**: Next.js will automatically suggest port 3001
- **Dependencies missing**: Run `npm install` in the frontend directory
- **Build errors**: Delete `.next` folder and `node_modules`, then run `npm install` again
