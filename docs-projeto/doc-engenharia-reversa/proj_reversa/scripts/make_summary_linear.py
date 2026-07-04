import re
from pathlib import Path
src = Path(r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble - cadastros.annotado.json")
dst = Path(r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble_pages_summary.md")
text = src.read_text(encoding='utf-8')
idx = text.find('"pages"')
if idx < 0:
    raise SystemExit('pages not found')
idx = text.find('{', idx)
if idx < 0:
    raise SystemExit('pages block open brace not found')

def find_matching_brace(s, start):
    depth = 0
    i = start
    in_str = False
    esc = False
    while i < len(s):
        c = s[i]
        if esc:
            esc = False
        elif c == '\\':
            esc = True
        elif c == '"':
            in_str = not in_str
        elif not in_str:
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    return -1

end = find_matching_brace(text, idx)
if end < 0:
    raise SystemExit('pages block end not found')
pages = text[idx:end+1]

results = []

i = 0
in_str = False
esc = False
while i < len(pages):
    c = pages[i]
    if esc:
        esc = False
        i += 1
        continue
    if c == '\\':
        esc = True
        i += 1
        continue
    if c == '"':
        in_str = not in_str
        if in_str:
            start_key = i + 1
        else:
            key = pages[start_key:i]
            j = i + 1
            while j < len(pages) and pages[j].isspace():
                j += 1
            if j < len(pages) and pages[j] == ':':
                j += 1
                while j < len(pages) and pages[j].isspace():
                    j += 1
                if j < len(pages) and pages[j] == '{':
                    # depth at this position should be 1 for page entries
                    # compute depth by scanning from start of pages to j
                    depth = 0
                    k = 0
                    in_str2 = False
                    esc2 = False
                    while k < j:
                        ch = pages[k]
                        if esc2:
                            esc2 = False
                        elif ch == '\\':
                            esc2 = True
                        elif ch == '"':
                            in_str2 = not in_str2
                        elif not in_str2:
                            if ch == '{':
                                depth += 1
                            elif ch == '}':
                                depth -= 1
                        k += 1
                    if depth == 1:
                        block_start = j
                        block_end = find_matching_brace(pages, block_start)
                        if block_end >= 0:
                            page_block = pages[block_start:block_end+1]
                            has_elements = '"elements"' in page_block
                            has_workflows = '"workflows"' in page_block
                            has_properties = '"properties"' in page_block
                            api_types = set()
                            if has_workflows:
                                wf_idx = page_block.find('"workflows"')
                                if wf_idx >= 0:
                                    wf_open = page_block.find('{', wf_idx)
                                    if wf_open >= 0:
                                        wf_end = find_matching_brace(page_block, wf_open)
                                        if wf_end >= 0:
                                            wf_text = page_block[wf_open:wf_end+1]
                                            api_types.update(re.findall(r'"type"\s*:\s*"([^\"]+)"', wf_text))
                            results.append((key, has_elements, has_workflows, has_properties, sorted(api_types)))
                            i = block_end
        i += 1
        continue
    i += 1

with dst.open('w', encoding='utf-8') as f:
    f.write('# Sumário por página — Frontend / Backend / Fluxos / APIs\n\n')
    for key, he, hw, hp, apis in results:
        f.write(f'## Página `{key}`\n')
        f.write(f'- Frontend (elements): {"presente" if he else "ausente"}\n')
        f.write(f'- Backend / Fluxos (workflows): {"presente" if hw else "ausente"}\n')
        f.write(f'- Propriedades (properties): {"presente" if hp else "ausente"}\n')
        f.write(f'- APIs / Ações identificadas: {", ".join(apis) if apis else "nenhuma identificada"}\n\n')
print('WROTE', dst)
