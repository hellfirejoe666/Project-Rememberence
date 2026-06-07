import random
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

TILE_CHARS: Dict[str, str] = {
    'floor': '.',
    'wall': '#',
    'water': '~',
    'forest': '^',
    'door': '+',
    'city': 'O',
    'mountain': 'M',
    'grass': ',',
}

THEME_HINTS: Dict[str, str] = {
    'dungeon': 'Subterranean passages carved in ancient stone.',
    'structures': 'A ruined plan of halls, chambers and sealed archives.',
    'buildings': 'A complex interior map of rooms and corridors.',
    'world': 'A planetary site with natural textures and boundaries.',
    'portal': 'A mystical nexus with gateways and astral thresholds.',
    'treasure': 'A vault of hidden caches and guarded doorways.',
    'gear': 'A forge floor layered with gears, chambers and conduits.',
}

DEFAULT_WIDTH = 12
DEFAULT_HEIGHT = 12
WORLD_WIDTH = 32
WORLD_HEIGHT = 32
ZONE_WIDTH = 16
ZONE_HEIGHT = 16


@dataclass
class MapNode:
    """Hierarchical map node (world, zone, or building)."""
    level: str  # 'world', 'zone', or 'building'
    name: str
    theme: str
    layout: List[List[str]]
    legend: Dict[str, str]
    description: str
    parent_id: Optional[str] = None
    children: List[str] = field(default_factory=list)
    entrance_pos: Optional[Tuple[int, int]] = None
    exit_pos: Optional[Tuple[int, int]] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            'level': self.level,
            'name': self.name,
            'theme': self.theme,
            'layout': self.layout,
            'legend': self.legend,
            'description': self.description,
            'parent_id': self.parent_id,
            'children': self.children,
            'entrance_pos': self.entrance_pos,
            'exit_pos': self.exit_pos,
        }




def _normalize_theme(kind: Optional[str]) -> str:
    if not kind:
        return 'mysterious'
    key = kind.lower()
    for marker in ['dungeon', 'cave', 'shrine', 'underworld', 'crypt']:
        if marker in key:
            return 'dungeon'
    for marker in ['structure', 'building', 'city', 'town', 'temple', 'hall']:
        if marker in key:
            return 'structures'
    for marker in ['world', 'planet', 'realm', 'domain']:
        if marker in key:
            return 'world'
    for marker in ['portal', 'gate', 'rift']:
        if marker in key:
            return 'portal'
    for marker in ['treasure', 'vault', 'hoard']:
        return 'treasure'
    if 'gear' in key or 'forge' in key:
        return 'gear'
    return 'mysterious'


def _create_grid(width: int, height: int, fill: str = 'wall') -> List[List[str]]:
    return [[fill for _ in range(width)] for _ in range(height)]


def _room_rect(width: int, height: int, min_size: int = 3, max_size: int = 5) -> Tuple[int, int, int, int]:
    w = random.randint(min_size, max_size)
    h = random.randint(min_size, max_size)
    x = random.randint(1, max(1, width - w - 2))
    y = random.randint(1, max(1, height - h - 2))
    return x, y, w, h


def _carve_room(grid: List[List[str]], x: int, y: int, w: int, h: int) -> Tuple[int, int]:
    for ry in range(y, y + h):
        for rx in range(x, x + w):
            grid[ry][rx] = 'floor'
    # leave a frame of walls around the room if possible
    return x + w // 2, y + h // 2


def _carve_corridor(grid: List[List[str]], x1: int, y1: int, x2: int, y2: int) -> None:
    if random.random() < 0.5:
        for x in range(min(x1, x2), max(x1, x2) + 1):
            grid[y1][x] = 'floor'
        for y in range(min(y1, y2), max(y1, y2) + 1):
            grid[y][x2] = 'floor'
    else:
        for y in range(min(y1, y2), max(y1, y2) + 1):
            grid[y][x1] = 'floor'
        for x in range(min(x1, x2), max(x1, x2) + 1):
            grid[y2][x] = 'floor'


def _place_feature(grid: List[List[str]], feature: str, count: int = 6) -> None:
    height = len(grid)
    width = len(grid[0]) if height else 0
    attempts = 0
    placed = 0
    while placed < count and attempts < count * 8:
        attempts += 1
        x = random.randint(1, max(1, width - 2))
        y = random.randint(1, max(1, height - 2))
        if grid[y][x] == 'floor':
            grid[y][x] = feature
            placed += 1


def _add_doors(grid: List[List[str]], rooms: List[Tuple[int, int, int, int]], count: int = 4) -> None:
    height = len(grid)
    width = len(grid[0]) if height else 0
    candidates = []
    for x, y, w, h in rooms:
        for rx in range(x, x + w):
            for dy in (-1, h):
                ty = y + dy
                if 0 <= ty < height and 0 <= rx < width and grid[ty][rx] == 'wall':
                    candidates.append((rx, ty))
        for ry in range(y, y + h):
            for dx in (-1, w):
                tx = x + dx
                if 0 <= tx < width and 0 <= ry < height and grid[ry][tx] == 'wall':
                    candidates.append((tx, ry))
    random.shuffle(candidates)
    for rx, ry in candidates[:count]:
        if grid[ry][rx] == 'wall':
            grid[ry][rx] = 'door'


def _render_layout(grid: List[List[str]]) -> List[List[str]]:
    return [[TILE_CHARS.get(cell, '?') for cell in row] for row in grid]


def _render_description(kind: Optional[str], theme: str) -> str:
    hint = THEME_HINTS.get(theme, 'A place of unknown geometry and silent echoes.')
    if kind:
        return f"A {kind.lower()} map with {hint}"
    return hint


