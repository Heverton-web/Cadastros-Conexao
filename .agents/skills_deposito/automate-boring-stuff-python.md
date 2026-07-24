---
name: automate-boring-stuff-python
description: >- Passos de automacao com Python — regex, scraping, Excel, PDF, email, GUI e OCR
---

# Automate the Boring Stuff with Python — Passos Operacionais

## 9. Text Pattern Matching with Regular Expressions

### 9.1 Creating and Using Regex
1. `import re` then `re.compile(r'pattern')` → Pattern object
2. Pattern.search('text') → Match object (or None)
3. Match.group() → matched string; group(1), group(2) → captured groups
4. Use raw strings `r'...'` to avoid escape-character issues

### 9.2 Character Classes and Quantifiers
1. `\d` digit, `\w` word char, `\s` whitespace; uppercase = negation (`\D` = non-digit)
2. `+` one or more, `*` zero or more, `?` zero or one, `{n,m}` range
3. `.*` greedy match, `.*?` non-greedy (lazy) match
4. `[aeiou]` custom character class; `[^...]` negative class

### 9.3 Advanced Matching
1. `re.IGNORECASE` flag → case-insensitive; `re.DOTALL` → `.` matches newlines
2. `re.VERBOSE` → multi-line regex with comments and whitespace
3. Combine flags with `|`: `re.compile(r'...', re.IGNORECASE | re.DOTALL | re.VERBOSE)`
4. `re.findall('pattern', 'text')` → list of strings or list of tuples (if groups present)
5. `re.sub(r'pattern', r'replacement', 'text')` → substituted string
6. `^` start anchor, `$` end anchor

### 9.4 Project: Extract Contacts from Documents
1. Create regex for phone numbers: `r'(\d{3})-(\d{3}-\d{4})'`
2. Create regex for email addresses: `r'[\w.]+@[\w.]+'`
3. Use `pyperclip.paste()` to get clipboard text
4. `re.findall()` + format results → `pyperclip.copy(result_string)`

## 10. Reading and Writing Files

### 10.1 File Paths
1. `from pathlib import Path`; `Path('folder/sub/file.txt')`
2. `Path.cwd()` → current working dir; `Path.home()` → home dir
3. Join paths with `/` operator: `Path('folder') / 'sub' / 'file.txt'`
4. `p.exists()`, `p.is_file()`, `p.is_dir()`, `p.stat().st_size`, `p.stat().st_mtime`

### 10.2 Reading/Writing Files
1. `open('file.txt', 'r')` → file object; use `with open(...) as f:` for auto-close
2. `f.read()` → whole string; `f.readlines()` → list of lines
3. `open('file.txt', 'w')` → write (overwrites); `'a'` → append
4. `f.write('text')` → writes string; `f.writelines(list_of_strings)`

### 10.3 Glob Pattern Matching
1. `list(Path('.').glob('*.txt'))` — match current dir
2. `list(Path('.').rglob('**/*.py'))` — recursive

### 10.4 Shelf (Persistent Storage)
1. `import shelve`; `shelf = shelve.open('data')` → dict-like object
2. `shelf['key'] = value`; `shelf.close()`
3. Keys must be strings; values must be pickle-able

## 11. Organizing Files

### 11.1 shutil Module
1. `shutil.copy(src, dst)` → copy file; `shutil.copytree(src, dst)` → copy folder tree
2. `shutil.move(src, dst)` → move/rename
3. `os.unlink(path)` → delete file; `os.rmdir(path)` → delete empty folder
4. `shutil.rmtree(path)` → delete folder + all contents (permanent!)
5. `send2trash.send2trash(path)` → move to recycle bin (safer)

### 11.2 Walking Directory Trees
1. `for dirpath, dirnames, filenames in os.walk(folder):` → recursive traversal
2. Process `filenames` list at each level

### 11.3 ZIP Files
1. `import zipfile`; `z = zipfile.ZipFile('file.zip')`
2. `z.namelist()` → list members; `z.read(name)` → bytes; `z.extract(name)` → extract one
3. `z.extractall(folder)` → extract all
4. Create: `z = zipfile.ZipFile('out.zip', 'w')`; `z.write(path, arcname)`; `z.close()`

### 11.4 Project: Back Up Folder to ZIP
1. Determine ZIP filename with incrementing number suffix
2. Create ZipFile in write mode
3. `os.walk()` source folder, `z.write()` each file with arcname preserving relative path

