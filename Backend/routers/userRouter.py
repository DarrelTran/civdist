

'''
async def addUser():
    async with postgresqlSession() as session: 
        newUser = await createUser(session, UserCreate(username="UserFromCode2", password="pass"))

        return newUser

run(addUser())
'''