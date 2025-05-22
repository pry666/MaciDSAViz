from executor_s import check_single_file
import asyncio
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import UnexpectedAlertPresentException, NoAlertPresentException
from selenium.common.exceptions import TimeoutException, WebDriverException
import os
import time
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.chrome.service import Service
import os
import tempfile

def error_code(code):
    service = Service("chromedriver/chromedriver-linux64/chromedriver")
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--allow-file-access-from-files")
    options.add_argument("--disable-infobars")
    options.add_argument("--disable-extensions")
    options.add_argument("--no-sandbox")
    template_path = "sel_sh/AlgorithmLibrary/template.js"
    template_path_html = "sel_sh/template.html"

    sel_error = []
    error_occurred = False
    with open(template_path, 'w', encoding='utf-8') as f:
        f.write(code)

    errors,has_error = asyncio.run(check_single_file(Path(template_path_html)))

    if(has_error):
        return errors

    driver = webdriver.Chrome(service=service, options=options)

    driver.set_page_load_timeout(5)

    try:
        filepath = os.path.abspath(template_path_html)
        driver.get("file://" + filepath)
    except Exception as e:
        print("Second")
        sel_error.append(str(e))
        error_occurred = True
        driver.quit()
        return sel_error
 
    try:
        alert = driver.switch_to.alert
        driver.quit()
        return sel_error
    except NoAlertPresentException:
        pass

    driver.execute_script("""
        window.myErrorLogs = [];
        const origConsoleError = console.error;
        console.error = function(...args) {
            window.myErrorLogs.push(args.join(' '));
            origConsoleError.apply(console, args);
        };
        window.onerror = function(message, source, lineno, colno, error) {
            window.myErrorLogs.push(message + " at " + source + ":" + lineno + ":" + colno);
        };
    """)
    time.sleep(1)
    try:
        text_inputs = driver.find_elements(By.XPATH, '//*[@id="AlgorithmSpecificControls"]//input[@type="Text"]')
        for j, text_input in enumerate(text_inputs):
            text_input.clear()
            text_input.send_keys("5")
        time.sleep(0.3)
    except:
        pass
    buttons = driver.find_elements(By.XPATH, '//*[@id="AlgorithmSpecificControls"]//input[@type="Button"]')
    if not buttons:
        sel_error.append("no buttons")
        error_occurred = True
        return sel_error
    else:
        initial_log_len = len(driver.execute_script("return window.myErrorLogs;"))
        for i, btn in enumerate(buttons):
            try:
                driver.execute_script("arguments[0].scrollIntoView(true);", btn)
                btn.click()
                time.sleep(0.5)
                new_errors = driver.execute_script("return window.myErrorLogs.slice(arguments[0]);", initial_log_len)
                if new_errors:
                   sel_error.append(str(new_errors[0]))
                   break
            except UnexpectedAlertPresentException:
                break
            except TimeoutException as e:
                sel_error.append(str(e))
                error_occurred = True
                break
            except Exception as e:
                sel_error.append(str(e))
                error_occurred = True
                break

    driver.quit()
    return sel_error