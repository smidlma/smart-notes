from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(dotenv_path="../.env")


class Settings:
    CLIENT_ID: str = os.getenv("CLIENT_ID")
    SECRET_KEY: str = os.getenv("SECRET_KEY")


settings = Settings()
