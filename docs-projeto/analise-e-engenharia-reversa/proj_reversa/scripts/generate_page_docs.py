import json
import re
from pathlib import Path

SRC = Path(r"c:\Users\trcnologia\Desktop\01 Exercicios\appBubble - cadastros.annotado.json")
DST_DIR = Path(r"c:\Users\trcnologia\Desktop\01 Exercicios\page_docs")


def strip_comments(src: str) -> str:
    out = []
    in_str = False
    esc = False
    i = 0
    while i < len(src):
        c = src[i]
        if c == "\\" and not esc:
            esc = True
            out.append(c)
            i += 1
            continue
        if c == '"' and not esc:
            in_str = not in_str
            out.append(c)
            i += 1
            continue
        if not in_str and c == '/' and i + 1 < len(src) and src[i + 1] == '/':
            i += 2
            while i < len(src) and src[i] != '\n':
                i += 1
            continue
        if esc:
            esc = False
        out.append(c)
        i += 1
    return ''.join(out)


def find_matching_brace(text: str, start: int) -> int:
    depth = 0
    in_str = False
    esc = False
    for i, c in enumerate(text[start:], start):
        if esc:
            esc = False
            continue
        if c == "\\":
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
                return i
    return -1


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9_-]+", "-", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-") or "page"


def summarize_text_value(value):
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, dict):
        if 'entries' in value and isinstance(value['entries'], dict):
            parts = []
            for entry in value['entries'].values():
                if isinstance(entry, str):
                    parts.append(entry)
                elif isinstance(entry, dict):
                    if 'text' in entry:
                        parts.append(str(entry['text']))
                    elif 'name' in entry:
                        parts.append(str(entry['name']))
            return '; '.join(parts[:3])
        if 'text' in value:
            return summarize_text_value(value['text'])
    return str(value)


def element_summary(key: str, el: dict) -> str:
    if not isinstance(el, dict):
        return f"- `{key}` — valor inesperado: `{type(el).__name__}`"
    name = el.get('name') or el.get('default_name') or key
    elem_type = el.get('type', 'unknown')
    details = []
    props = el.get('properties', {}) or {}
    if isinstance(props, dict):
        for field in ('text', 'placeholder', 'src', 'field_type', 'title'):
            if field in props:
                text = summarize_text_value(props[field])
                if text:
                    details.append(f"{field}={text}")
                    break
    return f"- `{key}` — `{elem_type}` — {name}" + (" (" + ", ".join(details) + ")" if details else "")


def render_action(action: dict, index: int, indent: int = 0) -> list[str]:
    indent_str = "  " * indent
    if not isinstance(action, dict):
        return [f"{indent_str}- Action {index}: valor inesperado `{type(action).__name__}`"]
    action_type = action.get('type', 'unknown')
    action_id = action.get('id', '')
    props = action.get('properties', {}) or {}
    prop_keys = sorted(k for k in props.keys() if k not in ('entries', 'records'))
    prop_summary = f"props: {', '.join(prop_keys)}" if prop_keys else "no properties"
    lines = [f"{indent_str}- Action {index}: `{action_type}` (id: `{action_id}`) — {prop_summary}"]
    # Add a textual summary for some properties if available
    for field in ('element_id', 'data_source', 'text', 'to_change', 'new_password', 'new_password_again', 'email', 'password'):
        if field in props:
            lines.append(f"{indent_str}  - `{field}`: {summarize_text_value(props[field])}")
    nested = action.get('actions') or {}
    if isinstance(nested, dict) and nested:
        lines.append(f"{indent_str}  - Nested actions:")
        for nested_idx, nested_action in enumerate(nested.values()):
            lines.extend(render_action(nested_action, nested_idx, indent + 2))
    return lines


def render_workflow(wf_id: str, wf) -> list[str]:
    lines = []
    if not isinstance(wf, dict):
        lines.append(f"- Workflow `{wf_id}` — valor inesperado `{type(wf).__name__}`")
        return lines
    name = wf.get('name') or '<sem nome>'
    trigger = wf.get('trigger')
    wf_type = wf.get('type') or 'unknown'
    lines.append(f"- Workflow `{wf_id}` — `{wf_type}` — {name}")
    lines.append(f"  - Trigger: `{trigger}`")
    actions = wf.get('actions') or {}
    if not isinstance(actions, dict) or not actions:
        lines.append("  - Ações: nenhuma ação encontrada")
        return lines
    valid_actions = [a for a in actions.values() if isinstance(a, dict)]
    lines.append(f"  - Ações: {len(valid_actions)}")
    for idx, action in enumerate(valid_actions):
        lines.extend(render_action(action, idx, indent=2))
    return lines


