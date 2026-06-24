import re
src=r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble - cadastros.bubble"
dst=r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble - cadastros.grouped.bubble"

s=open(src,'r',encoding='utf-8').read()

# find pages block
m_pages=re.search(r'"pages"\s*:\s*\{',s)
if not m_pages:
    print('pages not found')
    raise SystemExit(1)
start_pages=m_pages.start()
# find where pages block ends by brace matching
def find_block_end(text, start):
    i=start
    depth=0
    in_str=False
    esc=False
    while i<len(text):
        c=text[i]
        if esc:
            esc=False
            i+=1
            continue
        if c=='\\':
            esc=True
            i+=1
            continue
        if c=='"':
            in_str=not in_str
            i+=1
            continue
        if in_str:
            i+=1
            continue
        if c=='{':
            depth+=1
        elif c=='}':
            depth-=1
            if depth==0:
                return i
        i+=1
    return -1

# locate pages block start index (the brace after "pages": )
pages_brace_index=s.find('{', m_pages.end()-1)
pages_end=find_block_end(s, pages_brace_index)
if pages_end==-1:
    print('pages end not found')
    raise SystemExit(1)

pages_block=s[pages_brace_index:pages_end+1]
# iterate over page keys at top level of pages_block
out_parts=[]
pos=0
# regex to find top-level page keys: "KEY": {  (but ensure not nested too deep by scanning sequentially)
pattern=re.compile(r'("[A-Za-z0-9_\-]+"\s*:\s*\{)')
for m in pattern.finditer(pages_block):
    # ensure this is a top-level key: count braces before m.start() within pages_block
    prefix=pages_block[:m.start()]
    # count braces outside strings
    depth=0
    in_str=False
    esc=False
    for ch in prefix:
        if esc:
            esc=False
            continue
        if ch=='\\':
            esc=True
            continue
        if ch=='"':
            in_str=not in_str
            continue
        if in_str:
            continue
        if ch=='{':
            depth+=1
        elif ch=='}':
            depth-=1
    # top-level inside pages_block means depth==1 (because pages initial brace counts as 1)
    if depth!=1:
        continue
    # determine page key and insert comment
    key = re.match(r'"([A-Za-z0-9_\-]+)"', m.group(1)).group(1)
    # find block end for this page within pages_block starting from m.start()+offset
    abs_start = pages_brace_index + m.start() + m.group(1).rfind('{')
    abs_end = find_block_end(s, abs_start)
    if abs_end==-1:
        continue
    page_block = s[abs_start:abs_end+1]
    has_elements = '"elements"' in page_block
    has_workflows = '"workflows"' in page_block
    has_properties = '"properties"' in page_block
    # extract workflow action types
    api_types=set()
    if has_workflows:
        wf_idx = page_block.find('"workflows"')
        # find the brace for workflows
        wf_brace = page_block.find('{', wf_idx)
        if wf_brace!=-1:
            # find end of workflows block within page_block by local matching
            # compute local end
            local_end = find_block_end(page_block, wf_brace)
            if local_end!=-1:
                wf_block = page_block[wf_brace:local_end+1]
                # find all "type": "X" occurrences
                for t in re.findall(r'"type"\s*:\s*"([^"]+)"', wf_block):
                    api_types.add(t)
    api_list = ', '.join(sorted(api_types)) if api_types else 'nenhuma identificada'
    comment = f"// **PÁGINA: {key} — AGRUPAMENTO**\n"
    comment += f"// - Frontend: elements — {'presente' if has_elements else 'ausente'}\n"
    comment += f"// - Backend/Fluxos: workflows — {'presente' if has_workflows else 'ausente'}\n"
    comment += f"// - APIs/Ações usadas: {api_list}\n"
    comment += f"// - Propriedades: properties — {'presente' if has_properties else 'ausente'}\n"
    # insert comment into pages_block before this key occurrence
    insert_at = m.start()
    # accumulate parts
    out_parts.append( (insert_at, comment) )

# apply insertions in reverse order to not disrupt indices
new_pages = pages_block
for insert_at, comment in sorted(out_parts, key=lambda x: x[0], reverse=True):
    new_pages = new_pages[:insert_at] + comment + new_pages[insert_at:]

# reconstruct full file
new_content = s[:pages_brace_index] + new_pages + s[pages_end+1:]
with open(dst,'w',encoding='utf-8') as f:
    f.write(new_content)
print('Grouped file written:', dst)
