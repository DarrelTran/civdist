from Backend.config import authSettings
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from fastapi import HTTPException, Depends, Cookie

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MIN = 30
REFRESH_TOKEN_EXPIRE_DAYS = 4
SECRET = authSettings.tokenSecret

oath2Scheme = OAuth2PasswordBearer(tokenUrl='login')

def createToken(data: dict, expires: timedelta):
    theData = data.copy()
    expire = datetime.now(timezone.utc) + expires
    theData.update({'exp': expire})

    return jwt.encode(theData, SECRET, algorithm=ALGORITHM)

def createAccessToken(data: dict):
    return createToken(data, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MIN))

def createRefreshToken(data: dict):
    return createToken(data, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))

def decodeToken(token: str):
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    except JWTError as e:
        raise HTTPException(status_code=401, detail='Invalid or expired token!')
    
def getUserWithJWT(access_token: str | None = Cookie(default=None)): # access_token name has to be exact name as one sent in cookie response
    if not access_token:
        raise HTTPException(status_code=401, detail='Missing access token!')

    payload = decodeToken(access_token)
    username = payload.get('sub')

    if not username: 
        raise HTTPException(status_code=401, detail='Invalid token!')
    
    return username