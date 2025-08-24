from sqlalchemy import JSON, Text, Integer, Column, ForeignKey, BINARY
from sqlalchemy.orm import declarative_base, relationship

base = declarative_base()

class UserBaseSQL(base):
    __tablename__ = "User"

    username = Column(Text, primary_key=True, nullable=False)
    password = Column(BINARY, nullable=False)

    items = relationship("UserItemsBaseSQL", back_populates="users", cascade="all, delete-orphan")

class UserItemsBaseSQL(base):
    __tablename__ = "UserItems"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    map = Column(JSON, nullable=False)
    username = Column(Text, ForeignKey("User.username", ondelete="CASCADE"), nullable=False)

    users = relationship("UserBaseSQL", back_populates="items")