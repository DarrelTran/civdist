from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from asyncpg.exceptions import UniqueViolationError
from Backend.schemas.user import UserCreateSchema, UserItemsCreateSchema, UserItemUpdateSchemaID, UserItemsReadSchemaID, UserItemsReadSchemaUsername, UserReadSchema, TileType
from Backend.db.models import UserBaseSQL, UserItemsBaseSQL
from Backend.exceptions.user import AlreadyExists, BadPassword, DoesNotExist
from bcrypt import hashpw, gensalt, checkpw

def getHashedPassword(password: str):
    thePass = password
    passBytes = thePass.encode('utf-8')

    hashedPW = hashpw(passBytes, gensalt())

    return hashedPW

''' ********* CREATE ********* '''
async def createUser(db: AsyncSession, user: UserCreateSchema):
    userDB = UserBaseSQL(username=user.username, password=getHashedPassword(user.password))

    try:
        db.add(userDB)

        await db.commit()
        await db.refresh(userDB)

    except IntegrityError as ue:
        if hasattr(ue.orig, 'pgcode') and ue.orig.pgcode == '23505':
            raise AlreadyExists(f'User {user.username} already exists!')

async def createUserItem(db: AsyncSession, item: UserItemsCreateSchema):
    # pydantic models are not json serializable
    mapData = item.map
    if isinstance(item.map, TileType):
        mapData = mapData.model_dump()
    else:
        mapData = [tile.model_dump() for tile in mapData]

    userItem = UserItemsBaseSQL(map=mapData, username=item.username, mapName=item.mapName, visualIndex=item.visualIndex)

    try:
        db.add(userItem)

        await db.commit()
        await db.refresh(userItem)
    except IntegrityError as ue:
        if hasattr(ue.orig, 'pgcode') and ue.orig.pgcode == '23505':
            raise AlreadyExists(f'Item {item.mapName} already exists!') 
    except IntegrityError as e:
        raise DoesNotExist(f'User {item.username} does not exist!')

''' ********* GET ********* '''
async def getUser(db: AsyncSession, user: UserCreateSchema):
    userDB = await db.get(UserBaseSQL, user.username)

    if not userDB:
        raise DoesNotExist(f"User with username of {user.username} was not found!")

    thePass = user.password.encode('utf-8')
    if not checkpw(thePass, userDB.password):
        raise BadPassword(f"User with username of {user.username} entered the wrong password!")
        
    return userDB

async def getUserItem(db: AsyncSession, item: UserItemsReadSchemaID):    
    userItem = await db.get(UserItemsBaseSQL, item.id)

    if not userItem:
        raise DoesNotExist(f"UserItem with id of {item.id} was not found!")

    return userItem

async def getAllUserItems(db: AsyncSession, user: UserItemsReadSchemaUsername):    
    userItems = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.username == user.username)) 

    scalarItems = userItems.scalars().all()

    if len(scalarItems) == 0:
        raise DoesNotExist(f"UserItems with username of {user.username} was not found!")

    return scalarItems

''' ********* UPDATE ********* '''
# should only update the password
async def updateUser(db: AsyncSession, user: UserCreateSchema):
    userDB = await db.execute(select(UserBaseSQL).filter(UserBaseSQL.username == user.username))

    theUser = userDB.scalar_one_or_none()

    if not theUser:
        raise DoesNotExist(f"User with username of {user.username} was not found!")
    
    theUser.password = getHashedPassword(user.password)

    await db.commit()
    await db.refresh(theUser)

    return theUser

async def updateUserItem(db: AsyncSession, updatedItem: UserItemUpdateSchemaID):
    itemDB = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.id == updatedItem.id)) 

    theItem = itemDB.scalar_one_or_none()

    # pydantic models are not json serializable
    mapData = updatedItem.map
    if isinstance(updatedItem.map, TileType):
        mapData = mapData.model_dump()
    else:
        mapData = [tile.model_dump() for tile in mapData]

    if not theItem:
        raise DoesNotExist(f"UserItem with id of {updatedItem.id} was not found!")
    
    # users can't exchange maps, no need to change anything else
    theItem.map = mapData
    theItem.mapName = updatedItem.mapName
    theItem.visualIndex = updatedItem.visualIndex

    try:
        await db.commit()
        await db.refresh(theItem)
    except IntegrityError as ue:
        if hasattr(ue.orig, 'pgcode') and ue.orig.pgcode == '23505':
            raise AlreadyExists(f'Item {updatedItem.mapName} already exists!') 

    return theItem

''' ********* DELETE ********* '''
async def deleteUser(db: AsyncSession, username: UserReadSchema):
    userDB = await db.execute(select(UserBaseSQL).where(UserBaseSQL.username == username.username)) 

    theUser = userDB.scalar_one_or_none()

    if not theUser:
        raise DoesNotExist(f"User with username of {username} was not found!")
        
    await db.delete(theUser)

    await db.commit()

async def deleteUserItemID(db: AsyncSession, item: UserItemsReadSchemaID):
    itemDB = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.id == item.id)) 

    theItem = itemDB.scalar_one_or_none()

    if not theItem:
        raise DoesNotExist(f"UserItem with id of {item.id} was not found!")
    
    await db.delete(theItem)

    await db.commit()

async def deleteUserItemUsername(db: AsyncSession, map: UserItemsReadSchemaUsername):
    itemDB = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.username == map.username)) 

    itemScalars = itemDB.scalars().all()

    if len(itemScalars) == 0:
        raise DoesNotExist(f"UserItems with username of {map.username} was not found!")
        
    # max 5 items so should not be too slow
    for item in itemScalars:
        await db.delete(item)

    await db.commit()