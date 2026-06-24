import sys
p=r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble - cadastros.bubble"
with open(p,'r',encoding='utf-8') as f:
    s=f.read()
out=[]
indent=0
in_str=False
escape=False
i=0
while i<len(s):
    c=s[i]
    if escape:
        out.append(c)
        escape=False
        i+=1
        continue
    if c=='\\':
        out.append(c)
        escape=True
        i+=1
        continue
    if c=='"':
        out.append(c)
        in_str=not in_str
        i+=1
        continue
    if in_str:
        out.append(c)
        i+=1
        continue
    if c in '{[':
        out.append(c)
        out.append('\n')
        indent+=1
        out.append('  '*indent)
        i+=1
        continue
    if c in '}]':
        out.append('\n')
        indent-=1
        out.append('  '*indent)
        out.append(c)
        i+=1
        continue
    if c==',':
        out.append(c)
        out.append('\n')
        out.append('  '*indent)
        i+=1
        continue
    if c==':':
        out.append(': ')
        i+=1
        continue
    if c.isspace():
        i+=1
        continue
    out.append(c)
    i+=1
res=''.join(out)
with open(p,'w',encoding='utf-8') as f:
    f.write(res)
print('Formatted')
