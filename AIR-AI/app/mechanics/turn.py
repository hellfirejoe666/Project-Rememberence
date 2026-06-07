from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional


class TurnPhase(Enum):
    UPKEEP = 'Upkeep'
    MAIN_PHASE_1 = 'Main Phase 1'
    COMBAT = 'Combat'
    MAIN_PHASE_2 = 'Main Phase 2'
    END_STEP = 'End Step'


@dataclass
class TurnState:
    turn_number: int = 1
    phase: TurnPhase = TurnPhase.UPKEEP
    active_entity: Optional[str] = None
    action_queue: List[Dict[str, Any]] = field(default_factory=list)
    state_data: Dict[str, Any] = field(default_factory=dict)

    def advance_phase(self) -> TurnPhase:
        order = [
            TurnPhase.UPKEEP,
            TurnPhase.MAIN_PHASE_1,
            TurnPhase.COMBAT,
            TurnPhase.MAIN_PHASE_2,
            TurnPhase.END_STEP,
        ]
        current_index = order.index(self.phase)
        next_index = (current_index + 1) % len(order)
        if next_index == 0:
            self.turn_number += 1
        self.phase = order[next_index]
        return self.phase

    def reset_for_next_turn(self) -> None:
        self.phase = TurnPhase.UPKEEP
        self.action_queue.clear()
        self.turn_number += 1
        self.state_data.clear()

    def enqueue_action(self, action: Dict[str, Any]) -> None:
        self.action_queue.append(action)

    def dequeue_action(self) -> Optional[Dict[str, Any]]:
        if not self.action_queue:
            return None
        return self.action_queue.pop(0)
