import re
src=r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble - cadastros.bubble"
dst=r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble - cadastros.annotado.bubble"

def braces_outside_strings(line):
    in_str=False
    escape=False
    opens=0
    closes=0
    for c in line:
        if escape:
            escape=False
            continue
        if c=='\\':
            escape=True
            continue
        if c=='"':
            in_str=not in_str
            continue
        if not in_str:
            if c=='{':
                opens+=1
            elif c=='}':
                closes+=1
    return opens, closes

with open(src,'r',encoding='utf-8') as f:
    lines=f.readlines()

out=[]
in_pages=False
pages_balance=0
for i,line in enumerate(lines):
    stripped=line.lstrip()
    # detect start of pages
    if '"pages"' in line and '{' in line:
        out.append('// **PÁGINAS**: Contém as páginas da aplicação (elements, workflows, properties)\n')
        in_pages=True
        o,c=braces_outside_strings(line)
        pages_balance += o - c
        out.append(line)
        continue
    # if in pages, update balance and detect page keys
    if in_pages:
        o,c=braces_outside_strings(line)
        # detect page object key lines like "AAW": {
        m=re.match(r"(\s*)\"([A-Za-z0-9_\-]+)\"\s*:\s*\{", line)
        if m:
            key=m.group(2)
            comment=f"{m.group(1)}// **PÁGINA**: chave '{key}' — seção com `elements`, `workflows` e `properties`\n"
            out.append(comment)
            out.append(line)
        else:
            out.append(line)
        pages_balance += o - c
        if pages_balance<=0:
            in_pages=False
        continue
    # global inserts for workflows, elements, properties
    if re.match(r"\s*\"workflows\"\s*:\s*\{", line):
        out.append('// **WORKFLOWS**: Fluxos de backend/ações associadas a eventos\n')
        out.append(line)
        continue
    if re.match(r"\s*\"elements\"\s*:\s*\{", line):
        out.append('// **ELEMENTOS**: Componentes de UI (Group, Text, Input, Button, Image, etc.)\n')
        out.append(line)
        continue
    if re.match(r"\s*\"properties\"\s*:\s*\{", line):
        out.append('// **PROPRIEDADES**: Configurações/metadados desta seção (tamanhos, título, opções)\n')
        out.append(line)
        continue
    out.append(line)

with open(dst,'w',encoding='utf-8') as f:
    f.writelines(out)

print('Annotated file written:', dst)
