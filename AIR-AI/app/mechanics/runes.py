import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class RuneDefinition:
    index: int
    code: str
    title: Optional[str] = None
    effect: Optional[str] = None
    description: Optional[str] = None


@dataclass
class RuneCollection:
    runes: Dict[str, RuneDefinition] = field(default_factory=dict)
    cypher: Dict[str, str] = field(default_factory=dict)


def parse_rune_content(content: str) -> RuneCollection:
    lines = content.splitlines()
    collection = RuneCollection()
    current = None

    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue

        match = re.match(r'^(\d+)\)\s*([^\s]+)\s*-\s*(.+)$', line)
        if match:
            index = int(match.group(1))
            code = match.group(2).strip()
            description = match.group(3).strip()
            title = None
            effect = None
            if '(' in description and ')' in description:
                title = description.split('(')[0].strip()
                effect = description
            rune = RuneDefinition(index=index, code=code, title=title, effect=effect, description=description)
            collection.runes[code] = rune
            current = rune
            continue

        if line.startswith('A =') or line.startswith('B =') or line.startswith('R ='):
            parts = line.split('=')
            if len(parts) == 2:
                key = parts[0].strip()
                value = parts[1].strip()
                collection.cypher[key] = value
            continue

        if current is not None:
            if current.description:
                current.description += ' ' + line
            else:
                current.description = line

    return collection
