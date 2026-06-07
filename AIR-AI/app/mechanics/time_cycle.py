from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional


class TimeUnit(Enum):
    MINUTE = 'Minute'
    HOUR = 'Hour'
    DAY = 'Day'
    MONTH = 'Month'
    YEAR = 'Year'


@dataclass
class TimeCycle:
    minute: int = 0
    hour: int = 0
    day: int = 1
    month: int = 1
    year: int = 1
    zodiac_months: List[str] = field(default_factory=lambda: [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ])
    animal_years: List[str] = field(default_factory=lambda: [
        'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
        'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
    ])

    def advance_minutes(self, minutes: int) -> None:
        self.minute += minutes
        while self.minute >= 60:
            self.minute -= 60
            self.hour += 1
        while self.hour >= 24:
            self.hour -= 24
            self.day += 1
        while self.day > 30:
            self.day -= 30
            self.month += 1
        while self.month > 12:
            self.month -= 12
            self.year += 1

    def current_star_sign(self) -> str:
        return self.zodiac_months[(self.month - 1) % len(self.zodiac_months)]

    def current_animal_year(self) -> str:
        return self.animal_years[((self.year - 1) % len(self.animal_years))]

    def get_temporal_alignment(self) -> Dict[str, str]:
        return {
            'animal': self.current_animal_year(),
            'star': self.current_star_sign(),
            'day': str(self.day),
            'month': str(self.month),
            'year': str(self.year),
        }
