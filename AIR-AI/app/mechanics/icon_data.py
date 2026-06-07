import os
import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple


def clean_icon_name(name: str) -> str:
    return re.sub(r'^\d+\s*-\s*', '', name).strip()


@dataclass
class ConstructDefinition:
    tier: Optional[str]
    name: str
    cost: Optional[str]
    species: Optional[str]
    type: Optional[str]
    stats: Dict[str, str] = field(default_factory=dict)
    attributes: Dict[str, str] = field(default_factory=dict)
    product: Optional[str] = None
    move: Optional[str] = None
    attack: Optional[str] = None
    traits: List[str] = field(default_factory=list)
    raw: str = ''


@dataclass
class ChaosShardDefinition:
    name: str
    rank: Optional[str]
    recipe: Optional[str]
    sell: Optional[str]
    stats: Dict[str, str] = field(default_factory=dict)
    pattern: Optional[str] = None
    raw: str = ''


@dataclass
class FactionDefinition:
    name: str
    macro_tiers: List[Dict[str, str]] = field(default_factory=list)
    meta_tiers: List[Dict[str, str]] = field(default_factory=list)
    raw: str = ''


@dataclass
class ClassStyleDefinition:
    category: str
    style: str
    name: str
    raw: str = ''


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
    constructs: List[ConstructDefinition] = field(default_factory=list)
    faction: Optional[FactionDefinition] = None
    chaos_shard: Optional[ChaosShardDefinition] = None
    class_styles: List[ClassStyleDefinition] = field(default_factory=list)

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

            section_lines.append(line)

        icon._commit_section(current_section, section_lines)
        icon.description = icon.sections.get('intro', '').strip()
        icon._parse_metadata()
        icon.faction = icon._parse_faction()
        icon.chaos_shard = icon._parse_chaos_shard()
        icon.constructs = icon._parse_constructs()
        icon.class_styles = icon._parse_class_styles()
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
    def _split_path(path: str) -> Tuple[Optional[str], Optional[str]]:
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

    def _parse_metadata(self) -> None:
        intro = self.sections.get('intro', '')
        lines = [line.strip() for line in intro.splitlines() if line.strip()]
        for line in lines:
            title = self._parse_title(line)
            if title and self.name == self.filename:
                self.name = title
                self.metadata['title'] = title
                continue
            if line.startswith('(') and '):' in line and self.name == self.filename:
                self.name = line.split('):', 1)[0].strip('() ')
                self.metadata['title'] = self.name
                continue
            if line.startswith('$$$'):
                self.metadata['money'] = line.split('=', 1)[-1].strip()
                continue
            if line.lower().startswith('faction;'):
                self.metadata['faction'] = re.sub(r'^Faction;\s*', '', line, flags=re.IGNORECASE).strip()
                continue

    def _parse_faction(self) -> Optional[FactionDefinition]:
        raw = self.raw
        faction_match = re.search(r'Faction;\s*\[([^\]]+)\]', raw, re.IGNORECASE)
        if not faction_match:
            return None
        faction = FactionDefinition(name=faction_match.group(1).strip(), raw=raw)
        faction.macro_tiers = self._parse_tiers(raw)
        faction.meta_tiers = self._parse_tiers(raw, meta=True)
        return faction

    def _parse_tiers(self, raw: str, meta: bool = False) -> List[Dict[str, str]]:
        tiers: List[Dict[str, str]] = []
        header = 'Meta, TiersII:' if meta else 'Macro, TiersI:'
        start = raw.find(header)
        if start == -1:
            return tiers
        sub = raw[start + len(header):]
        for line in sub.splitlines():
            text = line.strip()
            if not text or text.startswith('~'):
                continue
            match = re.match(r'^(.+?)\s*-\s*(.+?)\s*\(Lvl\s*([^)]+)\)', text)
            if match:
                tiers.append({'tier': match.group(1).strip(), 'title': match.group(2).strip(), 'level': match.group(3).strip()})
                continue
            if text.startswith('Meta, TiersII:') or text.startswith('Macro, TiersI:'):
                break
        return tiers

    def _parse_chaos_shard(self) -> Optional[ChaosShardDefinition]:
        raw = self.raw
        match = re.search(r'Chaos Shard\s*-\s*([^\[]+)\s*\[([^\]]+)\](.*?)(?=\n\s*-{2,}|\Z)', raw, re.S)
        if not match:
            return None
        shard = ChaosShardDefinition(name=match.group(1).strip(), rank=match.group(2).strip(), recipe=None, sell=None, raw=match.group(0).strip())
        body = match.group(3)
        for line in body.splitlines():
            text = line.strip()
            if not text:
                continue
            if 'Recipe:' in text:
                shard.recipe = text.strip('() ')
                continue
            if 'Sell:' in text:
                shard.sell = text.strip('() ')
                continue
            if text.startswith('Pattern:'):
                shard.pattern = text.split(':', 1)[1].strip()
                continue
            stat_match = re.match(r'^(HP|ATK|DEF|SPD|MP)\s*x\s*(.+)$', text)
            if stat_match:
                shard.stats[stat_match.group(1)] = stat_match.group(2).strip()
                continue
        return shard

    def _parse_constructs(self) -> List[ConstructDefinition]:
        constructs: List[ConstructDefinition] = []
        pattern = re.compile(r'Construct\s*\[([^\]]+)\]\s*\n"([^"]+)"\s*(?:\n\((Cost:[^\)]+)\))?\s*\n(.*?)(?=\nConstruct\s*\[|\Z)', re.S)
        for match in pattern.finditer(self.raw):
            tier = match.group(1).strip()
            name = match.group(2).strip()
            cost = match.group(3).strip() if match.group(3) else None
            body = match.group(4).strip()
            stats: Dict[str, str] = {}
            attributes: Dict[str, str] = {}
            species = None
            type_name = None
            product = None
            move = None
            attack = None
            traits: List[str] = []
            for line in body.splitlines():
                text = line.strip()
                if not text:
                    continue
                if text.startswith('Species:'):
                    species = text.split(':', 1)[1].strip()
                    continue
                if text.startswith('Type:'):
                    type_name = text.split(':', 1)[1].strip()
                    continue
                if text.startswith('Product:'):
                    product = text.split(':', 1)[1].strip()
                    continue
                if text.startswith('Move:'):
                    move = text.split(':', 1)[1].strip()
                    continue
                if text.startswith('Attack:'):
                    attack = text.split(':', 1)[1].strip()
                    continue
                if text.startswith('Traits:'):
                    traits = [t.strip() for t in text.split(':', 1)[1].split(',') if t.strip()]
                    continue
                stat_match = re.match(r'^([A-Z]{2,4})\s*([=+])\s*(.+)$', text)
                if stat_match:
                    key = stat_match.group(1)
                    value = stat_match.group(3).strip()
                    if stat_match.group(2) == '=':
                        stats[key] = value
                    else:
                        attributes[key] = value
                    continue
            constructs.append(ConstructDefinition(
                tier=tier,
                name=name,
                cost=cost,
                species=species,
                type=type_name,
                stats=stats,
                attributes=attributes,
                product=product,
                move=move,
                attack=attack,
                traits=traits,
                raw=match.group(0).strip(),
            ))
        return constructs

    def _parse_class_styles(self) -> List[ClassStyleDefinition]:
        styles: List[ClassStyleDefinition] = []
        text = self.sections.get('Class Styles', '')
        if not text:
            return styles
        for line in text.splitlines():
            stripped = line.strip()
            if not stripped:
                continue
            match = re.match(r'^([^/]+)/([^\s]+)\s*"([^"]+)"', stripped)
            if match:
                styles.append(ClassStyleDefinition(category=match.group(1).strip(), style=match.group(2).strip(), name=match.group(3).strip(), raw=stripped))
        return styles
