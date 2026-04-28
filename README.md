# PDFTextEdit Pro

A fully functional SaaS web application that allows users to upload document-generated PDFs and directly edit the existing text inside the PDF like Adobe Acrobat. It uses PyMuPDF under the hood to manipulate the actual text layer.

## Architecture

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Zustand, PDF.js
- **Backend**: FastAPI (Python), PyMuPDF (fitz), Uvicorn

## Requirements

- Node.js 18+
- Python 3.9+
- Supabase account (for database/auth - optional for local test)
- Stripe account (for payments - optional for local test)

## Local Development Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd pdftextedit-pro
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Start the server (runs on localhost:8000)
uvicorn main:app --reload
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install

# Start the Next.js dev server (runs on localhost:3000)
npm run dev
```

### 4. Environment Variables
Copy the `.env.example` files to `.env` (backend) and `.env.local` (frontend) and fill in your keys.

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub.
2. Import the `frontend` directory as a new project in Vercel.
3. Add the environment variables from `.env.local`.
4. Deploy!

### Backend (Railway / Render)
1. Create a new Web Service pointing to the `backend` directory.
2. Set the Start Command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Add your Supabase and Stripe secrets to the environment variables.
4. Deploy!

## How Text Editing Works

Unlike many web-based PDF editors that simply overlay white rectangles and text, this application uses **PyMuPDF** to perform true object-level redaction and insertion:
1. The frontend extracts text blocks and coordinates via a `GET` request.
2. An overlay of transparent `div`s is rendered on top of the `PDF.js` canvas.
3. When a user clicks and edits a block, the new text is sent to the backend.
4. The backend uses `fitz` to redact the original text span and insert the new text at the exact same location with matching font properties.
5. The result is a fully selectable, searchable, modified PDF.
