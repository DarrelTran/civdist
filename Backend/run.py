import uvicorn
import pathlib

BASE_DIR = pathlib.Path(__file__).resolve().parent
CERT_DIR = BASE_DIR / "cert"

if __name__ == "__main__":
    uvicorn.run(
        "Backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        ssl_certfile=str(CERT_DIR / "cert.pem"),
        ssl_keyfile=str(CERT_DIR / "key.pem")
    )