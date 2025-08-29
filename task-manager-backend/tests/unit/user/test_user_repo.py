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