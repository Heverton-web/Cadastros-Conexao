import re,sys
src=r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble - cadastros.annotado.json"
dst=r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble_pages_summary.md"
text=open(src,'r',encoding='utf-8').read()
# find pages block
m=re.search(r'"pages"\s*:\s*\{',text)
if not m:
    print('pages not found'); sys.exit(1)
start=text.find('{',m.end()-1)
# brace matching
def find_end(t,st):
    i=st; depth=0; in_str=False; esc=False
    while i<len(t):
        c=t[i]
        if esc:
            esc=False; i+=1; continue
        if c=='\\': esc=True; i+=1; continue
        if c=='"': in_str=not in_str; i+=1; continue
        if in_str: i+=1; continue
        if c=='{': depth+=1
        elif c=='}':
            depth-=1
            if depth==0: return i
        i+=1
    return -1
end=find_end(text,start)
pages_block=text[start:end+1]
# find top-level page keys
pattern=re.compile(r'("[A-Za-z0-9_\-]+"\s*:\s*\{)')
results=[]
for m in pattern.finditer(pages_block):
    # compute depth
    prefix=pages_block[:m.start()]
    depth=0; in_str=False; esc=False
    for ch in prefix:
        if esc: esc=False; continue
        if ch=='\\': esc=True; continue
        if ch=='"': in_str=not in_str; continue
        if in_str: continue
        if ch=='{': depth+=1
        elif ch=='}': depth-=1
    if depth!=1: continue
    key=re.match(r'"([A-Za-z0-9_\-]+)"',m.group(1)).group(1)
    abs_start = start + m.start() + m.group(1).rfind('{')
    abs_end = find_end(text, abs_start)
    if abs_end==-1: continue
    page_block = text[abs_start:abs_end+1]
    has_elements='"elements"' in page_block
    has_workflows='"workflows"' in page_block
    has_properties='"properties"' in page_block
    api_types=set()
    if has_workflows:
        wf_idx = page_block.find('"workflows"')
        wf_brace = page_block.find('{', wf_idx)
        if wf_brace!=-1:
            local_end = find_end(page_block, wf_brace)
            if local_end!=-1:
                wf_block = page_block[wf_brace:local_end+1]
                for t in re.findall(r'"type"\s*:\s*"([^"]+)"', wf_block):
                    api_types.add(t)
    results.append((key,has_elements,has_workflows,has_properties,sorted(api_types)))
# write markdown
with open(dst,'w',encoding='utf-8') as f:
    f.write('# Sumário por página — Frontend / Backend / Fluxos / APIs\n\n')
    for key,he,hw,hp,apis in results:
        f.write(f'## Página `{key}`\n')
        f.write(f'- Frontend (elements): {"presente" if he else "ausente"}\n')
        f.write(f'- Backend / Fluxos (workflows): {"presente" if hw else "ausente"}\n')
        f.write(f'- Propriedades (properties): {"presente" if hp else "ausente"}\n')
        f.write(f'- APIs / Ações identificadas: {", ".join(apis) if apis else "nenhuma identificada"}\n\n')
print('WROTE',dst)
