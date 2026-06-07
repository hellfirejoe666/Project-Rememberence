import os
import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional


def clean_icon_name(name: str) -> str:
    return re.sub(r'^\d+\s*-\s*', '', name).strip()


@dataclass
class IconDefinition:
    name: str
    filename: str
    category: Optional[str] = None
    group: Optional[str] = None
    path: str = ''
    raw: str = ''
    metadata: Dict[str, str] = field(default_factory=dict)
    sections: Dict[str, str] = field(default_factory=dict)
    description: Optional[str] = None
    tags: List[str] = field(default_factory=list)

    @classmethod
    def from_text(cls, path: str, content: str) -> 'IconDefinition':
        filename = os.path.basename(path)
        icon = cls(name=filename, filename=filename, path=path, raw=content)
        icon.category, icon.group = cls._split_path(path)

        current_section = 'intro'
        section_lines: List[str] = []
        icon.sections[current_section] = ''

        for raw_line in content.splitlines():
            line = raw_line.rstrip()
            stripped = line.strip()
            if not stripped:
                section_lines.append('')
                continue

            header = cls._parse_section_header(stripped)
            if header:
                icon._commit_section(current_section, section_lines)
                current_section = header
                section_lines = []
                icon.sections.setdefault(current_section, '')
                continue

            if icon.name == filename and icon.name in ('Heroes.txt', 'Mirrors.txt', 'Mythos.txt', 'General.txt'):
                icon.name = icon.name.replace('.txt', '')

            if icon.name == filename and not icon.metadata.get('title'):
                possible_title = cls._parse_title(stripped)
                if possible_title:
                    icon.name = possible_title
                    icon.metadata['title'] = possible_title

            if icon.name == filename and stripped.startswith('(') and '):' in stripped:
                icon.name = stripped.split('):', 1)[0].strip('() ')
                icon.metadata['title'] = icon.name

            section_lines.append(line)

        icon._commit_section(current_section, section_lines)
        icon.description = icon.sections.get('intro', '').strip()
        return icon

    @staticmethod
    def _parse_title(line: str) -> Optional[str]:
        match = re.match(r'^"([^"]+)"$', line)
        if match:
            return match.group(1).strip()
        return None

    @staticmethod
    def _parse_section_header(line: str) -> Optional[str]:
        match = re.match(r'^[~\-\s]*\[([^\]]+)\][~\-\s]*$', line)
        if match:
            return match.group(1).strip()
        return None

    @staticmethod
    def _split_path(path: str) -> tuple[Optional[str], Optional[str]]:
        segments = [clean_icon_name(p) for p in path.split(os.sep) if p]
        if segments and segments[0].lower() == 'icons':
            segments = segments[1:]
        if len(segments) >= 2:
            return segments[0], segments[1]
        if segments:
            return segments[0], None
        return None, None

    def _commit_section(self, name: str, lines: List[str]) -> None:
        text = '\n'.join(lines).strip('\n')
        if name in self.sections and self.sections[name]:
            text = self.sections[name] + '\n' + text
        self.sections[name] = text.strip()