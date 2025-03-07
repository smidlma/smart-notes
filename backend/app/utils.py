import asyncio
import functools
import inspect
import logging
import re
from typing import Any, Callable, Dict, Hashable, List, Optional, Tuple, Union

import aiofiles
from fastapi import HTTPException, UploadFile


def debounced(delay: float, key_args: List[str]):
    """
    Debounces a coroutine. The coroutine will only run after `delay` seconds
    have passed since the last invocation, if invoked with the same arguments.

    Args:
        delay: The debounce delay in seconds.
        key_args: A list of argument names to use for building the
                  debounce key. If None, all arguments are used.
    """

    def decorator(func: Callable):
        tasks: Dict[Union[Tuple, Hashable], asyncio.Task] = {}

        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any):
            nonlocal tasks

            # Get the names of the function parameters
            func_params = list(inspect.signature(func).parameters.keys())

            # Build a dictionary of argument values, handling positional arguments
            arg_values = {func_params[i]: args[i] for i in range(len(args))}
            arg_values.update(kwargs)

            # Select the arguments to use for the key based on key_args
            if key_args:
                selected_args = {k: arg_values[k] for k in key_args if k in arg_values}
            else:
                selected_args = arg_values

            call_args = functools._make_key(
                tuple(selected_args.values()), {}, typed=False
            )

            # ... (rest of the debouncing logic remains the same)
            if call_args in tasks:
                tasks[call_args].cancel()
                try:
                    await tasks[call_args]
                except asyncio.CancelledError:
                    pass

            async def delayed_task():
                await asyncio.sleep(delay)
                await func(*args, **kwargs)
                if call_args in tasks:
                    del tasks[call_args]

            tasks[call_args] = asyncio.create_task(delayed_task())

        return wrapper

    return decorator


def parse_title(text: str) -> str:
    pattern = r"<h1>(.*?)</h1>"
    match = re.search(pattern, text)

    title = match.group(1) if match else ""

    return remove_html_tags(title) or "New note"


def parse_description(text: str) -> str:
    # Find end of h1 tag
    h1_pattern = r"</h1>"
    h1_match = re.search(h1_pattern, text)
    if not h1_match:
        return ""

    # Get all text after h1
    end_pos = h1_match.end()
    remaining_text = text[end_pos:]

    # Remove all HTML tags
    clean_text = remove_html_tags(remaining_text)

    # Normalize spaces - replace multiple spaces with single space
    normalized_text = re.sub(r"\s+", " ", clean_text)

    # Clean up whitespace and truncate
    return normalized_text.strip()[:30]


def remove_html_tags(text: str) -> str:
    return re.sub(r"<[^>]+>", " ", text)


def get_logger(name: Optional[str] = None) -> logging.Logger:
    """
    Get a logger with the specified name.

    Args:
        name: The name of the logger, typically __name__ from the calling module.
              If None, returns the root logger.

    Returns:
        A configured logger instance.
    """
    return logging.getLogger(name)


async def save_uploaded_file(
    file: UploadFile, storage_path: str, new_file_name: Optional[str] = None
) -> Tuple[str, str]:
    """
    Save an uploaded file to the specified storage path.

    Args:
        file: The uploaded file object
        storage_path: The directory path where the file should be saved

    Returns:
        The full path to the saved file

    Raises:
        HTTPException: If the file has no name
    """
    logger = get_logger(__name__)

    file_name = file.filename

    if not file_name or not new_file_name:
        logger.error("File upload failed: No filename provided")
        raise HTTPException(status_code=400, detail="File name is required")

    if not new_file_name:
        new_file_name = file_name

    out_file_path = f"{storage_path}/{new_file_name}"
    logger.debug(f"Saving uploaded file to: {out_file_path}")

    try:
        async with aiofiles.open(out_file_path, "wb") as out_file:
            while content := await file.read(1024):  # async read chunk
                await out_file.write(content)  # async write chunk

        logger.info(f"File successfully saved: {new_file_name}")
        return (new_file_name, out_file_path)
    except Exception as e:
        logger.error(f"Error saving file {file_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
