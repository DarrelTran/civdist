import uvicorn
import pathlib

BASE_DIR = pathlib.Path(__file__).resolve().parent

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )