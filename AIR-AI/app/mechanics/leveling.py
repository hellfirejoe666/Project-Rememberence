from typing import Dict, Optional


def mono_cost_for_level(level: int, progress: float = 1.0) -> int:
    if level < 1:
        raise ValueError('Level must be at least 1')
    progress = max(0.0, min(1.0, progress))
    return int(level * 100 * level * progress)


def stat_points_for_level(level: int) -> int:
    if level < 1:
        return 0
    return 1


def allocate_stat_points(base_stats: Dict[str, int], points: int, distribution: Optional[Dict[str, int]] = None) -> Dict[str, int]:
    allocated = base_stats.copy()
    if not distribution:
        return allocated
    total = sum(distribution.values())
    if total != points:
        raise ValueError('Distribution total must equal available points')
    for stat, value in distribution.items():
        allocated[stat] = allocated.get(stat, 0) + value
    return allocated


def next_level_cost(current_level: int, target_level: int) -> int:
    if target_level <= current_level:
        return 0
    return mono_cost_for_level(target_level, progress=1.0) - mono_cost_for_level(current_level, progress=1.0)
