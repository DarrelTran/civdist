from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from Backend.db.models import UserBase, UserItemsBase
from Backend.schemas.user import UserCreate, UserItemsCreate, UserItemsRead, UserRead

async def createUser(db: AsyncSession, user: UserCreate):
    userDB = UserBase(username=user.username, password=user.password)
    db.add(userDB)
    await db.commit()
    await db.refresh(userDB)

    return userDB

async def createUserItem(db: AsyncSession, item: UserItemsCreate):
    userItem = UserItemsBase(id=item.id, map=item.map, username=item.username)
    db.add(userItem)
    await db.commit()
    await db.refresh(userItem)

    return userItem

async def updateUser(db: AsyncSession, username: str, updatedUser: UserRead):
    '''
    Args:
        AsyncSession: db.
        str: username - The user to update.
        UserRead: updatedUser - The values to update the user with.
    
    Returns:
        UserRead: The updated user.
    '''

    # should always be a single result, username is PK
    userDB = await db.execute(select(UserBase).filter(UserBase.username == username)) 

    if not userDB:
        raise Exception("User with username of ", username, " was not found!")
    
    for key, value in updatedUser.model_dump(exclude_unset=True):
        setattr(userDB, key, value)

    await db.commit()
    await db.refresh(userDB)

    return userDB


async def updateUserItem(db: AsyncSession, id: int, updatedItem: UserItemsRead):
    '''
    Args:
        AsyncSession: db.
        int: id - The item to update.
        UserItemsRead: updatedItem - The values to update the item with.
    
    Returns:
        UserItemsRead: The updated item.
    '''

    # should always be a single result, id is PK
    itemDB = await db.execute(select(UserItemsBase).filter(UserItemsBase.id == id)) 

    if not itemDB:
        raise Exception("UserItem with id of ", id, " was not found!")
    
    for key, value in updatedItem.model_dump(exclude_unset=True):
        setattr(itemDB, key, value)

    await db.commit()
    await db.refresh(itemDB)

    return itemDB

async def deleteUser(db: AsyncSession, username: str):
    '''
    Args:
        AsyncSession: db
        str: username - The user to delete.
    
    Returns:
        Nothing.
    '''

    # should always be a single result, id is PK
    userDB = await db.execute(select(UserBase).filter(UserBase.username == username)) 

    if not userDB:
        raise Exception("User with username of ", username, " was not found!")
    
    await db.delete(userDB)

    await db.commit()
    await db.refresh(userDB)

async def deleteUserItem(db: AsyncSession, id: int):
    '''
    Args:
        AsyncSession: db
        int: id - The item to delete.
    
    Returns:
        Nothing.
    '''

    # should always be a single result, id is PK
    itemDB = await db.execute(select(UserItemsBase).filter(UserItemsBase.id == id)) 

    if not itemDB:
        raise Exception("UserItem with id of ", id, " was not found!")
    
    await db.delete(itemDB)

    await db.commit()
    await db.refresh(itemDB)