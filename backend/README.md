# Smart Notes Backend

This is the backend service for the Smart Notes application.

## Logging Configuration

The application uses a structured logging system with the following features:

### Log Format

Logs are formatted as:
```
YYYY-MM-DD HH:MM:SS - module_name - LEVEL - [filename:line_number] - Message
```

### Log Levels

The application supports the following log levels (in order of severity):
- **CRITICAL**: For very serious errors that may cause the application to abort
- **ERROR**: For errors that don't cause the application to abort but need attention
- **WARNING**: For potentially harmful situations
- **INFO**: For general information about application progress (default level)
- **DEBUG**: For detailed information useful for debugging

### Log Destinations

Logs are sent to:
1. **Console**: All logs are printed to stdout
2. **File**: Logs are saved to `logs/app.log` with rotation (10MB max size, keeping 5 backup files)

### Configuration

Log level can be configured via the `LOG_LEVEL` environment variable. Default is "INFO".

### Usage in Code

To use logging in your code:

```python
from app.utils import get_logger

# Get a module-specific logger
logger = get_logger(__name__)

# Use different log levels as needed
logger.debug("Detailed debug information")
logger.info("General information")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical error")
```

## Environment Variables

- `CLIENT_ID`: Google OAuth client ID
- `SECRET_KEY`: Secret key for JWT token generation
- `GOOGLE_API_KEY`: Google API key for various Google services
- `ASSEMBLY_AI_API_KEY`: AssemblyAI API key for speech recognition
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `LOG_LEVEL`: Logging level (default: INFO) 