if __name__ == '__main__':
    if not SRC.exists():
        raise SystemExit(f"Source file not found: {SRC}")

    raw = SRC.read_text(encoding='utf-8')
    raw_clean = strip_comments(raw)
    pages_start = raw_clean.find('"pages"')
    if pages_start < 0:
        raise SystemExit('Could not find "pages" block in source file')

    pages_open = raw_clean.find('{', pages_start)
    if pages_open < 0:
        raise SystemExit('Could not find opening brace for pages block')

    pages_close = find_matching_brace(raw_clean, pages_open)
    if pages_close < 0:
        raise SystemExit('Could not find closing brace for pages block')

    pages = json.loads(raw_clean[pages_open:pages_close + 1])
    DST_DIR.mkdir(exist_ok=True)

    index_lines = ['# Bubble Pages Documentation', '']
    index_lines.append('Este diretório foi gerado a partir de `appBubble - cadastros.annotado.json`.')
    index_lines.append('')

    for page_key, page in sorted(pages.items(), key=lambda item: (item[1].get('name') if isinstance(item[1], dict) else '', item[0])):
        if not isinstance(page, dict):
            continue
        page_name = page.get('name') or '<sem nome>'
        page_type = page.get('type', 'unknown')
        elements = page.get('elements', {}) or {}
        element_keys = [k for k, v in elements.items() if k != 'length']
        workflows = page.get('workflows', {}) or {}
        properties = page.get('properties', {}) or {}

        file_name = f"page_{page_key}_{slugify(page_name)}.md"
        file_path = DST_DIR / file_name
        index_lines.append(f'- [{page_name}](./{file_name}) — `{page_key}`')

        lines = [f'# Página `{page_name}`', '']
        lines.append('## Resumo')
        lines.append(f'- **Page key:** `{page_key}`')
        lines.append(f'- **Nome:** `{page_name}`')
        lines.append(f'- **Tipo:** `{page_type}`')
        lines.append(f'- **Elementos (frontend):** {len(element_keys)}')
        lines.append(f'- **Fluxos (workflows):** {len(workflows) if isinstance(workflows, dict) else 0}')
        lines.append(f'- **Propriedades:** {len(properties)}')
        lines.append('')

        lines.append('## Frontend / UI')
        if element_keys:
            type_counts = {}
            for key in element_keys:
                el = elements[key] if isinstance(elements.get(key), dict) else {}
                elem_type = str(el.get('type', 'unknown'))
                type_counts[elem_type] = type_counts.get(elem_type, 0) + 1
            lines.append(f'- Elementos únicos: {len(element_keys)}')
            lines.append('- Contagem de tipos:')
            for elem_type, count in sorted(type_counts.items(), key=lambda item: (-item[1], item[0])):
                lines.append(f'  - `{elem_type}`: {count}')
            lines.append('')
            lines.append('### Elementos principais')
            for key in element_keys[:25]:
                el = elements[key] if isinstance(elements.get(key), dict) else {}
                lines.append(element_summary(key, el))
        else:
            lines.append('_Nenhum elemento frontend identificado._')
        lines.append('')

        lines.append('## Backend / Workflows')
        if isinstance(workflows, dict) and workflows:
            lines.append(f'- Workflows identificados: {len(workflows)}')
            lines.append('')
            for wf_id, wf in workflows.items():
                lines.extend(render_workflow(wf_id, wf))
                lines.append('')
        else:
            lines.append('_Nenhum workflow identificado para esta página._')
            lines.append('')

        lines.append('## Propriedades da Página')
        if properties:
            lines.append(f'- Total de propriedades: {len(properties)}')
            sample_keys = sorted(properties.keys())[:30]
            lines.append('- Chaves das propriedades:')
            for key in sample_keys:
                lines.append(f'  - `{key}`')
            if len(properties) > len(sample_keys):
                lines.append(f'  - e mais {len(properties) - len(sample_keys)} chaves...')
        else:
            lines.append('_Nenhuma propriedade identificada para esta página._')

        file_path.write_text('\n'.join(lines), encoding='utf-8')

    (DST_DIR / 'README.md').write_text('\n'.join(index_lines), encoding='utf-8')
    print(f'Generated {len(pages)} page docs in {DST_DIR}')
