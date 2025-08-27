from fastapi import Cookie, Depends, APIRouter, HTTPException, Response
from Backend.db.session import postgresqlSession
from Backend.db.models import UserBaseSQL
import Backend.services.userService as userServices
from Backend.schemas.user import UserItemsCreateSchema, UserCreateSchema, UserReadSchema, UserItemUpdateSchemaID, UserItemsReadSchemaID, UserItemsReadSchemaUsername
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from sqlalchemy.exc import IntegrityError
from Backend.exceptions.user import BadPassword
import Backend.routers.tokens as tokens
#from fastapi.middleware.gzip import GZipMiddleware

router = APIRouter()
#router.add_middleware(GZipMiddleware)

async def getDB():
    db = postgresqlSession()

    try:
        yield db
    finally:
        await db.close()

''' ********* AUTH ********* '''
@router.post('/login', status_code=201)
async def loginUser(user: UserCreateSchema, response: Response, db: AsyncSession = Depends(getDB)):
    if len(user.username) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')
    elif len(user.username) == 0:
        raise HTTPException(status_code=411, detail='password cannot be empty!')

    userDB: UserBaseSQL | None = None

    try:
        userDB = await userServices.getUser(db, user)
    except BadPassword as bp:
        raise HTTPException(status_code=400, detail="Invalid password!")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    if not userDB:
        raise HTTPException(status_code=400, detail="Invalid login credentials!")
        
    accessToken = tokens.createAccessToken({'sub': userDB.username})
    refreshToken = tokens.createRefreshToken({'sub': userDB.username})

    response.set_cookie(
        key='refresh-token',
        value=refreshToken,
        httponly=True,
        secure=True,
        samesite='none',
        max_age=tokens.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return {'access_token': accessToken, 'token_type': 'bearer'}

@router.post('/refresh', status_code=201)
async def refreshToken(refresh_token: str | None = Cookie(default=None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing!")

    payload = tokens.decodeToken(refresh_token)
    username: str = payload.get('sub')
    if not username:
        raise HTTPException(status_code=401, detail="Invalid refresh token!")

    newAccessToken = tokens.createAccessToken({'sub': username})
    return {"access_token": newAccessToken, "token_type": "bearer"}

@router.post('/logout', status_code=204)
async def logoutUser(response: Response):
    response.delete_cookie(
        key='refresh-token',
        httponly=True,
        secure=True,
        samesite='none'
    )

    return

@router.post('/verify', status_code=201)
async def verifyUser(username: str = Depends(tokens.getUserWithJWT)):
    return {"username": username}
    
''' ********* POST ********* '''
@router.post('/user', status_code=201)
async def addUser(user: UserCreateSchema, db: AsyncSession = Depends(getDB)):
    if len(user.username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')
    elif len(user.password.strip()) == 0:
        raise HTTPException(status_code=411, detail='password cannot be empty!')

    try:
        await userServices.createUser(db, user)
    except IntegrityError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/map', status_code=201)
async def addMap(map: UserItemsCreateSchema, db: AsyncSession = Depends(getDB), username: str = Depends(tokens.getUserWithJWT)):
    if len(map.username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')
    elif not map.map:
        raise HTTPException(status_code=411, detail='json map cannot be empty!')
    
    try:
        await userServices.createUserItem(db, map)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
''' ********* PATCH ********* '''
# should only update the password
@router.patch('/user', status_code=204)
async def updateUser(user: UserCreateSchema, db: AsyncSession = Depends(getDB), username: str = Depends(tokens.getUserWithJWT)):
    if len(user.username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')
    elif len(user.password.strip()) == 0:
        raise HTTPException(status_code=411, detail='password cannot be empty!')
    
    try:
        await userServices.updateUser(db, user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.patch('/map', status_code=204)
async def updateMap(map: UserItemUpdateSchemaID, db: AsyncSession = Depends(getDB), username: str = Depends(tokens.getUserWithJWT)):
    if not map.map:
        raise HTTPException(status_code=411, detail='json map cannot be empty!')
    
    try:
        await userServices.updateUserItem(db, map)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
''' ********* GET ********* '''
@router.get('/map', status_code=200)
async def getMap(id: int, db: AsyncSession = Depends(getDB), username: str = Depends(tokens.getUserWithJWT)):
    try:
        theMap = await userServices.getUserItem(db, UserItemsReadSchemaID(id=id))

        return {'map': jsonable_encoder(theMap)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/allMaps', status_code=200)
async def getAllMaps(username: str = Depends(tokens.getUserWithJWT), db: AsyncSession = Depends(getDB)):
    if len(username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')

    try:
        theMaps = await userServices.getAllUserItems(db, UserItemsReadSchemaUsername(username=username))

        return {'maps': jsonable_encoder(theMaps)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

''' ********* DELETE ********* '''
@router.delete('/user', status_code=204)
async def deleteUser(username: str = Depends(tokens.getUserWithJWT), db: AsyncSession = Depends(getDB)):
    if len(username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')
    
    try:
        await userServices.deleteUser(db, UserReadSchema(username=username))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.delete('/map', status_code=204)
async def deleteMapID(id: int, db: AsyncSession = Depends(getDB), username: str = Depends(tokens.getUserWithJWT)):
    try:
       await userServices.deleteUserItemID(db, UserItemsReadSchemaID(id=id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete('/allMaps', status_code=204)
async def deleteMapUsername(username: str = Depends(tokens.getUserWithJWT), db: AsyncSession = Depends(getDB)):
    if len(username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')

    try:
       await userServices.deleteUserItemUsername(db, UserItemsReadSchemaUsername(username=username))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))