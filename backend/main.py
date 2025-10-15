# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from database import Base, engine
# from fastapi.responses import FileResponse
# from fastapi.staticfiles import StaticFiles       # ✅ Add this
# import models
# from routes import users, transactions, auth, ocr
# import os

# # ✅ Create all tables (if they don't exist)
# # This runs automatically at startup and ensures the schema matches models.py
# Base.metadata.create_all(bind=engine)

# # ✅ Initialize the app
# app = FastAPI(title="CashFlowTrack API")

# # ✅ CORS Settings
# origins = [
#     "http://localhost:5173",        # Local Vite dev server
#     "http://127.0.0.1:5173",
#     "http://localhost:3000",  # Serve / React preview
#     "http://127.0.0.1:3000",
#     os.getenv("FRONTEND_ORIGIN", ""),  # Allow Render or Netlify frontend
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[origin for origin in origins if origin],  # Filter out empty strings
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ✅ Register all routers
# app.include_router(users.router)
# app.include_router(transactions.router)
# app.include_router(auth.router)
# app.include_router(ocr.router)

# # --- Serve React frontend from /dist ---
# frontend_path = os.path.join(os.path.dirname(__file__), "../dist")
# if os.path.exists(frontend_path):
#     app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")

#     @app.get("/")
#     async def serve_index():
#         return FileResponse(os.path.join(frontend_path, "index.html"))

# # ✅ (Optional) Health-check endpoint for Render
# @app.get("/")
# def root():
#     return {"message": "✅ CashFlowTrack API is running with Supabase database!"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import Base, engine
import models
from routes import users, transactions, auth, ocr
import os

# --- Database initialization ---
Base.metadata.create_all(bind=engine)

# --- FastAPI app ---
app = FastAPI(title="CashFlowTrack API")

# --- CORS settings ---
origins = [
    "http://localhost:5173",   # local dev
    "http://127.0.0.1:5173",
    "http://localhost:3000",   # vite preview / serve
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_ORIGIN", ""),  # production frontend (Render, Netlify, etc.)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(auth.router)
app.include_router(ocr.router)

# --- Serve built frontend (React/Vite) ---
frontend_path = os.path.join(os.path.dirname(__file__), "../dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
else:
    @app.get("/")
    def root():
        return {"message": "✅ CashFlowTrack API is running (no dist folder found)"}
