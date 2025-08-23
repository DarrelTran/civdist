from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from Backend.schemas.user import UserItemsReadSchema, UserCreateSchema, UserItemsCreateSchema, UserReadSchema
from Backend.db.models import UserBaseSQL, UserItemsBaseSQL

''' ********* CREATE ********* '''
async def createUser(db: AsyncSession, user: UserCreateSchema):
    userDB = UserBaseSQL(username=user.username, password=user.password)

    db.add(userDB)

    await db.commit()
    await db.refresh(userDB)

async def createUserItem(db: AsyncSession, item: UserItemsCreateSchema):
    userItem = UserItemsBaseSQL(map=item.map, username=item.username)

    db.add(userItem)

    await db.commit()
    await db.refresh(userItem)

''' ********* GET ********* '''
async def getUser(db: AsyncSession, username: str):
    userDB = await db.get(UserBaseSQL, username)

    if not userDB:
        raise Exception(f"User with username of {username} was not found!")
        
    return userDB

async def getUserItem(db: AsyncSession, id: int):    
    userItem = await db.get(UserItemsBaseSQL, id)

    if not userItem:
        raise Exception(f"UserItem with id of {id} was not found!")

    return userItem

async def getAllUserItems(db: AsyncSession, username: str):    
    userItems = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.username == username)) 

    return userItems.scalars().all()

''' ********* UPDATE ********* '''
async def updateUser(db: AsyncSession, updatedUser: UserReadSchema, username: str):
    userDB = await db.execute(select(UserBaseSQL).filter(UserBaseSQL.username == username))

    theUser = userDB.scalar_one_or_none()

    if not theUser:
        raise Exception(f"User with username of {username} was not found!")
    
    theUser.username = updatedUser.username
    theUser.password = updatedUser.password

    await db.commit()
    await db.refresh(theUser)

    return theUser

async def updateUserItem(db: AsyncSession, updatedItem: UserItemsReadSchema, id: int):
    itemDB = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.id == id)) 

    theItem = itemDB.scalar_one_or_none()

    if not theItem:
        raise Exception(f"UserItem with id of {id} was not found!")
    
    # users can't exchange maps, no need to change anything else
    theItem.map = updatedItem.map

    await db.commit()
    await db.refresh(theItem)

    return theItem

''' ********* DELETE ********* '''
async def deleteUser(db: AsyncSession, username: str):
    userDB = await db.execute(select(UserBaseSQL).where(UserBaseSQL.username == username)) 

    theUser = userDB.scalar_one_or_none()

    if not theUser:
        raise Exception(f"User with username of {username} was not found!")
        
    await db.delete(theUser)

    await db.commit()

async def deleteUserItemID(db: AsyncSession, id: int):
    itemDB = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.id == id)) 

    theItem = itemDB.scalar_one_or_none()

    if not theItem:
        raise Exception(f"UserItem with id of {id} was not found!")
    
    await db.delete(theItem)

    await db.commit()

async def deleteUserItemUsername(db: AsyncSession, username: str):
    itemDB = await db.execute(select(UserItemsBaseSQL).where(UserItemsBaseSQL.username == username)) 

    allItems = itemDB.scalars().all()
    
    # max 5 items so should not be too slow
    for item in allItems:
        await db.delete(item)

    await db.commit()

from asyncio import run
from Backend.db.session import postgresqlSession
from fastapi.encoders import jsonable_encoder

async def test():
    async with postgresqlSession() as session: 
        allItems = await getUserItem(session, 6)

        print(jsonable_encoder(allItems))

run(test())