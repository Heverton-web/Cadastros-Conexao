import json
from pathlib import Path

src = Path(r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble - cadastros.annotado.json")
dst_dir = Path(r"c:\Users\trcnologia\Desktop\01 Exercicios\data_types_md")
dst_dir.mkdir(exist_ok=True)
text = src.read_text(encoding='utf-8')
idx = text.find('"user_types"')
if idx == -1:
    raise SystemExit('user_types block not found')
start = text.find('{', idx)
if start == -1:
    raise SystemExit('opening brace for user_types not found')

# bracket matching
in_str = False
esc = False
depth = 0
end = -1
for i, c in enumerate(text[start:], start):
    if esc:
        esc = False
        continue
    if c == '\\':
        esc = True
        continue
    if c == '"':
        in_str = not in_str
        continue
    if in_str:
        continue
    if c == '{':
        depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0:
            end = i
            break
if end == -1:
    raise SystemExit('matching closing brace for user_types not found')
block = text[start:end+1]

# parse JSON block
user_types = json.loads(block)

# map Bubble value types to readable types
TYPE_MAP = {
    'text': 'Text',
    'date': 'Date',
    'file': 'File',
    'boolean': 'Boolean',
    'number': 'Number',
    'image': 'Image',
    'geographic_address': 'Geographic Address',
    'color': 'Color',
    'phone_number': 'Phone Number',
    'email': 'Email',
    'url': 'URL',
    'yes/no': 'Yes/No',
}

def format_type(value):
    if isinstance(value, str):
        if value.startswith('list.'):
            inner = value[5:]
            if inner.startswith('custom.'):
                return f'List of {inner[7:]}'
            if inner.startswith('api.'):
                return f'List of API result {inner[4:]}'
            return f'List of {inner}'
        if value.startswith('custom.'):
            return f'Custom {value[7:]}'
        if value.startswith('option.'):
            return f'Option {value[7:]}'
        if value.startswith('api.'):
            return f'API result {value[4:]}'
        if value in TYPE_MAP:
            return TYPE_MAP[value]
        return value.capitalize()
    return str(value)

index_lines = ['# Data Types Index', '']
for data_type, dtobj in user_types.items():
    display_name = dtobj.get('display', data_type)
    filename = f'{data_type.replace(" ", "_").replace("/", "_")}.md'
    filepath = dst_dir / filename
    index_lines.append(f'- [{display_name}]({filename})')
    lines = [f'# {display_name}', '', f'**Data Type**: `{data_type}`', '', '## Campos', '']
    fields = dtobj.get('fields', {})
    if not fields:
        lines.append('_Sem campos definidos._')
    else:
        for field_name, field_info in fields.items():
            display = field_info.get('display', field_name)
            value_type = field_info.get('value', field_info.get('type', 'unknown'))
            required = field_info.get('required', None)
            deleted = field_info.get('deleted', False)
            obrigatorio = 'Sim' if required is True else 'Não'
            field_type = format_type(value_type)
            note = ''
            if deleted:
                note = ' (deleted)'
            lines.append(f'- **Nome do campo:** {display}{note}')
            lines.append(f'  - **Tipo de dado:** {field_type}')
            lines.append(f'  - **Obrigatório:** {obrigatorio}')
    filepath.write_text('\n'.join(lines), encoding='utf-8')

# write index
(Path(dst_dir) / 'README.md').write_text('\n'.join(index_lines), encoding='utf-8')
print('WROTE', len(user_types), 'data type files in', dst_dir)
