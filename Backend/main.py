from routers.userRouter import router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins = [
    'https://civdist.vercel.app'
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router=router)