import pytest
from app.repositories.user import SqlAlchemyUserRepository
from app.models.user import User as UserModel

@pytest.fixture
def user_repo() -> SqlAlchemyUserRepository:
    return SqlAlchemyUserRepository()

def test_create_user(db, user_repo: SqlAlchemyUserRepository):
    user = user_repo.create(
        db=db,
        email="test@1234",
        full_name="Test User",
        hashed_password="hashedpassword123!"
    )
    db.commit()
    assert user.id is not None
    assert user.email == "test@1234"
    assert user.full_name == "Test User"
    assert user.hashed_password == "hashedpassword123!"
    assert user.is_active is True
    assert user.is_superuser is False
    assert isinstance(user, UserModel)

def test_get_user(db, user_repo: SqlAlchemyUserRepository):
    user = user_repo.create(
        db=db,
        email="gettest@1234",
        full_name="Get Test User",
        hashed_password="hashedpassword123!"
    )
    db.commit()
    fetched_user = user_repo.get(db=db, user_id=user.id)
    assert fetched_user is not None
    assert fetched_user.id == user.id
    assert fetched_user.email == "gettest@1234"

def test_get_invalid_user(db, user_repo: SqlAlchemyUserRepository):
    fetched_user = user_repo.get(db=db, user_id="non-existent-id")
    assert fetched_user is None