## 12. Designing and Deploying CLI Programs

### 12.1 Command Line Arguments
1. `sys.argv` — list of args; `sys.argv[0]` = script name, `sys.argv[1:]` = user args
2. Add `Scripts` folder to PATH for quick access (Windows: edit env vars; macOS/Linux: `~/.bashrc`)

### 12.2 Virtual Environments
1. `python -m venv .venv` → create; activate: `.venv\Scripts\activate` (Win) or `source .venv/bin/activate` (macOS/Linux)
2. `pip install package` inside venv; deactivate with `deactivate`

### 12.3 Deploying as Executable
1. `pip install pyinstaller`; `python -m PyInstaller --onefile script.py`
2. Executable in `dist/` folder; share without Python installation

### 12.4 Text-Based Program Design
1. Keep command names short (e.g., `ccwd`, `cliprec`)
2. Use clipboard I/O (`pyperclip`) for data transfer
3. `bext` for colored terminal output; `pymsgbox` for GUI popups

## 13. Web Scraping

### 13.1 webbrowser Module
1. `import webbrowser`; `webbrowser.open('url')` — opens browser tab

### 13.2 requests Module
1. `requests.get('url')` → Response object; `res.raise_for_status()` → error check
2. `res.text` → HTML string; `res.content` → bytes (for binary)
3. Save: `with open('file', 'wb') as f: f.write(res.content)`

### 13.3 Parsing HTML with Beautiful Soup
1. `from bs4 import BeautifulSoup`; `soup = BeautifulSoup(html, 'html.parser')`
2. `soup.select('css-selector')` → list of Tag objects
3. `tag.get('attr')` → attribute value; `tag.text` → text content

### 13.4 Selenium / Playwright for Browser Automation
1. Selenium: `webdriver.Firefox()`; `.find_element(By.CSS_SELECTOR, 'sel')`; `.click()`; `.send_keys('text')`
2. Playwright: `sync_playwright().chromium.launch()`; `page.locator('sel')`; `.click()`; `.fill('text')`

### 13.5 Project: Download XKCD Comics
1. `requests.get(url)` → HTML → find comic image with Beautiful Soup
2. Download image `res.content` → save with `wb`
3. Find "Prev" link → loop until first comic

## 14. Excel Spreadsheets (openpyxl)

### 14.1 Reading
1. `wb = openpyxl.load_workbook('file.xlsx')`; `wb.sheetnames` → list
2. `sheet = wb['Sheet1']`; `sheet['A1'].value` → cell; `sheet.cell(row=1, column=2).value`
3. `sheet.max_row`, `sheet.max_column` → dimensions
4. Iterate: `for row in sheet['A1':'C10']: for cell in row: cell.value`

### 14.2 Writing
1. `wb = openpyxl.Workbook()`; `wb.save('file.xlsx')`
2. `sheet['A1'] = 'value'`; `wb.create_sheet('name')`, `wb.remove(sheet)`
3. Style: `from openpyxl.styles import Font`; `cell.font = Font(bold=True, size=14)`
4. Formulas: `sheet['B9'] = '=SUM(B1:B8)'`

### 14.3 Charts
1. `from openpyxl.chart import BarChart, Reference`
2. `chart = BarChart()`; `data = Reference(sheet, min_col=2, min_row=1, max_row=7)`
3. `sheet.add_chart(chart, 'E2')`

## 15. Google Sheets (EZSheets)

### 15.1 Setup
1. Create Google Cloud project → enable Sheets + Drive APIs → configure OAuth → download credentials
2. `import ezsheets`; `ezsheets.init()` — handles OAuth flow

### 15.2 Spreadsheet Operations
1. `ss = ezsheets.createSpreadsheet('title')` — create; `ezsheets.upload('file.xlsx')` — upload
2. `ss.title`, `ss.sheetTitles`, `ss[0]` — access sheets
3. `sheet.updateRow(1, ['a','b','c'])`; `sheet.getRow(1)`; `sheet.refresh()` — sync

### 15.3 Download/Upload
1. `ss.downloadAsExcel()` → saves .xlsx; `ss.downloadAsCSV()` → saves .csv
2. `ezsheets.upload('local.xlsx', sheet='Sheet1')` → uploads to cloud

## 16. SQLite Databases

