"""
Battle board system with chess-inspired movement and Rememberence combat mechanics.
"""
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set, Tuple
import random


@dataclass
class Position:
    """2D grid position."""
    x: int
    y: int

    def distance_to(self, other: 'Position') -> int:
        """Chebyshev distance (chess king distance)."""
        return max(abs(self.x - other.x), abs(self.y - other.y))

    def neighbors(self, include_diagonal: bool = True) -> List['Position']:
        """Get adjacent positions."""
        deltas = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        if include_diagonal:
            deltas += [(1, 1), (1, -1), (-1, 1), (-1, -1)]
        return [Position(self.x + dx, self.y + dy) for dx, dy in deltas]

    def __eq__(self, other):
        if not isinstance(other, Position):
            return False
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))


@dataclass
class CombatStats:
    """Combat statistics for a combatant."""
    HP: int
    ATK: int
    DEF: int
    SPD: int
    MP: int
    MNF: int = 5  # Mental fitness, affects MP recovery
    FND: int = 5  # Foundational stat
    UND: int = 5  # Understanding, affects defense


@dataclass
class Combatant:
    """A spirit or character in battle."""
    id: str
    name: str
    stats: CombatStats
    position: Position
    team: int  # 0 = player, 1 = enemy
    current_hp: int = field(default_factory=lambda: None)
    current_mp: int = field(default_factory=lambda: None)
    status_effects: List[str] = field(default_factory=list)
    actions_used: int = 0
    moved: bool = False

    def __post_init__(self):
        if self.current_hp is None:
            self.current_hp = self.stats.HP
        if self.current_mp is None:
            self.current_mp = self.stats.MP

    def get_movement_range(self) -> int:
        """Calculate how many tiles this combatant can move."""
        # Movement based on SPD stat (chess-inspired: 1-3 tiles per turn)
        base_move = 1 + (self.stats.SPD // 5)
        return min(base_move, 3)

    def can_move_to(self, target: Position, occupied_positions: Set[Tuple[int, int]]) -> bool:
        """Check if combatant can move to target position."""
        if (target.x, target.y) in occupied_positions:
            return False
        distance = self.position.distance_to(target)
        return distance <= self.get_movement_range()

    def move_to(self, target: Position) -> bool:
        """Move to a new position if valid."""
        if self.moved:
            return False
        self.position = target
        self.moved = True
        return True

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'position': {'x': self.position.x, 'y': self.position.y},
            'team': self.team,
            'current_hp': self.current_hp,
            'current_mp': self.current_mp,
            'max_hp': self.stats.HP,
            'max_mp': self.stats.MP,
            'stats': {
                'HP': self.stats.HP,
                'ATK': self.stats.ATK,
                'DEF': self.stats.DEF,
                'SPD': self.stats.SPD,
                'MP': self.stats.MP,
            },
            'status_effects': self.status_effects,
            'moved': self.moved,
            'actions_used': self.actions_used,
        }


