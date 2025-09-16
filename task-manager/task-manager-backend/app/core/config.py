from dotenv import load_dotenv
import os


class Config:
    _instance = None

    def __init__(self):
        load_dotenv()
        self.postgres_user = os.getenv("POSTGRES_USER")
        self.postgres_password = os.getenv("POSTGRES_PASSWORD")
        self.postgres_db = os.getenv("POSTGRES_DB")
        self.postgres_port = os.getenv("POSTGRES_PORT")
        self.postgres_host = os.getenv("POSTGRES_HOST")
        self.jwt_secret = os.getenv("JWT_SECRET")
        self.jwt_algorithm = "HS256"
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def get_database_url(self) -> str:
        # Only construct postgres URL if essential parts present
        if all([self.postgres_host, self.postgres_port, self.postgres_db, self.postgres_user]):
            user = self.postgres_user
            pw = f":{self.postgres_password}" if self.postgres_password else ""
            return f"postgresql://{user}{pw}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"

        return "sqlite:////tmp/test.db"
config = Config.get_instance()