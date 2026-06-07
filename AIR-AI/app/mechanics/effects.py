from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class CounterEffect:
    name: str
    source: str
    duration: int
    potency: int
    remaining: int
    tags: List[str] = field(default_factory=list)

    def tick(self) -> None:
        if self.remaining > 0:
            self.remaining -= 1

    def is_active(self) -> bool:
        return self.remaining > 0


@dataclass
class EffectManager:
    counters: Dict[str, List[CounterEffect]] = field(default_factory=dict)

    def add_counter(self, target: str, effect: CounterEffect) -> None:
        self.counters.setdefault(target, []).append(effect)

    def tick(self) -> None:
        for target, effects in list(self.counters.items()):
            for effect in effects:
                effect.tick()
            self.counters[target] = [effect for effect in effects if effect.is_active()]

    def get_active_effects(self, target: str) -> List[CounterEffect]:
        return self.counters.get(target, [])

    def reset_target(self, target: str) -> None:
        self.counters.pop(target, None)