### 16.1 Setup and CRUD
1. `import sqlite3`; `conn = sqlite3.connect('file.db')`; `c = conn.cursor()`
2. `c.execute('''CREATE TABLE t (id INT, name TEXT)''')`
3. Insert: `c.execute('INSERT INTO t VALUES (?, ?)', (1, 'alice'))` — use `?` placeholders!
4. Read: `c.execute('SELECT * FROM t')`; `c.fetchall()` → list of tuples
5. Update: `c.execute('UPDATE t SET name=? WHERE id=?', ('bob', 1))`
6. Delete: `c.execute('DELETE FROM t WHERE id=?', (1,))`
7. Always `conn.commit()` after writes

### 16.2 Advanced
1. `conn.rollback()` — undo uncommitted changes
2. Foreign keys: define `FOREIGN KEY(col) REFERENCES other(pk)` on table creation
3. Backup: `sqlite3.connect(':memory:')` → in-memory DB; `conn.backup(target)` to persist

## 17. PDF and Word Documents

### 17.1 PDF (PyMuPDF / PyPDF)
1. `import pypdf`; `reader = pypdf.PdfReader('file.pdf')`; `len(reader.pages)`
2. `page = reader.pages[0]`; `page.extract_text()` → text
3. Merge: `writer = pypdf.PdfWriter()`; `writer.add_page(reader.pages[i])`; `writer.write('out.pdf')`

### 17.2 Word Documents (python-docx)
1. `import docx`; `doc = docx.Document('file.docx')`
2. Read text: `'\n'.join([p.text for p in doc.paragraphs])`
3. Write: `doc = docx.Document()`; `doc.add_paragraph('text')`; `doc.save('out.docx')`
4. Style: `paragraph.style = 'Heading 1'`; `run.bold = True`; `run.font.size = Pt(14)`
5. Add image: `doc.add_picture('image.jpg', width=Inches(4))`

## 18. CSV, JSON, and XML Files

### 18.1 CSV
1. `import csv`; reader: `csv.reader(open('file.csv'))` → row list iterator
2. Writer: `csv.writer(open('out.csv', 'w', newline=''))`; `writer.writerow(list)`
3. DictReader: `csv.DictReader(f)` → dict per row using header as keys
4. DictWriter: `csv.DictWriter(f, fieldnames=[...])`; pass fieldnames, then `writer.writerow(dict)`

### 18.2 JSON
1. `import json`; `json.loads(string)` → dict/list; `json.dumps(obj)` → string
2. File: `json.load(f)` (from open file); `json.dump(obj, f)`

### 18.3 XML
1. `import xml.etree.ElementTree as ET`; `root = ET.parse('file.xml').getroot()`
2. Navigate: `root.find('tag')`, `root.findall('tag')`, `elem.text`, `elem.attrib`

## 19. Keeping Time, Scheduling Tasks, and Launching Programs

### 19.1 time Module
1. `time.time()` → epoch timestamp (float); `time.sleep(secs)` → pause

### 19.2 datetime Module
1. `datetime.datetime.now()`; `datetime.timedelta(days=...)` → duration arithmetic
2. `dt.strftime('%Y-%m-%d')` → format; `datetime.datetime.strptime('2025-01-01', '%Y-%m-%d')` → parse

### 19.3 Launching Programs
1. `import subprocess`; `subprocess.Popen(['program.exe', 'arg1'])` → launch external
2. `subprocess.run(['program', 'arg'], capture_output=True, text=True)` → get output
3. `os.startfile('file')` (Win) — open with default app

### 19.4 Scheduled Tasks
1. Windows: Task Scheduler; macOS: `launchd`; Linux: `cron`
2. Each can run a Python script at specified intervals

## 20. Sending Email, Texts, and Push Notifications

### 20.1 Gmail API via EZGmail
1. `import ezgmail`; `ezgmail.init()` — OAuth setup
2. Send: `ezgmail.send('to@ex.com', 'Subject', 'Body', cc='...')`
3. Read: `ezgmail.unread(maxResults=50)` → list of GmailThread; `thread.messages[i].body`
4. Search: `ezgmail.search('query')` → threads
5. Download attachments: `msg.downloadAttachment('file.pdf')`; `msg.downloadAllAttachments()`

