import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
import os
import re
import tempfile

ignored_error_keywords = [
    "Failed to load resource: net::ERR_FILE_NOT_FOUND",
    "net::ERR_NAME_NOT_RESOLVED",
    "net::ERR_CONNECTION_REFUSED",
]

suspicious_keywords = ["empty"]

async def check_single_file(file_path):
    file_url = f"file://{file_path.resolve()}"
    has_error = False
    errors = []

    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            async def handle_console(msg):
                nonlocal has_error
                text = msg.text
                if msg.type == "error":
                    if not any(k in text for k in ignored_error_keywords):
                        has_error = True
                        errors.append(f"Console error: {text}")
                elif any(k in text.lower() for k in suspicious_keywords):
                    has_error = True
                    errors.append(f"Suspicious console output: {text}")

            async def handle_pageerror(error):
                nonlocal has_error
                has_error = True
                errors.append(f"Page error: {error.message}")

            page.on("console", handle_console)
            page.on("pageerror", handle_pageerror)

            try:
                await page.goto(file_url, wait_until="domcontentloaded", timeout=60000)
            except Exception as e:
                has_error = True
                print("First")
                errors.append(str(e))

            await page.wait_for_timeout(2000)
        finally:
            if browser:
                await browser.close()

    return errors,has_error