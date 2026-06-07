import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class BiorhythmDefinition:
    name: str
    title: Optional[str] = None
    dominant: Optional[str] = None
    recessive: Optional[str] = None
    description: Optional[str] = None


@dataclass
class ThoughtParameter:
    name: str
    formula: Optional[str] = None
    negative: Optional[str] = None
    positive: Optional[str] = None
    description: Optional[str] = None


@dataclass
class DiceTableEntry:
    title: str
    description: Optional[str] = None
    values: List[str] = field(default_factory=list)


@dataclass
class CoreRules:
    biorhythms: Dict[str, BiorhythmDefinition] = field(default_factory=dict)
    thought_parameters: List[ThoughtParameter] = field(default_factory=list)
    dice_tables: Dict[str, DiceTableEntry] = field(default_factory=dict)
    guide_sections: Dict[str, str] = field(default_factory=dict)


def parse_biorhythm_content(content: str) -> Dict[str, BiorhythmDefinition]:
    biorhythms: Dict[str, BiorhythmDefinition] = {}
    lines = content.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        header = re.match(r'^(\d+)\)\s*([A-Z]{3})\s*\(([^)]+)\):', line)
        if header:
            name = header.group(2).strip()
            title = header.group(3).strip()
            bi = BiorhythmDefinition(name=name, title=title)
            i += 1
            while i < len(lines):
                text = lines[i].strip()
                if not text:
                    i += 1
                    continue
                if text.startswith('1)') or re.match(r'^(\d+)\)\s*[A-Z]{3}\s*\(', text):
                    break
                if text.startswith('Dominant:'):
                    bi.dominant = text.split(':', 1)[1].strip()
                elif text.startswith('Recessive:'):
                    bi.recessive = text.split(':', 1)[1].strip()
                elif bi.description:
                    bi.description += ' ' + text
                else:
                    bi.description = text
                i += 1
            biorhythms[name] = bi
            continue
        i += 1
    return biorhythms


def parse_thought_parameters(content: str) -> List[ThoughtParameter]:
    thoughts: List[ThoughtParameter] = []
    lines = content.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        header = re.match(r'^(\d+)\)\s*([^:]+)\s*\(([^)]+)\):', line)
        if header:
            name = header.group(2).strip()
            formula = header.group(3).strip()
            tp = ThoughtParameter(name=name, formula=formula)
            i += 1
            while i < len(lines):
                text = lines[i].strip()
                if not text:
                    i += 1
                    continue
                if text.startswith('1)') or re.match(r'^(\d+)\)\s*[^:]+\s*\(', text):
                    break
                if text.startswith('The sum of these parameters') or text.startswith('Each interaction'):
                    tp.description = (tp.description + ' ' + text).strip() if tp.description else text
                elif text.startswith('Negative:') or text.startswith('Positive:'):
                    if text.startswith('Negative:'):
                        tp.negative = text.split(':', 1)[1].strip()
                    else:
                        tp.positive = text.split(':', 1)[1].strip()
                elif tp.description:
                    tp.description += ' ' + text
                else:
                    tp.description = text
                i += 1
            thoughts.append(tp)
            continue
        i += 1
    return thoughts


def parse_dice_table_content(content: str) -> Dict[str, DiceTableEntry]:
    tables: Dict[str, DiceTableEntry] = {}
    lines = content.splitlines()
    current: Optional[DiceTableEntry] = None
    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        if re.search(r'D\d+|Dice|Roll|Table', line, re.IGNORECASE) and ';' in line:
            title = line
            current = DiceTableEntry(title=title)
            tables[title] = current
            continue
        if current is None:
            continue
        if re.match(r'^(\d+|[A-Z][a-z]+)\s*[-)]', line) or re.search(r'\(', line):
            current.values.append(line)
        else:
            if current.description:
                current.description += ' ' + line
            else:
                current.description = line
    return tables
