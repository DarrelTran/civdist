from fastapi import Depends, APIRouter, HTTPException
from Backend.db.session import postgresqlSession
from Backend.exceptions.user import BadPassword
import Backend.services.userService as userServices
from Backend.schemas.user import UserItemsCreateSchema, UserCreateSchema, UserReadSchema, UserItemUpdateSchemaID, UserItemsReadSchemaID, UserItemsReadSchemaUsername
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
#from fastapi.middleware.gzip import GZipMiddleware

router = APIRouter()
#router.add_middleware(GZipMiddleware)

async def getDB():
    async with postgresqlSession() as session:
        return session
    
''' ********* POST ********* '''
@router.post('/user/', status_code=201)
async def addUser(user: UserCreateSchema, db: AsyncSession = Depends(getDB)):
    if len(user.username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    elif len(user.username) == 0:
        raise HTTPException(status_code=400, detail='password cannot be empty!')
    
    try:
        await userServices.createUser(db, user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/map/', status_code=201)
async def addMap(map: UserItemsCreateSchema, db: AsyncSession = Depends(getDB)):
    if len(map.username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    elif not map.map:
        raise HTTPException(status_code=400, detail='json map cannot be empty!')
    
    try:
        await userServices.createUserItem(db, map)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
''' ********* PATCH ********* '''
# should only update the password
@router.patch('/user/', status_code=204)
async def updateUser(user: UserCreateSchema, db: AsyncSession = Depends(getDB)):
    if len(user.username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    elif len(user.password) == 0:
        raise HTTPException(status_code=400, detail='password cannot be empty!')
    
    try:
        await userServices.updateUser(db, user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.patch('/map/', status_code=204)
async def updateMap(map: UserItemUpdateSchemaID, db: AsyncSession = Depends(getDB)):
    if not map.map:
        raise HTTPException(status_code=400, detail='json map cannot be empty!')
    
    try:
        await userServices.updateUserItem(db, map)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
''' ********* GET ********* '''
@router.get('/user/', status_code=200)
async def getUser(user: UserCreateSchema, str, db: AsyncSession = Depends(getDB)):
    if len(user.username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    elif len(user.password) == 0:
        raise HTTPException(status_code=400, detail='password cannot be empty!')
    
    try:
        await userServices.getUser(db, user)
    except BadPassword as e:
        raise HTTPException(status_code=400, detail=str(e))  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.get('/map/', status_code=200)
async def getMap(map: UserItemsReadSchemaID, db: AsyncSession = Depends(getDB)):
    try:
        theMap = await userServices.getUserItem(db, map.id)

        return {'map': jsonable_encoder(theMap)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/allMaps/', status_code=200)
async def getAllMaps(map: UserItemsReadSchemaUsername, db: AsyncSession = Depends(getDB)):
    if len(map.username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')

    try:
        theMaps = await userServices.getAllUserItems(db, map)

        return {'maps': jsonable_encoder(theMaps)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

''' ********* DELETE ********* '''
@router.delete('/user/', status_code=204)
async def deleteUser(user: UserReadSchema, db: AsyncSession = Depends(getDB)):
    if len(user.username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')
    
    try:
        await userServices.deleteUser(db, user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.delete('/map/', status_code=204)
async def deleteMapID(map: UserItemsReadSchemaID, db: AsyncSession = Depends(getDB)):
    try:
       await userServices.deleteUserItemID(db, map)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete('/allMaps/', status_code=204)
async def deleteMapUsername(map: UserItemsReadSchemaUsername, db: AsyncSession = Depends(getDB)):
    if len(map.username) == 0:
        raise HTTPException(status_code=400, detail='username cannot be empty!')

    try:
       await userServices.deleteUserItemUsername(db, map)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))