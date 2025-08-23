from Backend.db.session import engine
from sqlalchemy.schema import MetaData
from routers.userRouter import router
from fastapi import FastAPI

MetaData.create_all(bind=engine)

app = FastAPI()
app.include_router(router=router)