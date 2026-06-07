from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass
class TierStage:
    name: str
    minimum_level: int
    description: Optional[str] = None


class TierSystem:
    def __init__(self):
        self.stages: List[TierStage] = [
            TierStage('Novice', 1),
            TierStage('Beginner', 10),
            TierStage('Mediate', 100),
            TierStage('Advanced', 1000),
            TierStage('Master', 10000),
            TierStage('Deity', 100000),
        ]

    def get_tier_for_level(self, level: int) -> TierStage:
        selected = self.stages[0]
        for stage in self.stages:
            if level >= stage.minimum_level:
                selected = stage
        return selected

    def is_valid_construct_tier(self, entity_level: int, construct_tier: int) -> bool:
        return construct_tier <= self.get_tier_for_level(entity_level).minimum_level

    def describe_tier_progress(self, level: int) -> Dict[str, str]:
        stage = self.get_tier_for_level(level)
        return {
            'tier': stage.name,
            'level': str(level),
            'description': stage.description or '',
        }
