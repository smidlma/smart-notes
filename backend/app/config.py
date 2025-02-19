import os

CLIENT_ID = os.getenv("CLIENT_ID")
SECRET_KEY = os.getenv("SECRET_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ASSEMBLY_AI_API_KEY = os.getenv("ASSEMBLY_AI_API_KEY")
OPENAI_API_KEY = os.getenv("OPEN_AI_API_KEY")
VOICE_STORAGE_PATH = f"{os.environ['VIRTUAL_ENV']}/../storage/voice"
IMAGE_STORAGE_PATH = f"{os.environ['VIRTUAL_ENV']}/../storage/image"
