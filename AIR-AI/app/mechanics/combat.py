from dataclasses import dataclass
from enum import Enum
from typing import Dict, Optional


class RangeCheckResult(Enum):
    WITHIN_PATTERN = 'Within Pattern'
    OUTSIDE_PATTERN = 'Outside Pattern'
    OUT_OF_RANGE = 'Out of Range'


@dataclass
class CombatResolutionResult:
    attacker_damage: int = 0
    defender_damage: int = 0
    critical: Optional[str] = None
    success: bool = False
    details: Optional[str] = None


def calculate_damage(attacker_stats: Dict[str, int], defender_stats: Dict[str, int], use_defense: bool = True) -> int:
    attack_value = attacker_stats.get('ATK', 0)
    compare_value = defender_stats.get('DEF' if use_defense else 'SPD', 0)
    return max(0, attack_value - compare_value)


def resolve_attack(attacker_stats: Dict[str, int], defender_stats: Dict[str, int], range_result: RangeCheckResult) -> CombatResolutionResult:
    result = CombatResolutionResult()
    if range_result == RangeCheckResult.WITHIN_PATTERN:
        damage = calculate_damage(attacker_stats, defender_stats, use_defense=True)
    else:
        damage = calculate_damage(attacker_stats, defender_stats, use_defense=False)
    result.defender_damage = damage
    result.attacker_damage = 0
    result.success = damage > 0
    result.details = f'Attack resolved using {"DEF" if range_result == RangeCheckResult.WITHIN_PATTERN else "SPD"}.'
    return result


def apply_knockback(damage: int, knockback_resistance: int = 0) -> int:
    if damage <= 0:
        return 0
    return max(0, damage - knockback_resistance)
