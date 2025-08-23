from fastapi import Depends, FastAPI, HTTPException
from Backend.db.session import postgresqlSession
import Backend.services.userService as userServices
from Backend.schemas.user import UserItemsCreateSchema, UserCreateSchema, UserItemsReadSchema, UserReadSchema, TileType
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
#from fastapi.middleware.gzip import GZipMiddleware

router = FastAPI()
#router.add_middleware(GZipMiddleware)

async def getDB():
    async with postgresqlSession() as session:
        return session
    
''' ********* POST ********* '''
@router.post('/user/', status_code=201)
async def addUser(username: str, password: str, db: AsyncSession = Depends(getDB)):
    if len(username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    elif len(password) == 0:
        raise HTTPException(status_code=400, detail='password cannot be empty!')
    
    try:
        await userServices.createUser(db, UserCreateSchema(username=username, password=password))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/map/', status_code=201)
async def addMap(username: str, json: TileType, db: AsyncSession = Depends(getDB)):
    if len(username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    elif not json:
        raise HTTPException(status_code=400, detail='json map cannot be empty!')
    
    try:
        await userServices.createUserItem(db, UserItemsCreateSchema(map=json, username=username))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
''' ********* PATCH ********* '''
# should only update the password
@router.patch('/user/', status_code=204)
async def updateUser(username: str, password: str, db: AsyncSession = Depends(getDB)):
    if len(username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    elif len(password) == 0:
        raise HTTPException(status_code=400, detail='password cannot be empty!')
    
    try:
        await userServices.updateUser(db, UserReadSchema(username=username, password=password), username)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.patch('/map/', status_code=204)
async def updateMap(id: int, json: TileType, db: AsyncSession = Depends(getDB)):
    if not json:
        raise HTTPException(status_code=400, detail='json map cannot be empty!')
    
    try:
        await userServices.updateUserItem(db, UserItemsReadSchema(map=json), id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
''' ********* GET ********* '''
@router.get('/user/', status_code=200)
async def getUser(username: str, db: AsyncSession = Depends(getDB)):
    if len(username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    
    try:
        await userServices.getUser(db, username)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.get('/map/', status_code=200)
async def getMap(id: int, db: AsyncSession = Depends(getDB)):
    try:
        theMap = await userServices.getUserItem(db, id)

        return {'map': jsonable_encoder(theMap)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/allMaps/', status_code=200)
async def getAllMaps(username: str, db: AsyncSession = Depends(getDB)):
    if len(username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')

    try:
        theMaps = await userServices.getAllUserItems(db, username)

        return {'maps': jsonable_encoder(theMaps)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

''' ********* DELETE ********* '''
@router.delete('/user/', status_code=204)
async def deleteUser(username: str, db: AsyncSession = Depends(getDB)):
    if len(username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    
    try:
        await userServices.deleteUser(db, username)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.delete('/map/', status_code=204)
async def deleteMapID(id: int, db: AsyncSession = Depends(getDB)):
    try:
       await userServices.deleteUserItemID(db, id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete('/allMaps/', status_code=204)
async def deleteMapUsername(username: str, db: AsyncSession = Depends(getDB)):
    try:
       await userServices.deleteUserItemUsername(db, username)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))