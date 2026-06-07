import os
import re
from typing import Any, Dict, Optional, Tuple

from .class_data import SkillCategory, SkillDefinition
from .core import SpiritDefinition
from .core_rules import CoreRules, parse_biorhythm_content, parse_dice_table_content
from .icon_data import IconDefinition
from .runes import RuneCollection, parse_rune_content

DATA_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'Rememberence'))


class RememberenceData:
    def __init__(self):
        self.animals: Dict[str, SpiritDefinition] = {}
        self.stars: Dict[str, SpiritDefinition] = {}
        self.types: Dict[str, SpiritDefinition] = {}
        self.species: Dict[str, SpiritDefinition] = {}
        self.class_categories: Dict[str, SkillCategory] = {}
        self.class_tiers: Dict[str, list] = {'macro': [], 'meta': []}
        self.icons: Dict[str, IconDefinition] = {}
        self.icon_lore: Dict[str, str] = {}
        self.core_rules: CoreRules = CoreRules()
        self.runes: RuneCollection = RuneCollection()
        self.classes_raw: str = ''
        self.raw_files: Dict[str, str] = {}

    @classmethod
    def load_default(cls):
        loader = cls()
        loader.load()
        return loader

    def load(self):
        self._load_core('0-Core')
        self._load_signs('1-Zodiac/Animal', self.animals, 'Animal')
        self._load_signs('1-Zodiac/Stars', self.stars, 'Star')
        self._load_types('2-Spirit/Types')
        self._load_species('2-Spirit/Species')
        self._load_classes('3-Classes/Classes.txt')
        self._load_runes('4-Runes')
        self._load_icons('5-Icons')

    def _load_signs(self, relative_path: str, target: Dict[str, SpiritDefinition], category: str):
        path = os.path.join(DATA_ROOT, relative_path)
        if not os.path.isdir(path):
            return
        for candidate in sorted(os.listdir(path)):
            if not candidate.lower().endswith('.txt'):
                continue
            text = self._read_file(os.path.join(path, candidate))
            self.raw_files[candidate] = text
            target.update(self._parse_sign_file(text, category))

    def _load_types(self, relative_path: str):
        path = os.path.join(DATA_ROOT, relative_path)
        if not os.path.isdir(path):
            return
        for candidate in sorted(os.listdir(path)):
            if not candidate.lower().endswith('.txt'):
                continue
            text = self._read_file(os.path.join(path, candidate))
            self.raw_files[candidate] = text
            self.types.update(self._parse_type_file(text))

    def _load_species(self, relative_path: str):
        path = os.path.join(DATA_ROOT, relative_path)
        if not os.path.isdir(path):
            return
        for candidate in sorted(os.listdir(path)):
            if not candidate.lower().endswith('.txt'):
                continue
            text = self._read_file(os.path.join(path, candidate))
            self.raw_files[candidate] = text
            self.species.update(self._parse_type_file(text))

    def _load_classes(self, relative_path: str):
        path = os.path.join(DATA_ROOT, relative_path)
        if os.path.isfile(path):
            self.classes_raw = self._read_file(path)
            self.raw_files[os.path.basename(path)] = self.classes_raw
            categories, tier_info = self._parse_classes(self.classes_raw)
            self.class_categories = categories
            self.class_tiers = tier_info

    def _load_core(self, relative_path: str):
        path = os.path.join(DATA_ROOT, relative_path)
        if not os.path.isdir(path):
            return
        for candidate in sorted(os.listdir(path)):
            if not candidate.lower().endswith('.txt'):
                continue
            full_path = os.path.join(path, candidate)
            text = self._read_file(full_path)
            relpath = os.path.relpath(full_path, DATA_ROOT)
            self.raw_files[relpath] = text
            self.core_rules.guide_sections[candidate] = text
            if candidate == '5-Biorhythms.txt':
                self.core_rules.biorhythms = parse_biorhythm_content(text)
            elif candidate == '6-Dice Table.txt':
                self.core_rules.dice_tables = parse_dice_table_content(text)

    def _load_runes(self, relative_path: str):
        path = os.path.join(DATA_ROOT, relative_path)
        if not os.path.isdir(path):
            return
        rune_file = os.path.join(path, '0-Hidden Key.txt')
        if os.path.isfile(rune_file):
            text = self._read_file(rune_file)
            self.raw_files[os.path.relpath(rune_file, DATA_ROOT)] = text
            self.runes = parse_rune_content(text)

    def _load_icons(self, relative_path: str):
        path = os.path.join(DATA_ROOT, relative_path)
        if not os.path.isdir(path):
            return
        for root, dirs, files in os.walk(path):
            dirs.sort()
            for candidate in sorted(files):
                if not candidate.lower().endswith('.txt'):
                    continue
                full_path = os.path.join(root, candidate)
                text = self._read_file(full_path)
                relpath = os.path.relpath(full_path, DATA_ROOT)
                self.raw_files[relpath] = text
                icon = IconDefinition.from_text(relpath, text)
                self.icons[relpath] = icon
                if candidate in ('Heroes.txt', 'Mirrors.txt', 'Mythos.txt', 'General.txt'):
                    self.icon_lore[relpath] = text
                    self.icon_lore[candidate] = text
        def icon_sort_key(item):
            icon = item[1]
            special_key = 1 if icon.filename.lower().endswith('key.txt') else 0
            return (
                icon.category or '',
                special_key,
                icon.filename or '',
                (icon.faction.name if icon.faction else ''),
                item[0],
            )

        self.icons = dict(sorted(self.icons.items(), key=icon_sort_key))

    def _read_file(self, path: str) -> str:
        with open(path, 'r', encoding='utf-8', errors='ignore') as handle:
            return handle.read()

    def _parse_sign_file(self, content: str, category: str) -> Dict[str, SpiritDefinition]:
        entries: Dict[str, SpiritDefinition] = {}
        current: Optional[SpiritDefinition] = None
        active_list = None

        for raw_line in content.splitlines():
            line = raw_line.strip()
            if not line:
                continue

            header = re.match(r'^(\d+)\)\s*([^;\[]+)\s*;\s*\[([^\]]+)\]', line)
            if header:
                if current is not None:
                    entries[current.name] = current
                raw_name = header.group(2).strip()
                if raw_name.lower().startswith('year of the '):
                    raw_name = raw_name[len('year of the '):].strip()
                elif raw_name.lower().startswith('constellation '):
                    raw_name = raw_name[len('constellation '):].strip()
                current = SpiritDefinition(
                    name=raw_name,
                    label=header.group(1).strip(),
                    style=header.group(3).strip(),
                    category=category,
                )
                active_list = None
                continue

            if current is None:
                continue

            if line.startswith('Biorhythms:'):
                current.biorhythms = {}
                active_list = 'biorhythms'
                continue
            if line.startswith('Elements:') or line.startswith('Colors:'):
                current.elements = line.split(':', 1)[1].strip()
                active_list = None
                continue
            if line.startswith('Species:'):
                current.species = []
                active_list = 'species'
                continue
            if line.startswith('Types:'):
                current.types = []
                active_list = 'types'
                continue
            if line.startswith('Traits:'):
                current.traits.append(line.split(':', 1)[1].strip())
                active_list = None
                continue
            if line.startswith('Attack:'):
                current.attack_pattern = line.split(':', 1)[1].strip()
                active_list = None
                continue

            if active_list == 'biorhythms' and '=' in line:
                key, value = [part.strip() for part in line.split('=', 1)]
                try:
                    current.biorhythms[key] = int(value)
                except ValueError:
                    pass
                continue

            if active_list in ('species', 'types') and ',' in line:
                name_part, bonus_part = [part.strip() for part in line.split(',', 1)]
                target_list = getattr(current, active_list)
                target_list.append({'name': name_part, 'bonus': bonus_part})
                continue

            if line.startswith('Move:'):
                current.base_stats['move'] = line.split(':', 1)[1].strip()
                active_list = None
                continue

            stat_match = re.match(r'^(HP|ATK|DEF|SPD|MP)\s*[=+]\s*(\d+|[A-Z]+)', line)
            if stat_match:
                value = stat_match.group(2)
                current.base_stats[stat_match.group(1)] = int(value) if value.isdigit() else value
                continue

        if current is not None and current.name not in entries:
            entries[current.name] = current
        return entries

    def _parse_type_file(self, content: str) -> Dict[str, SpiritDefinition]:
        entries: Dict[str, SpiritDefinition] = {}
        current: Optional[SpiritDefinition] = None

        for raw_line in content.splitlines():
            line = raw_line.strip()
            if not line:
                continue

            header = re.match(r'^(\d+)\)\s*([^;\[]+)\s*;\s*\[([^\]]+)\]', line)
            if header:
                if current is not None:
                    entries[current.name] = current
                current = SpiritDefinition(
                    name=header.group(2).strip(),
                    label=header.group(1).strip(),
                    style=header.group(3).strip(),
                    category='Type',
                )
                continue

            if current is None:
                continue

            if line.startswith('Traits;') or line.startswith('Traits:'):
                value = line.split(';', 1)[1].strip() if ';' in line else line.split(':', 1)[1].strip()
                current.traits.append(value)
                continue
            if line.startswith('Attack:'):
                current.attack_pattern = line.split(':', 1)[1].strip()
                continue
            if line.startswith('Move:'):
                current.base_stats['move'] = line.split(':', 1)[1].strip()
                continue

            stat_match = re.match(r'^(HP|ATK|DEF|SPD|MP)\s*[=+]\s*(\d+|[A-Z]+)', line)
            if stat_match:
                value = stat_match.group(2)
                current.base_stats[stat_match.group(1)] = int(value) if value.isdigit() else value
                continue
            if line.startswith('Traits;'):
                current.traits.append(line.split(';', 1)[1].strip())
                continue

        if current is not None and current.name not in entries:
            entries[current.name] = current
        return entries

    def _parse_classes(self, content: str) -> Tuple[Dict[str, SkillCategory], Dict[str, list]]:
        categories: Dict[str, SkillCategory] = {}
        tiers = {'macro': [], 'meta': []}
        current_category: Optional[SkillCategory] = None
        current_skill: Optional[SkillDefinition] = None
        pending_flavor: list[str] = []
        parse_mode: Optional[str] = None

        for raw_line in content.splitlines():
            line = raw_line.strip()
            if not line or line.startswith('~') or line.startswith('-'):
                continue

            if line.startswith('Macro, TiersI:'):
                parse_mode = 'macro'
                current_category = None
                current_skill = None
                pending_flavor = []
                continue
            if line.startswith('Meta, TiersII:'):
                parse_mode = 'meta'
                current_category = None
                current_skill = None
                pending_flavor = []
                continue

            if parse_mode in ('macro', 'meta'):
                tier_match = re.match(r'^(.+?)\s*-\s*(.+?)\s*\(Lvl\s*([^\)]+)\)', line)
                if tier_match:
                    tiers[parse_mode].append({
                        'tier': tier_match.group(1).strip(),
                        'title': tier_match.group(2).strip(),
                        'level': tier_match.group(3).strip(),
                    })
                    continue
                if line.startswith('All Skills use the Primary Leveling System For Mastery tier progress'):
                    parse_mode = None
                    continue

            control_match = re.search(r'^(?P<name>.+?)\s+skills are controlled with\s+(?P<stats>[^\.]+)\.?$', line, re.IGNORECASE)
            if control_match:
                if current_skill and current_category:
                    current_category.skills.append(current_skill)
                    current_skill = None
                if current_category:
                    categories[current_category.name] = current_category
                category_name = control_match.group('name').strip()
                control_stats = [s.strip() for s in control_match.group('stats').split('/')]
                current_category = SkillCategory(
                    name=category_name,
                    flavor=' '.join(pending_flavor).strip() or None,
                    control_stats=control_stats,
                )
                pending_flavor = []
                continue

            if current_category is None:
                pending_flavor.append(line)
                continue

            skill_match = re.match(r'^(\d+)\)\s*([^:]+):\s*\[([^\]]+)\]', line)
            if skill_match:
                if current_skill:
                    current_category.skills.append(current_skill)
                current_skill = SkillDefinition(
                    id=int(skill_match.group(1)),
                    name=skill_match.group(2).strip(),
                    alias=skill_match.group(3).strip(),
                    category=current_category.name,
                    control_stats=current_category.control_stats,
                )
                continue

            if current_skill is None:
                continue

            if line.startswith('Pattern:'):
                current_skill.pattern = line.split(':', 1)[1].strip()
                continue
            if line.startswith('Traits:'):
                traits = line.split(':', 1)[1].strip()
                current_skill.traits = [trait.strip() for trait in traits.split(',') if trait.strip()]
                continue
            stat_match = re.match(r'^(ATK|DEF|SPD)\s*\+\s*(\d+)', line)
            if stat_match:
                value = int(stat_match.group(2))
                if stat_match.group(1) == 'ATK':
                    current_skill.atk = value
                elif stat_match.group(1) == 'DEF':
                    current_skill.defense = value
                elif stat_match.group(1) == 'SPD':
                    current_skill.spd = value
                continue

            current_skill.description += line + ' '

        if current_skill and current_category:
            current_category.skills.append(current_skill)
        if current_category:
            categories[current_category.name] = current_category

        return categories, tiers
