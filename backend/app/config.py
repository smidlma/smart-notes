import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path("../.env"))


CLIENT_ID = os.getenv("CLIENT_ID")
SECRET_KEY = os.getenv("SECRET_KEY")