### 20.2 SMS via Email Gateways
1. Send email to `number@gateway` (e.g., `2125551234@vtext.com` for Verizon)
2. Use EZGmail or smtplib; 160-char limit for SMS

### 20.3 Push Notifications (ntfy)
1. `requests.post('https://ntfy.sh/YOUR_TOPIC', 'message')` → push to phone
2. Install ntfy app; subscribe to same topic

## 21. Making Graphs and Manipulating Images

### 21.1 Pillow Image Manipulation
1. `from PIL import Image`; `img = Image.open('file.jpg')`
2. `img.crop((left, top, right, bottom))` → cropped Image
3. `img.paste(other_img, (x, y))` → paste; `img.resize((w, h))` → resize
4. `img.rotate(degrees)`, `img.transpose(Image.FLIP_LEFT_RIGHT)`
5. `img.putpixel((x, y), (r,g,b))` → set individual pixel; `img.getpixel((x,y))` → get

### 21.2 Drawing on Images
1. `from PIL import ImageDraw`; `draw = ImageDraw.Draw(img)`
2. `draw.rectangle((x1,y1,x2,y2), fill='red')`; `draw.text((x,y), 'text', fill='black')`

### 21.3 Matplotlib Graphs
1. `import matplotlib.pyplot as plt`
2. `plt.plot(x_values, y_values)` → line; `plt.scatter(x, y)` → scatter
3. `plt.bar(x, heights)` → bar; `plt.pie(sizes, labels=...)` → pie
4. `plt.xlabel()`, `plt.ylabel()`, `plt.title()`; `plt.show()` or `plt.savefig('file.png')`

## 22. Recognizing Text in Images (OCR)

### 22.1 Tesseract + PyTesseract
1. Install Tesseract engine (system); `pip install pytesseract`
2. `import pytesseract`; `pytesseract.image_to_string(Image.open('file.png'))` → extracted text
3. Preprocess: convert to grayscale, threshold, denoise for better accuracy
4. Language: `lang='eng'` or `lang='por'`; `--psm 6` for uniform block

### 22.2 LLM Post-Processing
1. After OCR, pass extracted text to an LLM to fix misreads
2. Useful for documents with unusual fonts or layouts

## 23. Controlling the Keyboard and Mouse (GUI Automation)

### 23.1 PyAutoGUI
1. `import pyautogui`; `pyautogui.PAUSE = 0.5` — set safety pause
2. Mouse: `pyautogui.moveTo(x, y)`; `pyautogui.click()`; `pyautogui.dragTo(x, y)`; `pyautogui.scroll(-3)`
3. Screen: `pyautogui.size()` → (width, height); `pyautogui.position()` → current (x,y)
4. Keyboard: `pyautogui.write('text')`; `pyautogui.press('enter')`; `pyautogui.hotkey('ctrl', 'c')`
5. Screenshot: `pyautogui.screenshot('file.png')`; `pyautogui.locateOnScreen('button.png')` → image recognition

### 23.2 Safety
1. Set `pyautogui.FAILSAFE = True` (default) — move mouse to corner to abort
2. Always add pauses; test with print() before real execution

### 23.3 Window Management
1. `pyautogui.getActiveWindow()` → active window info
2. `pyautogui.getWindowsWithTitle('title')` → list of Window objects
3. `win.activate()`, `win.maximize()`, `win.close()` — manipulate windows

## 24. Text-to-Speech and Speech Recognition

### 24.1 pyttsx3 (TTS)
1. `import pyttsx3`; `engine = pyttsx3.init()`; `engine.say('text')`; `engine.runAndWait()`
2. Save: `engine.save_to_file('text', 'output.wav')`; `engine.runAndWait()`

### 24.2 Speech Recognition
1. `import speech_recognition as sr`; `r = sr.Recognizer()`
2. `with sr.Microphone() as source: audio = r.listen(source)`
3. `r.recognize_whisper(audio)` or `r.recognize_google(audio)` → transcribed text

### 24.3 Subtitle Files
1. Generate SRT format: sequence of `index\nHH:MM:SS,mmm --> HH:MM:SS,mmm\ntext\n\n`
2. Use speech-to-text timestamps to create subtitle entries

### 24.4 Downloading Videos (yt-dlp)
1. `pip install yt-dlp`; `yt_dlp.download(['url'])` — downloads video
2. Extract audio: `yt_dlp.download(['url'], {'format': 'bestaudio'})`