@dataclass
class BoardState:
    """Represents the current state of a battle board."""
    id: str
    combatants: List[Combatant] = field(default_factory=list)
    width: int = 12
    height: int = 12
    current_turn: int = 0
    current_actor_index: int = 0
    turn_order: List[str] = field(default_factory=list)
    state: str = 'setup'  # setup, active, turn_end, finished
    winner: Optional[int] = None

    def add_combatant(self, combatant: Combatant) -> bool:
        """Add a combatant to the board."""
        if self.position_occupied(combatant.position):
            return False
        self.combatants.append(combatant)
        return True

    def position_occupied(self, pos: Position) -> bool:
        """Check if a position is occupied."""
        return any(c.position == pos for c in self.combatants)

    def get_occupied_positions(self) -> Set[Tuple[int, int]]:
        """Get all currently occupied positions."""
        return {(c.position.x, c.position.y) for c in self.combatants}

    def initialize_turn_order(self) -> None:
        """Initialize turn order based on SPD stats."""
        self.turn_order = sorted(
            [c.id for c in self.combatants],
            key=lambda cid: self.get_combatant(cid).stats.SPD,
            reverse=True,
        )
        self.current_actor_index = 0
        self.state = 'active'

    def get_current_actor(self) -> Optional[Combatant]:
        """Get the combatant whose turn it is."""
        if not self.turn_order or self.state != 'active':
            return None
        if self.current_actor_index >= len(self.turn_order):
            return None
        actor_id = self.turn_order[self.current_actor_index]
        return self.get_combatant(actor_id)

    def get_combatant(self, combatant_id: str) -> Optional[Combatant]:
        """Retrieve a combatant by ID."""
        for c in self.combatants:
            if c.id == combatant_id:
                return c
        return None

    def move_combatant(self, combatant_id: str, target: Position) -> bool:
        """Move a combatant to a new position."""
        combatant = self.get_combatant(combatant_id)
        if not combatant:
            return False
        occupied = self.get_occupied_positions()
        occupied.discard((combatant.position.x, combatant.position.y))
        if not combatant.can_move_to(target, occupied):
            return False
        return combatant.move_to(target)

    def resolve_attack(self, attacker_id: str, target_id: str) -> Dict[str, Any]:
        """Resolve an attack between two combatants."""
        attacker = self.get_combatant(attacker_id)
        target = self.get_combatant(target_id)
        if not attacker or not target:
            return {'success': False, 'message': 'Invalid combatant'}

        # Check range (adjacent tiles for melee)
        distance = attacker.position.distance_to(target.position)
        if distance > 1:
            return {'success': False, 'message': 'Target out of range'}

        # D&D-inspired attack resolution
        attack_roll = random.randint(1, 20)
        attack_bonus = (attacker.stats.ATK // 3)
        total_attack = attack_roll + attack_bonus

        defense_bonus = (target.stats.DEF + target.stats.UND) // 3
        defense_dc = 10 + defense_bonus

        hit = total_attack >= defense_dc
        damage = 0

        if hit:
            base_damage = max(1, attacker.stats.ATK // 2)
            damage_roll = random.randint(1, 6)
            damage = base_damage + (damage_roll // 2)

            # Apply defense reduction
            def_reduction = max(0, (target.stats.DEF // 4))
            damage = max(1, damage - def_reduction)

            target.current_hp -= damage

        return {
            'success': hit,
            'attacker': attacker.name,
            'target': target.name,
            'attack_roll': attack_roll,
            'attack_total': total_attack,
            'defense_dc': defense_dc,
            'damage': damage,
            'target_hp_remaining': max(0, target.current_hp),
            'is_defeated': target.current_hp <= 0,
        }

    def end_turn(self) -> None:
        """End current actor's turn and move to next."""
        actor = self.get_current_actor()
        if actor:
            actor.moved = False
            actor.actions_used = 0

        self.current_actor_index += 1

        # Check if round is complete
        if self.current_actor_index >= len(self.turn_order):
            self.current_actor_index = 0
            self.current_turn += 1
            self._check_win_condition()

    def _check_win_condition(self) -> None:
        """Check if battle has ended."""
        team_0_alive = any(c.team == 0 and c.current_hp > 0 for c in self.combatants)
        team_1_alive = any(c.team == 1 and c.current_hp > 0 for c in self.combatants)

        if not team_0_alive:
            self.winner = 1
            self.state = 'finished'
        elif not team_1_alive:
            self.winner = 0
            self.state = 'finished'

    def to_dict(self) -> Dict[str, Any]:
        """Serialize board state to dictionary."""
        return {
            'id': self.id,
            'width': self.width,
            'height': self.height,
            'current_turn': self.current_turn,
            'state': self.state,
            'winner': self.winner,
            'turn_order': self.turn_order,
            'current_actor_id': self.turn_order[self.current_actor_index] if self.current_actor_index < len(self.turn_order) else None,
            'combatants': [c.to_dict() for c in self.combatants],
        }
