import pytesseract
from PIL import Image
import os

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
os.environ['TESSDATA_PREFIX'] = r'C:\Program Files\Tesseract-OCR\tessdata'

base = os.path.dirname(os.path.abspath(__file__))

prints = [
    'popup_aprovacao_cadastro.png',
    'popup_cadastro_existente.png',
    'popup_compartilhar_link.png',
    'popup_confirmacao_download.png',
    'popup_dados_cliente.png',
    'popup_dados_enviados.png',
    'popup_deletar_cadastro.png',
    'popup_descricao_correcao_reprovacao.png',
    'popup_gerar_link.png',
    'popup_revisar_dados.png',
    'popup_solicitacao_correcao.png',
    'popup_solicitar_credencial.png',
    'popup_token_expirado.png',
    'popup_token_invalido.png',
    'popup_token_reenviado.png',
    'popup_tutoriais.png',
    'popup_ver_documentos.png',
    'popup_verificacao_token.png',
    'popup_link_expirado.png',
    'tela_ambiente_pre_cadastro_escolha_tipo_cadastro.png',
    'tela_ambiente_pre_cadastro_formulario_multipassos_dados_docuemntos.png',
    'tela_ambiente_pre_cadastro_inserir_token.png',
    'tela_ambiente_pre_cadastro_verificacao_2factor.png',
]

for p in prints:
    fp = os.path.join(base, p)
    if not os.path.exists(fp):
        print(f'SKIP: {p} not found')
        continue
    print(f'=== {p} ===')
    img = Image.open(fp)
    text = pytesseract.image_to_string(img, lang='por')
    print(text[:3000])
    print()
