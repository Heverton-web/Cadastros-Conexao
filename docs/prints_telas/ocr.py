import pytesseract
from PIL import Image
import os, sys

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
os.environ['TESSDATA_PREFIX'] = r'C:\Program Files\Tesseract-OCR\tessdata'

base = os.path.dirname(os.path.abspath(__file__))

prints = [
    'tela_login.png',
    'tela_ambiente_cadastro_dashboard.png',
    'tela_cadastros_01.png',
    'tela_cadastros_02.png',
    'tela_ambiente_caddastro_relatorios.png',
    'tela_ambiente_consultor_dashboard.png',
    'tela_consultor_01.png',
    'tela_ambiente_credenciais.png',
    'tela_api_consultas_cro_cnpj.png',
]

for p in prints:
    fp = os.path.join(base, p)
    if not os.path.exists(fp):
        print(f'SKIP: {p} not found')
        continue
    print(f'=== {p} ===')
    img = Image.open(fp)
    text = pytesseract.image_to_string(img, lang='por')
    print(text[:2000])
    print()
