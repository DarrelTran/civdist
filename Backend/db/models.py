from sqlalchemy import JSON, Text, Integer, Column, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

base = declarative_base()

class UserBase(base):
    __tablename__ = "User"

    username = Column(Text, primary_key=True, nullable=False)
    password = Column(Text, nullable=False)

class UserItemsBase(base):
    __tablename__ = "UserItems"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    map = Column(JSON, nullable=False)
    username = Column(Text, ForeignKey("User.username"), nullable=False)
    users = relationship("UserBase", backref="UserItems")