from Backend.config import authSettings
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from fastapi import HTTPException, Depends

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MIN = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7
SECRET = authSettings.tokenSecret

oath2Scheme = OAuth2PasswordBearer(tokenUrl='login')

def createToken(data: dict, expires: timedelta):
    theData = data.copy()
    expire = datetime.now() + expires
    theData.update({'exp': expire})

    return jwt.encode(theData, SECRET, algorithm=ALGORITHM)

def createAccessToken(data: dict):
    return createToken(data, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MIN))

def createRefreshToken(data: dict):
    return createToken(data, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))

def decodeToken(token: str):
    try:
        return jwt.decode(token, SECRET, algorithms=ALGORITHM)
    except:
        raise HTTPException(status_code=401, detail='Invalid or expired token!')
    
def getUserWithJWT(token: str = Depends(oath2Scheme)):
    payload = decodeToken(token)
    username = payload.get('sub')

    if not username: 
        raise HTTPException(status_code=401, detail='Invalid token!')
    
    return username