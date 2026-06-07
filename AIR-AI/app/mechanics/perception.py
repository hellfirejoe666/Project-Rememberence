from dataclasses import dataclass
from typing import Dict, Optional


@dataclass
class PerceptionCheckResult:
    success: bool
    detail: str
    discovered: Optional[Dict[str, str]] = None


def perform_perception_check(stat_value: int, difficulty: int, critical_threshold: int = 20, failure_threshold: int = 1) -> PerceptionCheckResult:
    if stat_value >= difficulty:
        return PerceptionCheckResult(success=True, detail='Perception check succeeded')
    if stat_value <= failure_threshold:
        return PerceptionCheckResult(success=False, detail='Critical failure on perception check')
    return PerceptionCheckResult(success=False, detail='Perception check failed')
