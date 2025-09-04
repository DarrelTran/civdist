from fastapi import Cookie, Depends, APIRouter, HTTPException, Response
from db.session import postgresqlSession
from db.models import UserBaseSQL
import services.userService as userServices
from schemas.user import UserItemsCreateSchema, UserCreateSchema, UserReadSchema, UserItemUpdateSchemaID, UserItemsReadSchemaID, UserItemsReadSchemaUsername
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from sqlalchemy.exc import IntegrityError
from exceptions.user import AlreadyExists, BadPassword, DoesNotExist
import routers.tokens as tokens
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
        raise HTTPException(status_code=400, detail='Invalid password!')
    except DoesNotExist as dne:
        raise HTTPException(status_code=404, detail='User does not exist!')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    if not userDB:
        raise HTTPException(status_code=400, detail='Invalid login credentials!')
        
    accessToken = tokens.createAccessToken({'sub': userDB.username})
    refreshToken = tokens.createRefreshToken({'sub': userDB.username})

    response.set_cookie(
        key='refresh_token',
        value=refreshToken,
        httponly=True,
        secure=True,
        samesite='lax',
        max_age=tokens.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    response.set_cookie(
        key='access_token',
        value=accessToken,
        httponly=True,
        secure=True,
        samesite='lax',
        max_age=tokens.ACCESS_TOKEN_EXPIRE_MIN * 60
    )

    return

@router.post('/refresh', status_code=201)
async def refreshToken(response: Response, refresh_token: str | None = Cookie(default=None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail='Refresh token missing!')

    payload = tokens.decodeToken(refresh_token)
    username: str = payload.get('sub')
    if not username:
        raise HTTPException(status_code=401, detail='Invalid refresh token!')

    newAccessToken = tokens.createAccessToken({'sub': username})

    response.set_cookie(
        key='access_token',
        value=newAccessToken,
        httponly=True,
        secure=True,
        samesite='lax',
        max_age=tokens.ACCESS_TOKEN_EXPIRE_MIN * 60
    )

    return

@router.post('/logout', status_code=204)
async def logoutUser(response: Response, username: str = Depends(tokens.getUserWithJWT)):
    if not username:
        raise HTTPException(status_code=401, detail='Invalid user!')

    response.delete_cookie(
        key='refresh_token',
        httponly=True,
        secure=True,
        samesite='lax'
    )

    response.delete_cookie(
        key='access_token',
        httponly=True,
        secure=True,
        samesite='lax'
    )

    return

@router.post('/verify', status_code=201)
async def verifyUser(username: str = Depends(tokens.getUserWithJWT)):
    return {'username': username}
    
''' ********* POST ********* '''
@router.post('/user', status_code=201)
async def addUser(user: UserCreateSchema, db: AsyncSession = Depends(getDB)):
    if len(user.username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')
    elif len(user.password.strip()) == 0:
        raise HTTPException(status_code=411, detail='password cannot be empty!')

    try:
        await userServices.createUser(db, user)
    except AlreadyExists as ae:
        raise HTTPException(status_code=409, detail=str(ae))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/map', status_code=201)
async def addMap(map: UserItemsCreateSchema, db: AsyncSession = Depends(getDB), username: str = Depends(tokens.getUserWithJWT)):
    if len(map.username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')
    elif len(map.mapName.strip()) == 0:
        raise HTTPException(status_code=411, detail='map name cannot be empty!')
    elif not map.map:
        raise HTTPException(status_code=411, detail='json map cannot be empty!')
    
    try:
        await userServices.createUserItem(db, map)
    except AlreadyExists as ae:
        raise HTTPException(status_code=409, detail=str(ae))
    except DoesNotExist as dne:
        raise HTTPException(status_code=404, detail=str(dne))
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
    except DoesNotExist as dne:
        raise HTTPException(status_code=404, detail=str(dne))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.patch('/map', status_code=204)
async def updateMap(map: UserItemUpdateSchemaID, db: AsyncSession = Depends(getDB), username: str = Depends(tokens.getUserWithJWT)):
    if not map.map:
        raise HTTPException(status_code=411, detail='json map cannot be empty!')
    elif len(map.mapName.strip()) == 0:
        raise HTTPException(status_code=411, detail='json map name cannot be empty!')
    
    try:
        await userServices.updateUserItem(db, map)
    except AlreadyExists as ae:
        print('CAUGHT 409 UPDATING MAP')
        raise HTTPException(status_code=409, detail=str(ae))
    except DoesNotExist as dne:
        raise HTTPException(status_code=404, detail=str(dne))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
''' ********* GET ********* '''
@router.get('/map', status_code=200)
async def getMap(id: int, db: AsyncSession = Depends(getDB), username: str = Depends(tokens.getUserWithJWT)):
    try:
        theMap = await userServices.getUserItem(db, UserItemsReadSchemaID(id=id))

        return {'map': jsonable_encoder(theMap)}
    except DoesNotExist as dne:
        raise HTTPException(status_code=404, detail=str(dne))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/allMaps', status_code=200)
async def getAllMaps(username: str = Depends(tokens.getUserWithJWT), db: AsyncSession = Depends(getDB)):
    if len(username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')

    try:
        theMaps = await userServices.getAllUserItems(db, UserItemsReadSchemaUsername(username=username))

        return {'maps': jsonable_encoder(theMaps)}
    except DoesNotExist as dne:
        raise HTTPException(status_code=404, detail=str(dne))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

''' ********* DELETE ********* '''
@router.delete('/user', status_code=204)
async def deleteUser(username: str = Depends(tokens.getUserWithJWT), db: AsyncSession = Depends(getDB)):
    if len(username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')
    
    try:
        await userServices.deleteUser(db, UserReadSchema(username=username))
    except DoesNotExist as dne:
        raise HTTPException(status_code=404, detail=str(dne))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.delete('/map', status_code=204)
async def deleteMapID(id: int, db: AsyncSession = Depends(getDB), username: str = Depends(tokens.getUserWithJWT)):
    try:
       await userServices.deleteUserItemID(db, UserItemsReadSchemaID(id=id))
    except DoesNotExist as dne:
        raise HTTPException(status_code=404, detail=str(dne))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete('/allMaps', status_code=204)
async def deleteMapUsername(username: str = Depends(tokens.getUserWithJWT), db: AsyncSession = Depends(getDB)):
    if len(username.strip()) == 0:
        raise HTTPException(status_code=411, detail='username cannot be empty!')

    try:
       await userServices.deleteUserItemUsername(db, UserItemsReadSchemaUsername(username=username))
    except DoesNotExist as dne:
        raise HTTPException(status_code=404, detail=str(dne))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))