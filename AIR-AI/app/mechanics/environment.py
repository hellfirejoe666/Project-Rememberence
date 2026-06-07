from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, Optional


class ActivationState(Enum):
    ACTIVE = 'Active'
    INERT = 'Inert'


@dataclass
class MaterialState:
    name: str
    activation_state: ActivationState = ActivationState.INERT
    mp: int = 0
    spd: int = 0
    owner: Optional[str] = None
    effects: Dict[str, int] = field(default_factory=dict)

    def is_active(self) -> bool:
        return self.activation_state == ActivationState.ACTIVE and self.mp > 0 and self.spd > 0

    def activate(self) -> None:
        if self.mp > 0 and self.spd > 0:
            self.activation_state = ActivationState.ACTIVE

    def deactivate(self) -> None:
        self.activation_state = ActivationState.INERT


@dataclass
class EnvironmentState:
    materials: Dict[str, MaterialState] = field(default_factory=dict)
    ambient_effects: Dict[str, int] = field(default_factory=dict)

    def add_material(self, material: MaterialState) -> None:
        self.materials[material.name] = material

    def get_material(self, name: str) -> Optional[MaterialState]:
        return self.materials.get(name)

    def tick(self) -> None:
        for material in self.materials.values():
            if material.activation_state == ActivationState.INERT and material.spd > 0:
                transfer = min(material.spd, material.mp + material.spd)
                material.mp += transfer
