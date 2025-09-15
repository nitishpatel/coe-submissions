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
        self.postgres_url = f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        self.jwt_secret = os.getenv("JWT_SECRET")
        self.jwt_algorithm = "HS256"
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


config = Config.get_instance()