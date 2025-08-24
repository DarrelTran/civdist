from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from Backend.schemas.user import UserCreateSchema, UserItemsCreateSchema, UserItemUpdateSchemaID, UserItemsReadSchemaID, UserItemsReadSchemaUsername, UserReadSchema
from Backend.db.models import UserBaseSQL, UserItemsBaseSQL
from Backend.exceptions.user import BadPassword
from bcrypt import hashpw, gensalt, checkpw

def getHashedPassword(password: str):
    thePass = password
    passBytes = thePass.encode('utf-8')

    hashedPW = hashpw(passBytes, gensalt())

    return hashedPW

''' ********* CREATE ********* '''
async def createUser(db: AsyncSession, user: UserCreateSchema):
    userDB = UserBaseSQL(username=user.username, password=getHashedPassword(user.password))

    db.add(userDB)

    await db.commit()
    await db.refresh(userDB)

async def createUserItem(db: AsyncSession, item: UserItemsCreateSchema):
    userItem = UserItemsBaseSQL(map=item.map, username=item.username)

    db.add(userItem)

    await db.commit()
    await db.refresh(userItem)

''' ********* GET ********* '''
async def getUser(db: AsyncSession, user: UserCreateSchema):
    userDB = await db.get(UserBaseSQL, user.username)

    if not userDB:
        raise Exception(f"User with username of {user.username} was not found!")

    thePass = user.password.encode('utf-8')
    if not checkpw(thePass, userDB.password):
        raise BadPassword(f"User with username of {user.username} entered the wrong password!")
        
    return userDB

async def getUserItem(db: AsyncSession, item: UserItemsReadSchemaID):    
    userItem = await db.get(UserItemsBaseSQL, item.id)

    if not userItem:
        raise Exception(f"UserItem with id of {item.id} was not found!")

    return userItem

async def getAllUserItems(db: AsyncSession, user: UserItemsReadSchemaUsername):    
    userItems = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.username == user.username)) 

    return userItems.scalars().all()

''' ********* UPDATE ********* '''
# should only update the password
async def updateUser(db: AsyncSession, user: UserCreateSchema):
    userDB = await db.execute(select(UserBaseSQL).filter(UserBaseSQL.username == user.username))

    theUser = userDB.scalar_one_or_none()

    if not theUser:
        raise Exception(f"User with username of {user.username} was not found!")
    
    theUser.password = getHashedPassword(user.password)

    await db.commit()
    await db.refresh(theUser)

    return theUser

async def updateUserItem(db: AsyncSession, updatedItem: UserItemUpdateSchemaID):
    itemDB = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.id == updatedItem.id)) 

    theItem = itemDB.scalar_one_or_none()

    if not theItem:
        raise Exception(f"UserItem with id of {updatedItem.id} was not found!")
    
    # users can't exchange maps, no need to change anything else
    theItem.map = updatedItem.map

    await db.commit()
    await db.refresh(theItem)

    return theItem

''' ********* DELETE ********* '''
async def deleteUser(db: AsyncSession, username: UserReadSchema):
    userDB = await db.execute(select(UserBaseSQL).where(UserBaseSQL.username == username)) 

    theUser = userDB.scalar_one_or_none()

    if not theUser:
        raise Exception(f"User with username of {username} was not found!")
        
    await db.delete(theUser)

    await db.commit()

async def deleteUserItemID(db: AsyncSession, item: UserItemsReadSchemaID):
    itemDB = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.id == item.id)) 

    theItem = itemDB.scalar_one_or_none()

    if not theItem:
        raise Exception(f"UserItem with id of {item.id} was not found!")
    
    await db.delete(theItem)

    await db.commit()

async def deleteUserItemUsername(db: AsyncSession, map: UserItemsReadSchemaUsername):
    itemDB = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.username == map.username)) 

    allItems = itemDB.scalars().all()
    
    # max 5 items so should not be too slow
    for item in allItems:
        await db.delete(item)

    await db.commit()

'''from asyncio import run
from Backend.db.session import postgresqlSession
from fastapi.encoders import jsonable_encoder

async def test():
    async with postgresqlSession() as session: 
        user = await getUser(session, "hashedUser", "hashedP")

run(test()) # hashedPW'''