def _build_map_name(kind: Optional[str]) -> str:
    base = kind.title() if kind else 'Mysterious Map'
    suffixes = ['of Echoes', 'of the Astral Vault', 'of Hidden Doors', 'of Shifting Halls', 'of Silent Stones']
    return f"{base} {random.choice(suffixes)}"


def generate_map_layout(kind: Optional[str] = None, width: int = DEFAULT_WIDTH, height: int = DEFAULT_HEIGHT, level: str = 'building') -> MapNode:
    theme = _normalize_theme(kind)
    grid = _create_grid(width, height, fill='wall')
    rooms: List[Tuple[int, int, int, int]] = []
    room_count = random.randint(3, 5)
    for _ in range(room_count):
        x, y, w, h = _room_rect(width, height)
        center = _carve_room(grid, x, y, w, h)
        rooms.append((x, y, w, h))
    for index in range(1, len(rooms)):
        prev_center = (rooms[index - 1][0] + rooms[index - 1][2] // 2, rooms[index - 1][1] + rooms[index - 1][3] // 2)
        current_center = (rooms[index][0] + rooms[index][2] // 2, rooms[index][1] + rooms[index][3] // 2)
        _carve_corridor(grid, prev_center[0], prev_center[1], current_center[0], current_center[1])
    feature_type = 'water' if theme == 'dungeon' else 'forest' if theme == 'world' else 'floor'
    if theme in {'structures', 'gear', 'portal', 'treasure'}:
        feature_type = 'door'
    _place_feature(grid, feature_type, count=6)
    _add_doors(grid, rooms, count=3)
    layout = _render_layout(grid)
    description = _render_description(kind, theme)
    name = _build_map_name(kind)
    entrance = rooms[0] if rooms else (1, 1)
    exit_pos = rooms[-1] if rooms else (width - 2, height - 2)
    entrance_pos = (entrance[0] + entrance[2] // 2, entrance[1] + entrance[3] // 2)
    exit_pos = (exit_pos[0] + exit_pos[2] // 2, exit_pos[1] + exit_pos[3] // 2)
    
    return MapNode(
        level=level,
        name=name,
        theme=theme,
        layout=layout,
        legend=TILE_CHARS.copy(),
        description=description,
        entrance_pos=entrance_pos,
        exit_pos=exit_pos,
    )


def generate_world_map(seed: Optional[int] = None, width: int = WORLD_WIDTH, height: int = WORLD_HEIGHT) -> MapNode:
    """Generate a world-level map with regions, cities, and geographic features."""
    if seed is not None:
        random.seed(seed)
    
    theme = 'world'
    grid = _create_grid(width, height, fill='grass')
    
    # Place mountain ranges
    for _ in range(random.randint(3, 5)):
        mx = random.randint(2, width - 2)
        my = random.randint(2, height - 2)
        for _ in range(random.randint(5, 12)):
            if 0 <= mx < width and 0 <= my < height:
                grid[my][mx] = 'mountain'
            mx += random.randint(-1, 1)
            my += random.randint(-1, 1)
    
    # Place water features
    for _ in range(random.randint(2, 4)):
        wx = random.randint(2, width - 2)
        wy = random.randint(2, height - 2)
        for _ in range(random.randint(4, 10)):
            if 0 <= wx < width and 0 <= wy < height:
                grid[wy][wx] = 'water'
            wx += random.randint(-1, 1)
            wy += random.randint(-1, 1)
    
    # Place cities/zones
    cities = []
    for _ in range(random.randint(5, 8)):
        cx = random.randint(1, width - 2)
        cy = random.randint(1, height - 2)
        if grid[cy][cx] not in {'water', 'mountain'}:
            grid[cy][cx] = 'city'
            cities.append((cx, cy))
    
    layout = _render_layout(grid)
    description = f"A vast realm of {random.choice(['ancient', 'mystical', 'verdant', 'windswept'])} continents and thriving settlements."
    
    world = MapNode(
        level='world',
        name='The Known Realm',
        theme=theme,
        layout=layout,
        legend=TILE_CHARS.copy(),
        description=description,
        entrance_pos=(width // 2, height // 2),
        exit_pos=None,
    )
    return world


def generate_zone_map(parent_name: str, seed: Optional[int] = None, width: int = ZONE_WIDTH, height: int = ZONE_HEIGHT) -> MapNode:
    """Generate a zone-level map (region between world and buildings)."""
    if seed is not None:
        random.seed(seed)
    
    theme = 'world'
    grid = _create_grid(width, height, fill='grass')
    
    # Place terrain
    for _ in range(random.randint(2, 3)):
        tx = random.randint(1, width - 2)
        ty = random.randint(1, height - 2)
        feature = random.choice(['forest', 'water', 'mountain'])
        for _ in range(random.randint(3, 8)):
            if 0 <= tx < width and 0 <= ty < height:
                grid[ty][tx] = feature
            tx += random.randint(-1, 1)
            ty += random.randint(-1, 1)
    
    # Place dungeon/building entrances
    cities = []
    for _ in range(random.randint(2, 4)):
        cx = random.randint(1, width - 2)
        cy = random.randint(1, height - 2)
        if grid[cy][cx] == 'grass':
            grid[cy][cx] = 'city'
            cities.append((cx, cy))
    
    layout = _render_layout(grid)
    description = f"A regional territory within {parent_name}, dotted with points of interest."
    
    zone = MapNode(
        level='zone',
        name=f"{parent_name} Region",
        theme=theme,
        layout=layout,
        legend=TILE_CHARS.copy(),
        description=description,
        entrance_pos=(width // 2, height // 2),
        exit_pos=None,
    )
    return zone
