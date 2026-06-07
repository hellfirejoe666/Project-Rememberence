const animalSigns = {
    'Rat': { MNF: 4, SPL: 3, BEU: 1, STR: 0, FND: 1, KNO: 2, UND: 2, WIS: 5, VIT: 3, SEX: 4, DIV: 5, EGO: 6 },
    'Ox': { MNF: 3, SPL: 4, BEU: 0, STR: 1, FND: 2, KNO: 3, UND: 1, WIS: 4, VIT: 2, SEX: 5, DIV: 6, EGO: 5 },
    'Tiger': { MNF: 2, SPL: 5, BEU: 1, STR: 2, FND: 3, KNO: 4, UND: 0, WIS: 3, VIT: 1, SEX: 6, DIV: 5, EGO: 4 },
    'Rabbit': { MNF: 1, SPL: 6, BEU: 2, STR: 3, FND: 4, KNO: 5, UND: 1, WIS: 2, VIT: 0, SEX: 5, DIV: 4, EGO: 3 },
    'Dragon': { MNF: 0, SPL: 5, BEU: 3, STR: 4, FND: 5, KNO: 6, UND: 2, WIS: 1, VIT: 1, SEX: 4, DIV: 3, EGO: 2 },
    'Snake': { MNF: 1, SPL: 4, BEU: 4, STR: 5, FND: 6, KNO: 5, UND: 3, WIS: 0, VIT: 2, SEX: 3, DIV: 2, EGO: 1 },
    'Horse': { MNF: 2, SPL: 3, BEU: 5, STR: 6, FND: 5, KNO: 4, UND: 4, WIS: 1, VIT: 3, SEX: 2, DIV: 1, EGO: 0 },
    'Goat': { MNF: 3, SPL: 2, BEU: 6, STR: 5, FND: 4, KNO: 3, UND: 5, WIS: 2, VIT: 4, SEX: 1, DIV: 0, EGO: 1 },
    'Monkey': { MNF: 4, SPL: 1, BEU: 5, STR: 4, FND: 3, KNO: 2, UND: 6, WIS: 3, VIT: 5, SEX: 0, DIV: 1, EGO: 2 },
    'Rooster': { MNF: 5, SPL: 0, BEU: 4, STR: 3, FND: 2, KNO: 1, UND: 5, WIS: 4, VIT: 6, SEX: 1, DIV: 2, EGO: 3 },
    'Dog': { MNF: 6, SPL: 1, BEU: 3, STR: 2, FND: 1, KNO: 0, UND: 4, WIS: 5, VIT: 5, SEX: 2, DIV: 3, EGO: 4 },
    'Boar': { MNF: 5, SPL: 2, BEU: 2, STR: 1, FND: 0, KNO: 1, UND: 3, WIS: 6, VIT: 4, SEX: 3, DIV: 4, EGO: 5 }
};

const starSigns = {
    'Aries': { MNF: 2, SPL: 1, BEU: 0, STR: 5, FND: 3, KNO: 6, UND: 2, WIS: 3, VIT: 4, SEX: 5, DIV: 1, EGO: 4 },
    'Taurus': { MNF: 3, SPL: 2, BEU: 1, STR: 6, FND: 4, KNO: 5, UND: 1, WIS: 2, VIT: 3, SEX: 4, DIV: 0, EGO: 5 },
    'Gemini': { MNF: 4, SPL: 3, BEU: 2, STR: 5, FND: 5, KNO: 4, UND: 0, WIS: 1, VIT: 2, SEX: 3, DIV: 1, EGO: 6 },
    'Cancer': { MNF: 5, SPL: 4, BEU: 3, STR: 4, FND: 6, KNO: 3, UND: 1, WIS: 0, VIT: 1, SEX: 2, DIV: 2, EGO: 5 },
    'Leo': { MNF: 6, SPL: 5, BEU: 4, STR: 3, FND: 5, KNO: 2, UND: 2, WIS: 1, VIT: 0, SEX: 1, DIV: 3, EGO: 4 },
    'Virgo': { MNF: 5, SPL: 6, BEU: 5, STR: 2, FND: 4, KNO: 1, UND: 3, WIS: 2, VIT: 1, SEX: 0, DIV: 4, EGO: 3 },
    'Libra': { MNF: 4, SPL: 5, BEU: 6, STR: 1, FND: 3, KNO: 0, UND: 4, WIS: 3, VIT: 2, SEX: 1, DIV: 5, EGO: 2 },
    'Scorpio': { MNF: 3, SPL: 4, BEU: 5, STR: 0, FND: 2, KNO: 1, UND: 5, WIS: 4, VIT: 3, SEX: 2, DIV: 6, EGO: 1 },
    'Sagittarius': { MNF: 2, SPL: 3, BEU: 4, STR: 1, FND: 1, KNO: 2, UND: 6, WIS: 5, VIT: 4, SEX: 3, DIV: 5, EGO: 0 },
    'Capricorn': { MNF: 1, SPL: 2, BEU: 3, STR: 2, FND: 0, KNO: 3, UND: 5, WIS: 6, VIT: 5, SEX: 4, DIV: 4, EGO: 1 },
    'Aquarius': { MNF: 0, SPL: 1, BEU: 2, STR: 3, FND: 1, KNO: 4, UND: 4, WIS: 5, VIT: 6, SEX: 5, DIV: 3, EGO: 2 },
    'Pisces': { MNF: 1, SPL: 0, BEU: 1, STR: 4, FND: 2, KNO: 5, UND: 3, WIS: 4, VIT: 5, SEX: 6, DIV: 2, EGO: 3 }
};



const bioToThought = {
    'EGO': { key: 'Environment', sign: -1 },
    'FND': { key: 'Environment', sign: 1 },
    'DIV': { key: 'Emotion', sign: -1 },
    'BEU': { key: 'Emotion', sign: 1 },
    'UND': { key: 'Subconscious', sign: -1 },
    'SPL': { key: 'Subconscious', sign: 1 },
    'SEX': { key: 'Conscious', sign: -1 },
    'MNF': { key: 'Conscious', sign: 1 },
    'WIS': { key: 'Abstraction', sign: -1 },
    'KNO': { key: 'Abstraction', sign: 1 },
    'STR': { key: 'Perception', sign: -1 },
    'VIT': { key: 'Perception', sign: 1 }
};

const speciesData = {
    'Avious': {
        HP: 13, ATK: 4, DEF: 2, SPD: 3, MP: 17, Move: 'Diag',
        traits: {
            active: [
                'Horus: The caster\'s MP recovers each turn equal to UND for a number of turns equal to UND.',
                'Messenger: The caster\'s SPD is increased by UND until end of turn as long as the caster is not currently targeted.',
                'Visions: The caster may increase their DEF or SPD up to UND when blocking or dodging.',
                'Arise: If this spirit would be destroyed this turn, an amount of MP up to UND may be converted to HP and may not be recovered for a number of turns equal to UND.',
                'Omen: The target\'s SPD is reduced by the caster\'s UND for a number of turns equal to UND.',
                'Whisper: The caster may move an additional number of spaces within their movement pattern up to UND without consuming SPD.'
            ],
            passive: [
                'Insight: These spirits may make a number of additional perception checks per turn equal to DIV.',
                'Earthbound: These spirits lose SPD equal to FND when evading indoors.'
            ]
        }
    },
    'Merr': {
        HP: 12, ATK: 3, DEF: 4, SPD: 2, MP: 18, Move: 'Corner Lateral',
        traits: {
            active: [
                'Siren: ATK and SPD are increased by WIS until end of turn.',
                'Currents: The caster\'s SPD is multiplied by WIS until end of turn but they may not block while this effect is active.',
                'Pressure: The caster may declare an additional target for each point of damage up to WIS they inflict this turn.',
                'Lure: The caster may force themselves to be the target of attacks for a number of turns equal to WIS.',
                'Echo: The caster may increase their MP up to WIS for each combat action this turn.',
                'Abyss: For a number of turns equal to WIS, targets within the caster\'s movement pattern may not target anything.'
            ],
            passive: [
                'Depths: When becoming the target of an attack, this spirit may prevent an amount of damage up to SPL once per turn.',
                'Lament: When declared the target of more attacks this turn than FND, reduce this spirit\'s DEF by FND.'
            ]
        }
    },
    'Geneshan': {
        HP: 18, ATK: 2, DEF: 5, SPD: 2, MP: 12, Move: 'Lateral',
        traits: {
            active: [
                'Revitalize: The caster\'s HP recovers each turn equal to MNF for a number of turns equal to MNF.',
                'Restore: The caster may reduce or increase the number of counters on a target up to MNF.',
                'Resolve: The caster\'s DEF is increased by MNF for a number of turns equal to MNF; allies gain half that.',
                'Recurrence: Once per turn, the caster may reduce their HP or MP to MNF while increasing the other by the difference.',
                'Harmony: The caster may choose a number of allied spirits up to MNF who gain MP per turn equal to MNF for a number of turns equal to MNF.',
                'Nurtue: The caster may increase the DEF of allied tokens and constructs by MNF for a number of turns equal to MNF.'
            ],
            passive: [
                'Embrace: Once per turn, this spirit may increase the HP of a target by BEU.',
                'Burden: When destroying another entity, this spirit\'s SPD is reduced by VIT until end of turn.'
            ]
        }
    },
    'Iniris': {
        HP: 10, ATK: 2, DEF: 1, SPD: 6, MP: 20, Move: 'Diag',
        traits: {
            active: [
                'Lucky: The caster\'s SPD is increased by UND until end of turn.',
                'Misfortune: The target\'s SPD is reduced by UND until their next turn.',
                'Whimsy: The caster may not be targeted from outside their attack pattern for a number of turns equal to UND.',
                'Opportunity: The caster may prevent the combat step if the target\'s Level is less than UND.',
                'Unpredictable: The caster may swap the target\'s SPD with the caster\'s UND for a number of turns up to UND.',
                'Predetermine: The caster may invert any combat or non-combat check if the value of that check is less than UND.'
            ],
            passive: [
                'Favor: Once per turn, flip a coin; if successful, this spirit may increase any non-combat check by SPL.',
                'Whim: Once per turn, flip a coin; if unsuccessful, this spirit has any non-combat checks reduced by SPL.'
            ]
        }
    },
    'Reptoid': {
        HP: 20, ATK: 4, DEF: 2, SPD: 3, MP: 10, Move: 'Lateral',
        traits: {
            active: [
                'Imitate: The caster may use the target\'s Type rather than their own for a number of turns equal to MNF.',
                'Spite: The target loses HP equal to MNF for a number of turns equal to MNF as long as the caster doesn\'t attack.',
                'Shedding: The caster may adopt a target\'s total HP for a number of turns equal to MNF.',
                'Plots: The caster may reduce the target\'s SPD by MNF for a number of turns equal to MNF.',
                'Lenses: The caster may increase SPD by MNF for a number of turns equal to MNF as long as they are outside combat.',
                'Edge: The caster may swap their ATK or SPD with DEF for a number of turns equal to MNF.'
            ],
            passive: [
                'Guile: This spirit increases any non-combat check by SPL if the target has a positive loyalty rating.',
                'Ambition: This spirit loses loyalty equal to SPL for all entities and factions each turn.'
            ]
        }
    },
    'Wolfin': {
        HP: 17, ATK: 5, DEF: 2, SPD: 2, MP: 13, Move: 'Corner Diagonal',
        traits: {
            active: [
                'Howl: ATK/DEF/SPD is increased by DIV until end of turn.',
                'Tactics: The caster may select a number of allies up to DIV within its movement pattern who gain DEF equal to DIV until end of turn.',
                'Scent: The caster may increase their ATK or DEF by DIV as long as their SPD is greater than the target\'s SPD.',
                'Instinct: The caster may decrease any combat or non-combat check by twice DIV for an automatic Critical Hit.',
                'Lunar: The caster may increase a target\'s MP by DIV for a number of turns equal to DIV until the target becomes the target of an attack.',
                'Bark: The caster may increase their ATK by twice DIV when defending.'
            ],
            passive: [
                'Bond: Allies within the movement pattern of this spirit gain ATK up to MNF divided between those affected.',
                'Primal: If a hostile entity with DEF lower than this spirit\'s ATK is within this spirit\'s attack pattern, they must be targeted.'
            ]
        }
    },
    'Goki': {
        HP: 16, ATK: 4, DEF: 3, SPD: 2, MP: 14, Move: 'Omni',
        traits: {
            active: [
                'Pride: ATK and DEF are increased by EGO until end of turn.',
                'Challenge: The caster may choose a target who may then only attack the caster for a number of turns equal to EGO.',
                'Stance: The caster may increase their DEF by double EGO but may not move either.',
                'Humility: The caster may reduce their HP by EGO to increase a target\'s HP by EGO.',
                'Withdrawal: If the target\'s HP is less than the caster\'s HP, the caster may increase their SPD by EGO for a number of turns equal to EGO.',
                'Victory: The caster may increase their ATK/DEF/SPD by EGO for each attack this turn as long as the caster doesn\'t take HP damage.'
            ],
            passive: [
                'Unyielding: Each time this spirit takes damage when HP is below half, this spirit\'s ATK and DEF are increased by STR until end of turn.',
                'Competitive: When losing any combat or non-combat check, this spirit loses MP equal to the value of the check.'
            ]
        }
    },
    'Tigris': {
        HP: 14, ATK: 3, DEF: 2, SPD: 4, MP: 16, Move: 'Lateral',
        traits: {
            active: [
                'Stalk: The caster\'s SPD and DEF are increased by SPL until end of turn.',
                'Wild-Heart: The caster may increase the ATK and SPD of allies or reduce the DEF and SPD of hostiles by SPL until end of turn.',
                'Inspire: The caster may increase a target\'s combat and non-combat checks by SPL once per turn.',
                'Prowl: Increase the caster\'s SPD by twice SPL for a number of turns equal to SPL unless the caster becomes the target of an attack.',
                'Tenacity: Increase the caster\'s DEF by twice SPL for a number of turns equal to SPL unless the caster declares an attack.',
                'Predator: The caster may change their movement pattern to one of either Diagonal or Corner Diagonal for a number of turns equal to SPL.'
            ],
            passive: [
                'Mystery: Allied spirits within the movement pattern of this spirit gain MP equal to FND each turn they don\'t attack.',
                'Aloof: After three successful combat or non-combat checks in a row, this spirit automatically has a Critical Failure.'
            ]
        }
    },
    'Demon': {
        HP: 19, ATK: 6, DEF: 1, SPD: 2, MP: 11, Move: 'Corner Lateral',
        traits: {
            active: [
                'Spawn: Conjure a number of demon tokens amounting to DIV, who have ATK/DEF/SPD equal to DIV.',
                'Pact: The caster may reduce their HP by DIV and choose a target who will take damage instead of the caster until end of turn.',
                'Grasp: The caster may choose a number of targets in their attack pattern up to DIV who have their SPD reduced by DIV for a number of turns equal to DIV.',
                'Rend: If the target takes damage this turn, then they also lose MP equal to the damage up to twice the caster\'s DIV.',
                'Disorder: Targets in the caster\'s movement pattern may not attack the caster for a number of turns equal to DIV.',
                'Deception: The caster may increase any combat or non-combat check by DIV as long as their DIV is higher than the target\'s Level.'
            ],
            passive: [
                'Compel: If a target within this spirit\'s movement pattern has DEF lower than SPL, their DEF is reduced by SPL until end of turn.',
                'Unstable: If an ability would cost MP greater than SPL, then MP and SPD are reduced by SPL.'
            ]
        }
    },
    'Grimm': {
        HP: 14, ATK: 2, DEF: 4, SPD: 3, MP: 16, Move: 'Diag',
        traits: {
            active: [
                'Reap: Full essences carried by the caster may be summoned as tokens amounting to WIS.',
                'Ferryman: Reduce the target\'s HP by WIS and increase their SPD by WIS for a number of turns equal to WIS.',
                'Recurrence: The target takes damage equal to WIS when they deal damage for a number of turns equal to WIS.',
                'Cloak: Increase a target\'s DEF up to WIS for a number of turns equal to WIS as long as they don\'t take damage.',
                'Requiem: Reduce a target\'s SPD by WIS and increase their ATK by WIS for a number of turns equal to WIS.',
                'Mistwalk: The target may move through a number of objects equal to WIS while their HP is reduced by WIS for a number of turns equal to WIS.'
            ],
            passive: [
                'Soulbound: When an entity is destroyed within this spirit\'s movement pattern, they gain MP up to DIV.',
                'Wayward: If HP is less than half, then this spirit loses MP equal to WIS each turn.'
            ]
        }
    },
    'Drakian': {
        HP: 17, ATK: 5, DEF: 2, SPD: 2, MP: 13, Move: 'Omni',
        traits: {
            active: [
                'Resurgence: If HP is less than MP, the difference up to DIV may be removed from MP and added to HP.',
                'Collector: Increase the caster\'s ATK by DIV for a number of turns equal to DIV as long as the caster has a number of counters greater than DIV.',
                'Breath: The caster may deal additional damage to a target up to twice DIV while reducing the caster\'s DEF by DIV for a number of turns equal to DIV.',
                'Scales: Increase the caster\'s DEF by DIV for a number of turns equal to DIV and they may not use MP during this time.',
                'Mindwalk: The caster may gain MP equal to DIV when succeeding in a check with a value greater than DIV.',
                'Dominate: Reduce the target\'s ATK by DIV and increase their SPD by DIV until end of turn.'
            ],
            passive: [
                'Legacy: This spirit gains MP each turn equal to half WIS for each ally within their movement pattern and if their MP is max, their HP increases instead.',
                'Greed: If this spirit ends its turn with a number of counters greater than WIS, reduce this spirit\'s MP by twice WIS and remove half that many counters.'
            ]
        }
    },
    'Chimera': {
        HP: 21, ATK: 3, DEF: 4, SPD: 2, MP: 9, Move: 'Lateral',
        traits: {
            active: [
                'Amalgamate: ATK/DEF/SPD are increased by half of target\'s ATK/DEF/SPD multiplied by half DIV.',
                'Distort: Reduce the target\'s SPD by DIV and increase the caster\'s SPD by half that.',
                'Emulate: The effect of this ability becomes the target active effect for a number of turns equal to DIV.',
                'Ethereal: Targets within the caster\'s movement pattern may take additional damage equal to DIV and the caster\'s DEF is reduced by DIV for a number of turns equal to DIV.',
                'Alchemy: The target may not be targeted by spells or abilities for a number of turns equal to DIV as long as the caster doesn\'t move either.',
                'Crisis: The target may choose one of ATK/DEF/SPD and reduce it by the caster\'s DIV for a number of turns equal to DIV.'
            ],
            passive: [
                'Adaptation: At the beginning of each turn, increase one of the ATK/DEF/SPD of the caster by FND as long as the ATK/DEF/SPD of an entity in their movement pattern is higher.',
                'Disruptive: If this spirit ends its turn without using an ability, it loses MP equal to FND.'
            ]
        }
    },
    'Mannequin': {
        HP: 8, ATK: 1, DEF: 2, SPD: 6, MP: 22, Move: 'Corner Diagonal',
        traits: {
            active: [
                'Unmoving: SPD is converted into DEF until the caster\'s next turn.',
                'Voidwalk: This spirit may negate the combat step for a number of turns equal to MNF.',
                'Puppeteer: Reduce a target\'s ATK or SPD by MNF for a number of turns equal to MNF.',
                'Absence: The caster may spawn a number of tokens up to MNF with HP/SPD equal to MNF that must be the target of hostile attacks for a number of turns equal to MNF.',
                'Silence: Targets within the caster\'s movement pattern may not Charge for a number of turns equal to MNF.',
                'Faceless: The caster receives half damage and the target may not use abilities for a number of turns equal to MNF but the caster loses HP while the target gains MP equal to MNF for the duration.'
            ],
            passive: [
                'Presence: This spirit may reduce damage by an amount up to DIV if their MP is full.',
                'Emptiness: If this spirit ends more than three turns without using an ability, their HP is reduced by DIV.'
            ]
        }
    },
    'Pixie': {
        HP: 9, ATK: 4, DEF: 2, SPD: 3, MP: 21, Move: 'Diag',
        traits: {
            active: [
                'Mischief: Choose one of target\'s ATK/DEF/SPD and replace it with caster\'s SPL until end of turn.',
                'Glimmer: For a number of turns equal to SPL, the caster may target entities with effects cast for less than SPL that would otherwise prevent it.',
                'Feywalk: Reduce the target\'s DEF by SPL for a number of turns equal to SPL if the target is within the caster\'s movement pattern.',
                'Afterimage: Spawn a token with HP equal to SPL until end of turn; any damage the caster would receive this turn is applied to the token instead.',
                'Dreamweaver: For a number of turns equal to SPL, the caster may spawn one object token per turn with the active effects of a target in their movement pattern.',
                'Stageplay: For a number of turns equal to SPL, the caster\'s SPD is increased by SPL and their attacks ignore DEF but they may not activate other abilities.'
            ],
            passive: [
                'Fey Sight: Increase this spirit\'s SPD by DIV if an ability was used within their movement pattern this turn.',
                'Capricious: If this spirit ends their turn without using an ability, reduce their ATK by DIV until their next turn.'
            ]
        }
    },
    'Grizzly': {
        HP: 23, ATK: 2, DEF: 4, SPD: 3, MP: 7, Move: 'Lateral',
        traits: {
            active: [
                'Roar: Target\'s DEF is reduced by the caster\'s STR until end of turn.',
                'Protective: For a number of turns equal to STR, increase the caster\'s DEF by STR while reducing their SPD by half that.',
                'Advance: Increase the caster\'s ATK by STR for each point of SPD used to advance on the target; their next attack is automatically a Critical Failure.',
                'Paternal: For a number of turns equal to STR, an ally in the caster\'s movement pattern may reduce damage taken by half and the caster gains ATK equal to half that.',
                'Brace: For a number of turns equal to STR, the caster is immune to knockback up to STR and their DEF is increased by STR.',
                'Courage: Decrease the ATK of all hostile entities within your attack pattern and increase the DEF of all allied entities within your movement pattern.'
            ],
            passive: [
                'Resilient: This spirit\'s HP is increased up to VIT when dealing damage with melee attacks.',
                'Overprotective: If an ally in this spirit\'s movement pattern takes damage, this spirit\'s DEF is reduced by VIT and their ATK is increased by VIT.'
            ]
        }
    },
    'Faun': {
        HP: 7, ATK: 2, DEF: 1, SPD: 6, MP: 23, Move: 'Corner Diagonal',
        traits: {
            active: [
                'Misdirection: Negate target attack if the caster\'s DIV is greater than the attacker\'s ATK.',
                'Enlighten: Increase the target\'s next combat or non-combat check by twice DIV and all other checks this turn are automatically critical failures.',
                'Mystic: The caster may increase their SPD up to DIV for a number of turns equal to DIV when targeted.',
                'Totem: Once per turn, the caster may spawn a token with HP/SPD equal to DIV that must be the target of hostile attacks for a number of turns equal to DIV.',
                'Secrets: Once per turn, the caster may negate target effect cast for less than DIV or reduce a number of counters equal to DIV.',
                'Riddle: The caster may swap their DEF for a target\'s SPD for a number of turns equal to DIV as long as the caster doesn\'t attack during that time.'
            ],
            passive: [
                'Seeker: When searching an area, this spirit gains SPD equal to WIS for a number of turns equal to WIS.',
                'Overthinking: When entering combat, this spirit\'s SPD is reduced by WIS for a number of turns equal to WIS.'
            ]
        }
    },
    'Vampyre': {
        HP: 14, ATK: 4, DEF: 2, SPD: 3, MP: 16, Move: 'Corner Lateral',
        traits: {
            active: [
                'Drain: When dealing damage to a target, the caster may restore their HP by an amount up to their MNF.',
                'Harvest: For a number of turns equal to MNF, the caster may increase their ATK by MNF times the number of entities they destroy during that time.',
                'Nightwalk: The caster may increase their SPD by twice MNF at night.',
                'Seduce: A target in the caster\'s attack pattern has their SPD reduced by MNF and their HP is restored by MNF for a number of turns equal to MNF.',
                'Mistborn: The caster is immune to physical damage but nonphysical damage is doubled until end of turn.',
                'Seal: The caster becomes linked to the target where all HP increases and decreases from any source are shared between them.'
            ],
            passive: [
                'Hunger: This spirit gains MP each turn equal to the amount of damage they dealt in their previous turn.',
                'Photophobia: This spirit has their ATK/DEF/SPD reduced by an amount equal to their MP during the day.'
            ]
        }
    },
    'Grey': {
        HP: 16, ATK: 2, DEF: 4, SPD: 3, MP: 14, Move: 'Diag',
        traits: {
            active: [
                'Rebirth: If the caster would be destroyed this turn and their MP is greater than DIV, then they may convert their MP, up to DIV, into HP and continue as if they had not been destroyed.',
                'Witness: Decrease a target\'s DEF by DIV or increase the caster\'s SPD by DIV for a number of turns equal to DIV.',
                'Blackhole: The caster may negate target ability or active effect cast for less than DIV once per turn if their MP is full.',
                'Memories: For a number of turns equal to DIV, negate all critical success/failures with the caster whose non-critical total was less than DIV.',
                'Creation: Spawn a number of tokens equal to DIV with ATK/DEF/SPD equal to DIV for a number of turns equal to DIV; damage that would be dealt to them is dealt to the caster instead.',
                'Oblivion: All targets in the caster\'s movement pattern have their SPD reduced by DIV while their ATK and DEF increased by DIV and they must attack allies for a number of turns equal to DIV.'
            ],
            passive: [
                'Primordial: This spirit gains MP per turn equal to the number of active effects in their movement pattern and when their MP is full, they gain HP instead.',
                'Incomprehensible: Every third check with this spirit is a Critical Failure where all damage to or from this spirit is negated until end of turn.'
            ]
        }
    },
    'Chrono': {
        HP: 12, ATK: 3, DEF: 4, SPD: 2, MP: 18, Move: 'Lateral',
        traits: {
            active: [
                'Regress: The target may not attack for a number of turns equal to DIV as long as the caster does not either.',
                'Shifting: The caster may relocate any entity in their movement pattern to anywhere in their attack pattern within a number of spaces equal to DIV.',
                'Timewalk: The caster may choose one of ATK/DEF/SPD for a target where that value is either increased or decreased by the caster\'s DIV until end of turn.',
                'Foresight: The caster gains DIV for each combat and non-combat check performed by the caster while this effect is active and their SPD is increased by half DIV for a number of turns equal to DIV.',
                'Temporal: The caster may target an area where no damage is dealt within this area for a number of turns equal to DIV.',
                'Entropy: If the caster deals physical damage to a target this turn, the target loses HP equal to DIV each time the caster deals damage to them for a number of turns equal to half DIV.'
            ],
            passive: [
                'Timeless: This spirit gains MP each turn equal to the number of checks in the previous turn.',
                'Flux: Every third action by this spirit is a Critical Failure and they may not activate any abilities or be targeted until end of turn.'
            ]
        }
    },
    'Gargoyle': {
        HP: 21, ATK: 4, DEF: 1, SPD: 4, MP: 9, Move: 'Omni',
        traits: {
            active: [
                'Thick Skin: DEF is increased by twice STR until end of turn.',
                'Stoneform: The caster may convert all their ATK and SPD to DEF for a number of turns equal to STR.',
                'Darkness: The caster may increase their ATK and DEF by STR for a number of turns equal to STR while undetected.',
                'Quiet: Once per turn, as long as this effect is active, the caster may negate one spell or ability cast for less than STR for a number of turns equal to STR.',
                'Arcanus: Reduce a target\'s DEF by twice STR for a number of turns equal to STR as long as the caster remains undetected; otherwise, the caster takes damage equal to STR.',
                'Deterrent: The caster may increase an ally\'s DEF and SPD by STR until they receive damage, where the effect ends and twice that damage is dealt to the damage source instead.'
            ],
            passive: [
                'Ceremonial: This spirit gains an amount HP equal to FND each turn until it is full, where they regenerate MP instead.',
                'Accursed: While this spirit is in light, their SPD and ATK are reduced by twice FND while their DEF is increased by FND.'
            ]
        }
    },
    'Mimic': {
        HP: 5, ATK: 3, DEF: 1, SPD: 5, MP: 25, Move: 'Corner Lateral',
        traits: {
            active: [
                'Copy: The caster\'s ATK/DEF/SPD becomes the same as the target\'s for a number of turns equal to SPL.',
                'Disguise: The caster may not attack or be attacked for a number of turns equal to SPL; the caster takes damage equal to SPL each turn during this time.',
                'Camouflage: The caster gains SPD equal to SPL while undetected and gains DEF equal to SPL while detected for a number of turns equal to SPL.',
                'Panic: A target in the caster\'s movement pattern chooses one of ATK/DEF/SPD, which is then reduced by the number of counters on them for a number of turns equal to SPL.',
                'Domain: The caster may target an area where no allies may be targeted and enemies may only attack each other, and the caster loses HP equal to the number of targets within the area for a number of turns equal to SPL.',
                'Polymorph: The caster may reduce a target\'s SPD or ATK by SPL while increasing their DEF by SPL for a number of turns equal to SPL.'
            ],
            passive: [
                'Inconspicuous: While undetected, this spirit gains SPD equal to EGO and each turn it remains undetected, it may remove a number of counters equal to EGO.',
                'Revelation: When this spirit ends their turn with a number of counters greater than EGO, they lose MP equal to EGO until it is empty, where they lose HP instead.'
            ]
        }
    },
    'Elf': {
        HP: 13, ATK: 4, DEF: 3, SPD: 2, MP: 17, Move: 'Diag',
        traits: {
            active: [
                'Lifeforce: A target gains HP equal to the caster\'s DIV.',
                'Linguist: The caster\'s next combat or non-combat check is automatically a Critical Success, but they can\'t perform a Critical Success for a number of turns equal to DIV.',
                'Oracle: A target\'s DEF is reduced by DIV and their SPD is increased by DIV while within the caster\'s movement pattern for a number of turns equal to DIV.',
                'Cosmos: The caster gains MP equal to the number of active effects in their movement pattern for a number of turns equal to DIV.',
                'Enchantment: The caster may move a number of counters up to DIV from a target within their movement pattern and apply those counters to another target in their attack pattern.',
                'Mythril: A number of allies up to DIV within the caster\'s movement pattern are immune to non-physical damage for a number of turns equal to DIV.'
            ],
            passive: [
                'Manawalk: This spirit may reduce damage by an amount up to KNO if their MP is full.',
                'Sensitive: Non-physical damage on this spirit is doubled as long as their MP is not full.'
            ]
        }
    },
    'Ghoul': {
        HP: 6, ATK: 6, DEF: 2, SPD: 1, MP: 24, Move: 'Diag',
        traits: {
            active: [
                'Feast: If the caster destroys a target this turn, they may take another action and their ATK/DEF/SPD is increased by MNF.',
                'Vengeance: If the caster is dealt damage this turn, they may add that amount up to MNF to their next combat or non-combat check.',
                'Frenzied: For a number of turns equal to MNF, the caster\'s ATK is increased and their DEF is decreased by MNF for each time they deal damage.',
                'Graverobber: The caster may consume any Essence in their inventory to increase their ATK/DEF/SPD by the values of that Essence for a number of turns equal to MNF.',
                'Carrion: The caster may spawn a number of Ghoul tokens equal to MNF, and the caster\'s HP is reduced by MNF for each token spawned in this way.',
                'Darkstalker: While this effect is active, either the caster is immune to physical damage or they are immune to non-physical damage for a number of turns equal to MNF.'
            ],
            passive: [
                'Madness: This spirit gains HP each turn equal to the number of entities destroyed in the previous turn.',
                'Starvation: If the caster doesn\'t destroy another entity for a number of turns greater than STR, they receive damage equal to half their ATK each turn.'
            ]
        }
    },
    'Bastet': {
        HP: 24, ATK: 4, DEF: 2, SPD: 3, MP: 6, Move: 'Lateral',
        traits: {
            active: [
                'Guide: Target\'s SPD is increased by the caster\'s SPL until end of turn.',
                'Cateye: The caster may search objects and entities within a number of spaces equal to SPL.',
                'Nimble: The caster may increase a target\'s SPD by SPL while reducing their own ATK by SPL for a number of turns equal to SPL.',
                'Pounce: The caster may jump to any target in their movement pattern within a number of spaces equal to SPL without using SPD.',
                'Spiritwalk: Target ally spirit gains DEF equal to twice SPL, and any damage they receive is doubled and applied to the caster instead.',
                'Depart: For a number of turns equal to SPL, if an entity is destroyed within the caster\'s movement pattern, the caster gains ATK and SPD equal to SPL as long as this effect is active.'
            ],
            passive: [
                'Nine Lives: Once per turn, if this entity would be destroyed, they may instead set their HP to 1 and all counters to 0.',
                'Curiosity: This spirit loses MP equal to the number of active effects in their movement pattern each turn until their MP is depleted, where they lose HP instead.'
            ]
        }
    },
    'Phantom': {
        HP: 18, ATK: 5, DEF: 1, SPD: 3, MP: 12, Move: 'Corner Diagonal',
        traits: {
            active: [
                'Vanish: The caster may not be targeted, but they may not move either.',
                'Retrospect: The caster may remove a number of Memory counters to reduce the DEF or SPD of a target in their movement pattern by that amount.',
                'Intangible: The caster may remove a number of Memory counters to move through that many objects.',
                'Haunt: The caster may remove a number of Memory counters to reduce a target\'s MP by twice that much.',
                'Possession: The caster may remove a number of Memory counters to control any entity whose level is less than half that.',
                'Unresolved: The caster may remove a number of Memory counters to increase their ATK/DEF/SPD by half that.'
            ],
            passive: [
                'Phantasmal: Once per turn, this spirit negates damage dealt to it and gains a number of Memory counters equal to the damage negated in this way.',
                'Lingering: If this spirit ends two or more turns with no Memory counters on it, they receive damage equal to half their ATK.'
            ]
        }
    },
    'Banshee': {
        HP: 12, ATK: 3, DEF: 2, SPD: 4, MP: 18, Move: 'Corner Lateral',
        traits: {
            active: [
                'Wail: The target\'s SPD and DEF is reduced by the caster\'s VIT.',
                'Scream: The caster may increase any non-combat check by VIT, but their next combat check will be a Critical Failure.',
                'Despair: The caster may target an area where hostile entities have their SPD reduced by VIT and take damage equal to VIT each turn.',
                'Gaze: The caster may reduce the target\'s DEF by twice VIT for a number of turns equal to VIT, and when the effect ends, the caster takes damage equal to VIT.',
                'Suffer: Targets within the caster\'s movement pattern lose MP equal to VIT, and the caster gains HP equal to VIT for a number of turns equal to VIT.',
                'Mourning: For a number of turns equal to VIT, the target takes damage equal to the amount of SPD they use.'
            ],
            passive: [
                'Sorrow: This spirit gains DEF equal to the number of effects they activated in the previous turn as long as their HP is less than half.',
                'Vengeful: If this spirit\'s HP is more than half, they may not activate a Critical Success.'
            ]
        }
    },
    'Angel': {
        HP: 25, ATK: 1, DEF: 4, SPD: 4, MP: 5, Move: 'Lateral',
        traits: {
            active: [
                'Grace: The caster\'s MP is recovered by DIV for a number of turns equal to DIV.',
                'Intervention: The caster may negate target spell or ability cast for less than DIV.',
                'Illuminate: The caster may reduce the DEF of a target in their movement pattern by an amount equal to DIV until end of turn.',
                'Vigor: The caster may increase the HP of a target equal to DIV unless the target\'s HP is full, where they remove a number of counters instead.',
                'Judgement: The caster may deal additional damage to a target equal to DIV until end of turn.',
                'Hope: For a number of turns equal to DIV, allied spirits in the caster\'s movement pattern gain DEF equal to DIV.'
            ],
            passive: [
                'Divinity: This spirit gains Divine counters each turn equal to DIV when MP is full and may spend these counters to increase any combat or non-combat check.',
                'Responsibility: If this spirit has no Divine counters on them at the beginning of their next turn, their SPD and MP are reduced to 0 until end of turn.'
            ]
        }
    },
    'Human': {
        HP: 15, ATK: 3, DEF: 3, SPD: 3, MP: 15, Move: 'Omni',
        traits: {
            active: [
                'Indomitable: The caster\'s ATK and DEF are increased by STR until end of turn.',
                'Innovate: The caster may increase the HP or DEF of an allied object or entity within their movement pattern equal to STR.',
                'Adapt: The effect of this ability becomes the same as the target effect but activated with STR for a number of turns equal to half STR.',
                'Collaborate: For each other allied entity in the caster\'s movement pattern, increase all checks by STR.',
                'Overcome: When the caster\'s HP is less than half, they may increase their DEF by STR for a number of turns equal to STR.',
                'Explore: For a number of turns equal to STR, the caster may increase their MP by the number of perception checks they performed in the previous turn.'
            ],
            passive: [
                'Curious: This spirit may increase any combat or non-combat check by KNO if they activated an effect in their last turn.',
                'Hubris: This spirit automatically has a Critical Failure on all checks if they activated a number of abilities greater than KNO in their last turn.'
            ]
        }
    },
    'Jackal': {
        HP: 11, ATK: 2, DEF: 1, SPD: 6, MP: 19, Move: 'Corner Lateral',
        traits: {
            active: [
                'Deathless: If the caster\'s HP would fall to 0 and MP is more than half, then they may increase HP by MNF.',
                'Corrupt: Reduce the DEF of an entity within the caster\'s movement pattern for a number of turns equal to MNF.',
                'Fearmonger: A target may not attack the caster for a number of turns equal to MNF.',
                'Reaver: If the caster destroys a target this turn, increase their ATK/DEF by MNF until their next turn.',
                'Devoid: The caster may spawn a number of Jackal tokens up to MNF for a number of turns equal to MNF who will attack each turn if able.',
                'Sanguine: For a number of turns equal to MNF, the caster may increase their ATK by MNF but reduces their HP by MNF.'
            ],
            passive: [
                'Survivor: This spirit gains HP/MP equal to half of damage dealt in the previous turn.',
                'Volatile: If this spirit spends more MP in a turn than twice their DIV, their HP is reduced by twice DIV and that check becomes a critical failure.'
            ]
        }
    },
    'Troll': {
        HP: 25, ATK: 2, DEF: 5, SPD: 2, MP: 5, Move: 'Lateral',
        traits: {
            active: [
                'Rampage: The caster\'s ATK and SPD are increased by VIT until end of turn.',
                'Rejuvenate: For a number of turns equal to VIT, if the caster receives damage while this effect is active, they may recover HP up to VIT after damage calculation.',
                'Berserk: Increase the caster\'s ATK by twice VIT and reduce their DEF by twice VIT.',
                'Devour: After consuming a food item, the caster may multiply their DEF by VIT until end of turn.',
                'Stampede: If the caster received damage this turn, they may increase their SPD and ATK by twice VIT but lose MP equal to the damage they deal under this effect.',
                'Hoards: The caster may spawn a number of Troll tokens with ATK/DEF/SPD equal to VIT who are granted the same active traits as the caster.'
            ],
            passive: [
                'Toughness: This spirit regenerates HP each turn they are dealt damage equal to half the damage dealt.',
                'Uncontrolled: This spirit loses MP equal to EGO each turn and if they end their turn with no MP, they receive damage equal to EGO.'
            ]
        }
    },
    'Dwarf': {
        HP: 26, ATK: 3, DEF: 4, SPD: 2, MP: 4, Move: 'Omni',
        traits: {
            active: [
                'Invention: The caster\'s MP is recovered by KNO for a number of turns equal to KNO.',
                'Craftsman: The caster may increase the DEF of a target by KNO for a number of turns equal to KNO, and the caster loses MP equal to KNO each turn this effect is active.',
                'Ancestral: The caster may boost all non-combat checks by KNO, reduce their DEF by KNO, and increase their SPD by KNO until end of turn.',
                'Enduring: For a number of turns equal to KNO, the caster may increase their DEF by twice KNO, but any damage they receive is doubled.',
                'Ageless: The caster may spawn a number of Dwarf tokens with ATK/DEF/SPD equal to KNO for a number of turns equal to KNO who are granted the same active traits as the caster.',
                'Philosopher: The caster may increase one of ATK/DEF/SPD by KNO until end of turn as long as they have not received damage this turn.'
            ],
            passive: [
                'Resilient: This spirit may increase all combat and non-combat checks by FND as long as their last two checks of any kind were successful.',
                'Obsessive: If this spirit has three consecutive successful checks of any kind, their next check is a Critical Failure.'
            ]
        }
    },
    'Goblin': {
        HP: 6, ATK: 1, DEF: 2, SPD: 6, MP: 24, Move: 'Corner Lateral',
        traits: {
            active: [
                'Elude: The caster\'s SPD is increased by twice SEX until end of turn.',
                'Blindstrike: The caster may multiply their ATK by SEX as long as they remain undetected under this effect.',
                'Vengeful: The caster may increase their SPD and ATK by twice SEX if they receive damage while this effect is active.',
                'Nefarious: The caster may reduce the SPD or DEF of any target in their movement pattern by SEX as long as those attributes are higher than the caster\'s.',
                'Multitude: The caster may spawn a number of Goblin tokens equal to SEX for a number of turns equal to SEX during which the caster may not be targeted.',
                'Occulted: The caster may increase any non-combat checks by SEX as long as they haven\'t been in combat for a number of turns equal to SEX.'
            ],
            passive: [
                'Evasive: This spirit increases their SPD equal to the number of entities in their movement pattern.',
                'Skittish: After activating three or more spells or abilities, their next spell or ability is automatically a critical failure.'
            ]
        }
    },
    'Imp': {
        HP: 22, ATK: 4, DEF: 1, SPD: 4, MP: 8, Move: 'Corner Diagonal',
        traits: {
            active: [
                'Absolution: The caster\'s ATK/DEF/SPD are increased by WIS until end of turn.',
                'Deceptive: The caster can reduce any combat or non-combat check by their WIS as long as they are not involved in the check.',
                'Loyal: For a number of turns equal to WIS, the caster may increase their DEF by WIS when blocking for allies or increase their ATK by WIS when attacking.',
                'Insightful: The caster may increase any non-combat check for allies in their movement pattern by WIS.',
                'Escapist: For a number of turns equal to WIS, the caster may increase their SPD by WIS for each successful dodge in the previous turn while under this effect.',
                'Oath: The caster may choose a number of targets up to WIS within their movement pattern who gain SPD equal to WIS as long as the caster is not targeted.'
            ],
            passive: [
                'Intuition: This spirit may apply Bond tokens to any target in their movement pattern where the number of hostile entities increases this spirit\'s ATK and allied entities increase their DEF.',
                'Vindictive: This spirit will have Critical Failures on all non-combat checks if there are no entities with Bond tokens on them.'
            ]
        }
    },
    'Arachnos': {
        HP: 18, ATK: 3, DEF: 1, SPD: 5, MP: 12, Move: 'Omni',
        traits: {
            active: [
                'Venom: The target loses HP equal to the caster\'s SPL for a number of turns equal to SPL.',
                'Webbing: The caster may prevent a target in their movement pattern from using spells or abilities for a number of turns equal to SPL.',
                'Patience: The caster may multiply their ATK and DEF by SPL if they have not attacked for a number of turns equal to SPL.',
                'Grasp: The caster may increase their SPD by twice SPL when in melee range of a target and the caster may not be detected under this effect.',
                'Trapping: For a number of turns equal to SPL, the caster may select a target in their movement pattern once per turn and that target may not attack.',
                'Stitching: The caster may regenerate HP equal to SPL for a number of turns equal to SPL after receiving damage while under this effect.'
            ],
            passive: [
                'Hunter: While this spirit is undetected, their SPD is doubled and counters are depleted twice as fast.',
                'Boneless: All negative counters on this spirit are increased by the number of combat and non-combat checks they were involved with in their last turn.'
            ]
        }
    },
    'Minotaur': {
        HP: 21, ATK: 4, DEF: 4, SPD: 1, MP: 9, Move: 'Omni',
        traits: {
            active: [
                'Ferocious: The caster\'s ATK and DEF are increased by twice EGO until end of turn.',
                'Rush: The caster may choose a location along their movement pattern within a number of spaces equal to EGO and move there while attacking all entities along their path.',
                'Shatter: The caster may target an area where entities in that area lose SPD and MP equal to EGO.',
                'Brute: The caster cannot have additional counters applied this turn and their DEF is increased by twice EGO until end of turn.',
                'Taunt: The caster may increase their ATK by EGO and hostile entities in the caster\'s attack pattern must attack the caster for a number of turns equal to EGO.',
                'Renegade: The caster\'s next spell or ability is considered a critical success, but their ATK is reduced by EGO until end of turn.'
            ],
            passive: [
                'Mighty: This spirit loses Rage counters and increases their ATK and DEF based on the number of times they dealt damage in the previous turn.',
                'Enraged: This spirit receives Rage counters each time they take damage, and if that damage is greater than the current number of Rage counters, they must attack each turn if able until those counters are depleted.'
            ]
        }
    },
    'Orc': {
        HP: 14, ATK: 3, DEF: 4, SPD: 2, MP: 16, Move: 'Lateral',
        traits: {
            active: [
                'Treachery: The target\'s SPD and ATK are raised by UND and reduced by EGO until end of turn.',
                'Ambush: The caster may target an area up to EGO for a number of turns equal to UND; if a hostile entity enters this area, they receive damage equal to UND + EGO.',
                'Plunder: When the caster deals damage, they may increase their MP up to UND + EGO.',
                'Deceive: The caster may summon a number of Orc tokens equal to UND for a number of turns equal to EGO, and all non-combat checks with these tokens are critical successes.',
                'Rally: Allied entities in the caster\'s movement pattern have their DEF increased by EGO and their non-combat checks are increased by UND.',
                'Bargain: The caster may not be attacked for a number of turns equal to EGO as long as their UND is greater than the target\'s ATK.'
            ],
            passive: [
                'Greed: This spirit has a number of Treasure counters equal to the number of active effects in their movement pattern at the end of their turn.',
                'Overconfident: If this spirit attempts to cast a spell or ability for more than the number of Treasure counters they have, then they take damage equal to that amount.'
            ]
        }
    }
};







const typeData = {
    'Thunder': {
        HP: 'SPL', ATK: 'KNO', DEF: 'WIS', SPD: 'DIV', MP: 'SEX', Attack: 'Diag',
        traits: {
            active: [
                'Stun: The target may not move for a number of turns equal to SPL.',
                'Storm: The caster may increase their ATK and SPD by an amount equal to SPL for a number of turns equal to SPL.',
                'Flash: The caster may increase or decrease non-combat checks by SPL.',
                'Static: The caster may target an area where hostile entities lose SPD and ATK equal to SPL for a number of turns equal to SPL.',
                'Lightning: The caster may select a number of targets up to SPL in their attack pattern and reduce their SPD by SPL.',
                'Shock: The caster may double knockback by an amount equal to SPL for a number of turns equal to SPL.'
            ],
            passive: [
                'Electric: This spirit gains Charge counters each turn equal to the number of abilities used in their last turn which can be spent to increase MP and the damage of future abilities.',
                'Overload: If the number of Charge counters on this spirit is greater than the number of abilities they used in their previous turn they receive damage equal to the number of counters and end their turn.'
            ]
        }
    },
    'Warrior': {
        HP: 'MNF', ATK: 'STR', DEF: 'VIT', SPD: 'SEX', MP: 'EGO', Attack: 'Omni',
        traits: {
            active: [
                'MultiStrike: The caster may make a number of additional attacks equal to STR.',
                'Berserker: The caster may increase a target\'s ATK and DEF by STR while reducing their SPD by STR.',
                'Tactical: The caster may increase their SPD by twice STR while dodging or their DEF by twice STR while blocking once per turn.',
                'Intimidate: The caster may reduce all the combat and non-combat checks of a target in their attack pattern by STR.',
                'Duelist: A target in the caster\'s attack pattern may only target the caster for a number of turns equal to STR.',
                'Resolve: The caster\'s DEF and HP are increased by STR for a number of turns equal to STR.'
            ],
            passive: [
                'Hardened: This spirit automatically performs a Critical Success after three consecutive successful checks of any kind.',
                'Stubborn: After a Critical Success this spirit may not perform another Critical Success for a number of turns equal to the number of actions they took in the previous turn.'
            ]
        }
    },
    'Spellcaster': {
        HP: 'BEU', ATK: 'KNO', DEF: 'DIV', SPD: 'SEX', MP: 'SPL', Attack: 'Corner Lateral',
        traits: {
            active: [
                'Shroud: The caster may not be the target of spells or abilities for a number of turns equal to SPL.',
                'Barrage: The caster may choose a number of targets in their attack pattern equal to SPL; these attacks are always a Critical Success.',
                'Protect: For a number of turns equal to SPL the caster may negate non-physical damage up to SPL.',
                'Whisper: The caster may increase or decrease any non-combat checks in their attack pattern by SPL.',
                'Swap: The caster may choose a target within a number of spaces in their attack pattern equal to SPL and switch positions with them.',
                'Librarian: The caster may perform a number of additional perception checks equal to SPL.'
            ],
            passive: [
                'Arcane: This spirit restores MP each turn equal to the number of active effects in their attack pattern.',
                'Magipsychosis: When this spirit uses any abilities each successive ability has its MP cost multiplied by the total number of abilities used that turn.'
            ]
        }
    },
    'Pyro': {
        HP: 'EGO', ATK: 'KNO', DEF: 'WIS', SPD: 'STR', MP: 'SPL', Attack: 'Spread',
        traits: {
            active: [
                'Inferno: The caster may deal damage to a target equal to SPL for a number of turns equal to SPL.',
                'Flames: For a number of turns equal to SPL when the caster is attacked the target may take damage equal to SPL.',
                'Embers: Once per turn the caster may increase any non-combat checks in their attack pattern by twice SPL.',
                'Wildfire: The caster may target an area equal to SPL and all entities in that area receive damage equal to SPL for a number of turns equal to SPL.',
                'Cinders: The caster may reduce their HP by SPL to remove a number of counters up to SPL from a target.',
                'Passion: The caster may increase their ATK and SPD by SPL while reducing their DEF by SPL for a number of turns equal to SPL.'
            ],
            passive: [
                'Flameborn: This spirit gains HP each turn equal to the number of active effects that do damage per turn in their movement pattern.',
                'Burnout: This spirit loses MP per turn equal to the number of abilities they used in their previous turn multiplied by the number of active effects in their movement pattern.'
            ]
        }
    },
    'Plant': {
        HP: 'FND', ATK: 'BEU', DEF: 'STR', SPD: 'EGO', MP: 'MNF', Attack: 'Area',
        traits: {
            active: [
                'Poison: If the caster takes damage this turn the target takes damage equal to the caster\'s MNF for a number of turns equal to MNF.',
                'Rooted: The caster may increase their DEF by twice MNF and reduce their SPD by MNF.',
                'LeachSeed: The caster may target an area equal to MNF while entities in that area reduce their DEF and SPD by MNF and the caster gains HP equal to the number of entities.',
                'Photosynthesis: The caster may increase their HP and MP by MNF each turn for a number of turns equal to MNF as long as they are in light.',
                'Bloom: For a number of turns equal to MNF targets in the caster\'s attack pattern may receive damage equal to MNF each turn.',
                'Entangle: When the caster is dealt damage this turn they may reduce that damage by MNF and deal damage equal to MNF to an entity in their attack pattern.'
            ],
            passive: [
                'Nature: This spirit gains HP per turn equal to the number of abilities they used in the previous turn.',
                'Nurture: This spirit loses MP each turn equal to the number of active effects in their attack pattern.'
            ]
        }
    },
    'Fairy': {
        HP: 'UND', ATK: 'KNO', DEF: 'WIS', SPD: 'SEX', MP: 'DIV', Attack: 'Diag',
        traits: {
            active: [
                'Flying: The caster may move over a number of walls equal to DIV and may not be targeted without Reach.',
                'Dusting: The caster may choose either to restore a target\'s HP by DIV, reduce a target\'s DEF by DIV, or increase a non-combat check by DIV.',
                'Shifted: The caster may negate a number of combat steps equal to DIV while this effect is active.',
                'Riddle: Once per turn the caster may gain a number of Riddle counters equal to DIV which can be used for any check involving DIV.',
                'Trickster: A target in the caster\'s attack pattern chooses one of ATK/DEF/SPD and the caster sets that value to a number between 0 and their DIV.',
                'Whisp: As long as the caster isn\'t targeted they may negate a target spell or ability cast for less than DIV.'
            ],
            passive: [
                'Lumos: This spirit may move through a number of objects equal to the number of abilities they used in the previous turn.',
                'Capricious: If this spirit deals or receives damage from a spell or ability they lose MP equal to half its cost.'
            ]
        }
    },
    'Beast': {
        HP: 'DIV', ATK: 'STR', DEF: 'FND', SPD: 'KNO', MP: 'MNF', Attack: 'Diag',
        traits: {
            active: [
                'Trample: The target\'s SPD is reduced by the caster\'s STR and does not recover in their next turn.',
                'Prey: The caster may increase their SPD by STR for a number of turns equal to STR.',
                'Predator: The caster may deal additional damage equal to the number of spaces they moved this turn up to twice STR.',
                'Pack: The caster may increase the ATK and SPD of allies within their attack pattern equal to STR.',
                'Scent: For a number of turns equal to STR the caster may reduce the target\'s DEF by STR during the combat step.',
                'Territorial: The caster may target an area up to STR where allied entities gain HP equal to STR and hostile entities have their DEF reduced by STR.'
            ],
            passive: [
                'Wild: This spirit gains HP equal to half the number of spaces they moved outdoors in the previous turn.',
                'Instinctual: If this spirit\'s HP is less than half then they lose HP equal to the number of abilities they used in the previous turn.'
            ]
        }
    },
    'Aqua': {
        HP: 'WIS', ATK: 'KNO', DEF: 'SEX', SPD: 'DIV', MP: 'SPL', Attack: 'Lateral',
        traits: {
            active: [
                'Ripple: The caster may not be the target of a number of spells or abilities equal to MNF for a number of turns equal to MNF.',
                'Mirror: For a number of turns equal to MNF the caster may increase their DEF by MNF and reflect damage received up to MNF.',
                'Liquify: The caster may select a space in their attack pattern within a number of spaces equal to MNF and move there while increasing their SPD by MNF.',
                'Currents: The caster selects a target in their attack pattern within a number of spaces equal to MNF and moves the target to the caster\'s location.',
                'Acidic: Targets in melee range of the caster lose DEF equal to MNF for a number of turns equal to MNF.',
                'Hydrate: The caster may increase or decrease non-combat checks in their attack pattern up to MNF and increase a target\'s MP by MNF.'
            ],
            passive: [
                'Fluidity: This spirit increases their MP and DEF based on the number of abilities they used in their previous turn.',
                'Emotional: After performing a Critical Success the next check is always a Critical Failure and after performing a Critical Failure the next check is always a Critical Success.'
            ]
        }
    },
    'Undead': {
        HP: 'UND', ATK: 'VIT', DEF: 'MNF', SPD: 'EGO', MP: 'FND', Attack: 'Diag',
        traits: {
            active: [
                'Feeding: When the caster deals damage its HP is increased by an amount up to MNF.',
                'Necrosis: For a number of turns equal to MNF the target loses HP equal to the number of spaces they move up to MNF.',
                'Syphon: Targets in the caster\'s attack pattern lose MP equal to MNF and the caster gains MP equal to the combined total lost.',
                'Deathwalk: If the caster would be destroyed while under this effect they may instead set their HP to MNF; they may not enter combat until end of turn.',
                'Regret: The caster may target an area where entities within that area have their SPD reduced by twice MNF for a number of turns equal to MNF.',
                'Undying: The caster may increase their DEF by twice MNF, remove a number of counters equal to MNF, and reduce their SPD by MNF.'
            ],
            passive: [
                'Unyielding: This spirit regenerates HP and MP equal to the amount of SPD they have remaining at the end of their turn.',
                'Cursed: This spirit loses HP and MP equal to the number of spaces they moved in their previous turn.'
            ]
        }
    },
    'Fiend': {
        HP: 'SEX', ATK: 'EGO', DEF: 'VIT', SPD: 'BEU', MP: 'STR', Attack: 'Corner Lateral',
        traits: {
            active: [
                'Terror: The target\'s ATK/DEF/SPD are reduced by caster\'s WIS for a number of turns equal to WIS.',
                'Reever: The target loses MP equal to WIS and the caster gains MP equal to WIS for a number of turns equal to WIS.',
                'Betrayer: For a number of turns equal to WIS the target takes additional damage equal to WIS from all attacks.',
                'Malevolence: For a number of turns equal to WIS the caster gains ATK and SPD equal to WIS and their DEF is reduced by WIS.',
                'Nightmare: The caster may spawn a number of Fiend tokens equal to WIS which have ATK/DEF/SPD equal to WIS until end of turn.',
                'Cruelty: The caster may increase their damage during the combat step equal to WIS for each combat step this turn.'
            ],
            passive: [
                'Bringer: This spirit gains ATK and HP equal to the amount of damage dealt to them in the previous turn while in darkness.',
                'Relentless: This spirit must attack each turn if able or lose MP equal to their DEF.'
            ]
        }
    },
    'Insect': {
        HP: 'SPL', ATK: 'VIT', DEF: 'EGO', SPD: 'STR', MP: 'KNO', Attack: 'Spread',
        traits: {
            active: [
                'Swarm: Targets in the caster\'s attack pattern take damage equal to the caster\'s SPL for a number of turns equal to the caster\'s SPL.',
                'Nest: The caster may spawn a number of Insect tokens equal to SPL for a number of turns equal to SPL.',
                'Mandibles: The caster may deal additional damage equal to SPL for a number of turns equal to SPL.',
                'Hivemind: Allied spirits in the caster\'s attack pattern gain ATK/DEF/SPD equal to SPL until end of turn.',
                'Pestilence: The caster may target an area where entities take damage equal to SPL for a number of turns equal to SPL.',
                'Cocoon: The caster may increase their DEF by twice SPL if they reduce their ATK and SPD by SPL.'
            ],
            passive: [
                'Evolve: This spirit gains ATK and SPD equal to the number of active effects in their attack pattern at the end of their previous turn.',
                'Frenzy: If this spirit has no active effects in their attack pattern they lose MP equal to the number of spaces they moved in their last turn.'
            ]
        }
    },
    'Vortex': {
        HP: 'WIS', ATK: 'KNO', DEF: 'UND', SPD: 'DIV', MP: 'MNF', Attack: 'Omni',
        traits: {
            active: [
                'Flying: The caster may move over a number of walls equal to UND.',
                'Tempest: The caster may target an area up to UND where entities lose SPD equal to twice UND if UND is greater than their DEF.',
                'Twister: The target gains Flying equal to UND and their SPD is increased by UND until end of turn.',
                'Rotation: The caster may increase their DEF by UND knockback by UND until end of turn.',
                'Gusts: The target gains SPD equal to twice UND until end of turn as long as they do not receive damage.',
                'Skywalker: The caster may select an area up to UND where allied entities gain MP equal to UND and hostile entities lose SPD equal to UND.'
            ],
            passive: [
                'Swiftness: This spirit gains MP each turn equal to the number of spaces they moved in the previous turn.',
                'Diffuse: This spirit loses MP each turn equal to the number of checks they were involved with in the previous turn.'
            ]
        }
    },
    'Dragoon': {
        HP: 'DIV', ATK: 'STR', DEF: 'VIT', SPD: 'SPL', MP: 'WIS', Attack: 'Omni',
        traits: {
            active: [
                'Vigilance: The caster may move and cast a number of times equal to DIV after attacking.',
                'Dragonkin: The caster and allies in their attack pattern gain ATK and DEF equal to DIV until end of turn.',
                'Lancer: Once per turn the caster may deal additional damage equal to twice DIV during the combat step.',
                'Leap: The caster can move to any point in their attack pattern while increasing their ATK and SPD by DIV.',
                'Judgement: The caster may multiply their ATK by DIV if the target\'s HP is less than half but the check is always considered a Critical Failure.',
                'Uplift: The caster may increase or decrease any combat or non-combat checks in their attack pattern by DIV as long as the result is less than DIV.'
            ],
            passive: [
                'Valor: This spirit gains ATK and DEF equal to the number of hostile entities in their attack pattern.',
                'Honor: This spirit loses ATK and DEF if the number of allied entities is greater than the number of hostile entities equal to the difference.'
            ]
        }
    },
    'Metal': {
        HP: 'UND', ATK: 'KNO', DEF: 'SEX', SPD: 'VIT', MP: 'FND', Attack: 'Corner Diagonal',
        traits: {
            active: [
                'Living Armor: The caster may be equipped to another spirit for a number of turns up to their SPL or Nanite counters.',
                'Augmentation: The caster may increase or decrease any combat or non-combat checks they are involved with up to their SPL or Nanite counters.',
                'Repair: The caster may increase their HP up to their SPL or Nanite counters twice per turn.',
                'Cybernetic: The caster may increase their SPD or ATK by SPL or Nanite counters for a number of turns equal to SPL or Nanite counters.',
                'Metallic: For a number of turns equal to SPL or Nanite counters the caster may negate damage up to SPL or Nanite counters.',
                'Technomancy: The caster may control constructs within melee range whose level is less than SPL or Nanite counters for a number of turns equal to SPL or Nanite counters.'
            ],
            passive: [
                'Nanites: This spirit gains a number of Nanite counters each turn equal to the number of checks they were involved with in the previous turn.',
                'Dependency: If this spirit doesn\'t have any Nanite counters on them at the end of their turn their MP is reduced to 0 and their next check is a Critical Failure.'
            ]
        }
    },
    'Rock': {
        HP: 'FND', ATK: 'STR', DEF: 'MNF', SPD: 'EGO', MP: 'KNO', Attack: 'Lateral',
        traits: {
            active: [
                'Defender: The caster may block for a number of spirits in their movement pattern equal to STR.',
                'Landslide: The caster may target an area where entities take additional damage equal to STR while their SPD is reduced by STR.',
                'Rockwall: Allied entities in the caster\'s attack pattern restore HP equal to STR and increase DEF by twice STR until end of turn.',
                'Seismic: The caster may choose a target in their attack pattern and apply knockback to that entity equal to twice STR.',
                'Pillars: For a number of turns equal to STR allied entities in the caster\'s attack pattern gain DEF equal to STR and hostile entities in the caster\'s attack pattern lose ATK equal to STR.',
                'Erosion: The target has their DEF reduced by STR and their MP reduced by STR for a number of turns equal to STR.'
            ],
            passive: [
                'Enduring: This spirit increases their DEF by the total number of counters on them in their previous turn.',
                'Immovable: This spirit loses MP each turn equal to the number of spaces they move.'
            ]
        }
    },
    'Normal': {
        HP: 'KNO', ATK: 'STR', DEF: 'FND', SPD: 'VIT', MP: 'UND', Attack: 'Omni',
        traits: {
            active: [
                'Battle-Cry: Target allied spirit gains ATK/DEF/SPD equal to the caster\'s STR plus Force counters until end of turn.',
                'Willpower: Once per turn the caster may negate target spell or ability cast for less than STR plus Force counters.',
                'Steadfast: The caster\'s DEF is increased by STR plus Force counters and may not receive Critical Hits/Fails for a number of turns equal to STR plus Force counters.',
                'Focus: The caster may increase their ATK and DEF by STR plus Force counters for a number of turns equal to STR plus Force counters.',
                'Intention: This effect is treated as the nearest active effect to the caster for a number of turns equal to STR plus Force counters.',
                'Pressure: The caster may multiply their ATK and SPD by STR plus Force counters and all checks are treated as Critical Failures until end of turn.'
            ],
            passive: [
                'Adaptable: This spirit gains Force counters equal to the number of checks they were involved with in the previous turn.',
                'Unassuming: If this spirit ends their turn with no Force counters their MP and SPD are reduced to 0 until their next turn.'
            ]
        }
    },
    'Psychic': {
        HP: 'STR', ATK: 'KNO', DEF: 'BEU', SPD: 'SPL', MP: 'DIV', Attack: 'Corner Lateral',
        traits: {
            active: [
                'Confusion: Targets in the caster\'s attack pattern may take action at random for a number of turns equal to MNF.',
                'Telepathy: The caster may move a number of counters up to MNF to and from any entity in their attack pattern.',
                'Telekinesis: The caster may apply Flying and Knockback to a number of objects in their attack pattern equal to MNF.',
                'Mindpalace: The caster may increase their DEF by MNF and negate a target active effect cast for less than MNF.',
                'Pulsar: Once per turn the caster may multiply damage dealt to a target by MNF but this check is always considered a Critical Failure.',
                'Insight: Once per turn the caster may increase or decrease any non-combat checks in their attack pattern up to twice MNF.'
            ],
            passive: [
                'Intuition: This spirit gains MP equal to the number of abilities they used in the previous turn for each check they are involved with this turn.',
                'Overthinking: This spirit has their SPD and non-combat checks reduced by the number of abilities they used in the previous turn.'
            ]
        }
    },
    'Ghost': {
        HP: 'MNF', ATK: 'UND', DEF: 'SEX', SPD: 'DIV', MP: 'EGO', Attack: 'Corner Diagonal',
        traits: {
            active: [
                'Phase: The caster may move through a number of walls equal to DIV.',
                'Etherwalk: Targets within the caster\'s attack pattern have their DEF reduced by twice DIV during the combat step.',
                'Memories: Once per turn the caster may spawn a token that has the same ATK/DEF/SPD as the target for a number of turns equal to DIV.',
                'Soulbound: The target and the caster become linked for a number of turns equal to DIV where all changes to HP and MP are shared.',
                'Evil-Eye: The target has their ATK and DEF reduced by DIV and their SPD increased by DIV for a number of turns equal to DIV.',
                'Lingering: Allied entities in the caster\'s attack pattern gain DEF equal to twice DIV until end of turn.'
            ],
            passive: [
                'Presence: This spirit increases their SPD by the number of abilities they used in the previous turn as long as they remain untargeted.',
                'Regrets: This spirit loses MP each turn equal to the number of abilities they used in the previous turn as long as they remain targeted.'
            ]
        }
    },
    'Crystal': {
        HP: 'KNO', ATK: 'VIT', DEF: 'SEX', SPD: 'DIV', MP: 'BEU', Attack: 'Lateral',
        traits: {
            active: [
                'Shroud: The caster may not be the target of spells or abilities for a number of turns equal to SEX.',
                'Reflect: The caster may reflect an amount of damage equal to SEX back to the damage source.',
                'Clarity: During the combat step the caster may increase damage dealt to a target up to SEX.',
                'Facets: Once per turn the caster may choose a new target for any spell or ability in their attack pattern cast for less than SEX.',
                'Shatter: For a number of turns equal to SEX the target loses DEF equal to SEX and must be the target of any attacks in their movement pattern.',
                'Recursion: For each time the caster is dealt damage they gain a number of counters equal to SEX and at the end of their turn they regenerate HP equal to the number of counters.'
            ],
            passive: [
                'Unbroken: This spirit reduces counters applied to them equal to their remaining SPD at the end of turn.',
                'Brittle: This spirit loses DEF and HP each turn equal to the number of combat steps they were involved with in their previous turn.'
            ]
        }
    },
    'Blood': {
        HP: 'MNF', ATK: 'SPL', DEF: 'EGO', SPD: 'STR', MP: 'UND', Attack: 'Area',
        traits: {
            active: [
                'LifeLink: If this spirit does damage it may recover HP up to EGO.',
                'Bloodrush: The caster\'s SPD is increased by EGO for a number of turns equal to EGO.',
                'Bloodwalk: If the caster deals damage they may increase their MP up to EGO.',
                'Pact: Target ally entity is linked to the caster for a number of turns equal to EGO where any damage dealt to the target is drained from the caster\'s MP instead.',
                'Mortality: For a number of turns equal to EGO the caster may target an area where all damage dealt regenerates the caster instead.',
                'Crimson: Allied entities in the caster\'s attack pattern gain HP equal to EGO while hostile entities in the caster\'s attack pattern lose HP equal to EGO.'
            ],
            passive: [
                'Vitality: This spirit gains HP equal to the number of abilities used in their previous turn.',
                'Bleeding: This spirit receives damage at the end of each turn equal to the amount of SPD they used that turn.'
            ]
        }
    },
    'Ice': {
        HP: 'FND', ATK: 'SPL', DEF: 'UND', SPD: 'EGO', MP: 'SEX', Attack: 'Lateral',
        traits: {
            active: [
                'Frostbite: Reduces the target\'s DEF and SPD by the caster\'s SPL for a number of turns equal to SPL.',
                'Glacial: The caster may target an area up to SPL and entities can not enter that area for a number of turns equal to SPL.',
                'Hailstorm: The caster may target an area where entities have their SPD reduced by SPL and all their perception checks are Critical Failures.',
                'Flash-Freeze: Targets in the caster\'s attack pattern have their SPD reduced by twice SPL for a number of turns equal to SPL.',
                'Arctic: For a number of turns equal to SPL targets in melee range of the caster have their ATK reduced by twice SPL.',
                'Blizzard: In an area around the caster equal to SPL for a number of turns equal to SPL all entities are incapable of targeting beyond melee range.'
            ],
            passive: [
                'Frozen: This spirit regenerates MP each turn equal to their remaining SPD at the end of the turn.',
                'Pyrophobia: This spirit loses HP each turn equal to the number of damage over time counters applied to them at the end of the turn.'
            ]
        }
    },
    'Holy': {
        HP: 'DIV', ATK: 'UND', DEF: 'WIS', SPD: 'EGO', MP: 'BEU', Attack: 'Corner Lateral',
        traits: {
            active: [
                'Vigilance: The caster may move and cast a number of times equal to FND after attacking.',
                'Intervention: The caster may increase the HP and DEF of a target in their attack pattern by FND for a number of turns equal to FND.',
                'Retribution: A target in the caster\'s attack pattern receives increased damage from all attacks equal to FND for a number of turns equal to FND.',
                'Sanctuary: The caster may target an area where all allied entities gain HP equal to FND for a number of turns equal to FND.',
                'Revelation: The caster may increase any perception checks by FND for a number of turns equal to FND.',
                'Blessing: Target allied entity gains ATK/DEF/SPD equal to FND for a number of turns equal to FND.'
            ],
            passive: [
                'Divine: Allied entities in this spirit\'s attack pattern gain HP equal to the number of spaces this spirit moved in their last turn.',
                'Morality: This spirit loses MP equal to twice the value of their last non-combat check when their Loyalty with another entity is reduced.'
            ]
        }
    },
    'Curse': {
        HP: 'FND', ATK: 'KNO', DEF: 'MNF', SPD: 'VIT', MP: 'SEX', Attack: 'Corner Diagonal',
        traits: {
            active: [
                'Fear: Target\'s ATK/DEF/SPD is reduced by caster\'s MNF for a number of turns equal to MNF.',
                'Hex: The target chooses one of ATK/DEF/SPD and reduces it by MNF they lose HP equal to MNF for a number of turns equal to MNF.',
                'Backlash: When receiving damage under this effect the caster may reflect an amount of damage up to twice MNF back to the source.',
                'Inevitable: A target in the caster\'s attack pattern may not declare attacks for a number of turns equal to MNF but they may still use skills and abilities.',
                'Chaos: Once per turn the caster may redirect any spell or ability cast for less than MNF to a target of their choice as long as their MP is full.',
                'Corruption: A target in the caster\'s attack pattern loses HP and MP equal to MNF for a number of turns equal to MNF but all their checks are Critical Successes.'
            ],
            passive: [
                'Wickedness: When this spirit\'s HP is less than half their ATK/DEF/SPD are increased by the amount of MP they used in their previous turn.',
                'Chaotic: Once per turn this spirit increases all counters on itself equal to the number of spaces they moved in the previous turn.'
            ]
        }
    },
    'Avatar': {
        HP: 'VIT', ATK: 'STR', DEF: 'FND', SPD: 'SEX', MP: 'WIS', Attack: 'Omni',
        traits: {
            active: [
                'MultiStrike: The caster may declare a number of additional attacks up to DIV.',
                'Balance: Once per turn the caster may increase ATK or DEF equal to twice DIV.',
                'Resonance: Boost the spells or abilities of a target allied spirit by DIV until end of turn.',
                'Mindfulness: The caster may increase their SPD and ATK by DIV during the combat step until end of turn.',
                'Energy-Wave: The caster may multiply damage dealt by DIV for a number of turns equal to DIV but all their checks are Critical Failures during that time.',
                'Equilibrium: The caster may target an area equal to DIV where allies gain MP and reduce counters equal to DIV each turn for a number of turns equal to DIV.'
            ],
            passive: [
                'Cosmic: This spirit gains Avatar counters each turn equal to the number of different Types in their attack pattern which can be used to boost abilities or restore MP.',
                'Duality: If this spirit performs or receives a Critical Hit/Fail all damage dealt to them is doubled until end of turn.'
            ]
        }
    }
};

const classData = {
    'Melee': {
        controlled: 'STR+FND',
        skills: {
            'One Handed': {
                atk_bonus: 2,
                def_bonus: 1,
                spd_bonus: 3,
                pattern: 'Area',
                traits: 'Dual Wield: You may equip two of this kind of weapon at a time.'
            },
            'Two Handed': {
                atk_bonus: 2,
                def_bonus: 3,
                spd_bonus: 1,
                pattern: 'Lateral',
                traits: 'Shockwave: This kind of weapon may strike a number of targets in the same space.'
            },
            'Whip': {
                atk_bonus: 3,
                def_bonus: 1,
                spd_bonus: 2,
                pattern: 'Corner Diagonal',
                traits: 'Sting: This kind of weapon may ignore some of a target\'s SPD while dodging.'
            },
            'Staff': {
                atk_bonus: 1,
                def_bonus: 3,
                spd_bonus: 2,
                pattern: 'Corner Lateral',
                traits: 'Catalyst: This kind of weapon may increase Magic damage or counters.'
            },
            'Fists': {
                atk_bonus: 1,
                def_bonus: 1,
                spd_bonus: 4,
                pattern: 'Omni',
                traits: 'Breaker: This kind of weapon may reduce the target\'s DEF.'
            },
            'Chi': {
                atk_bonus: 1,
                def_bonus: 4,
                spd_bonus: 1,
                pattern: 'Diagonal',
                traits: 'Focus: This kind of weapon may increase Special damage or counters.'
            }
        }
    },
    'Ranged': {
        controlled: 'VIT+EGO',
        skills: {
            'Thrown': {
                atk_bonus: 2,
                def_bonus: 1,
                spd_bonus: 3,
                pattern: 'Omni',
                traits: 'Recall: A number of weapons that are thrown may be returned to the owner.'
            },
            'Bow': {
                atk_bonus: 3,
                def_bonus: 0,
                spd_bonus: 3,
                pattern: 'Corner Lateral',
                traits: 'Focus: This kind of weapon may increase special damage or counters.'
            },
            'Crossbow': {
                atk_bonus: 1,
                def_bonus: 2,
                spd_bonus: 3,
                pattern: 'Corner Diagonal',
                traits: 'Breaker: This kind of weapon may reduce the target\'s DEF.'
            },
            'Shotgun': {
                atk_bonus: 1,
                def_bonus: 3,
                spd_bonus: 2,
                pattern: 'Spread',
                traits: 'Shockwave: This kind of weapon may strike a number of targets in the same space.'
            },
            'Pistol': {
                atk_bonus: 3,
                def_bonus: 1,
                spd_bonus: 2,
                pattern: 'Diagonal',
                traits: 'Dual Wield: You may equip two of this kind of weapon at a time.'
            },
            'Rifle': {
                atk_bonus: 4,
                def_bonus: 0,
                spd_bonus: 2,
                pattern: 'Lateral',
                traits: 'Catalyst: This kind of weapon may increase Magic damage or counters.'
            }
        }
    },
    'Magic': {
        controlled: 'WIS+KNO',
        skills: {
            'Earth': {
                atk_bonus: 2,
                def_bonus: 3,
                spd_bonus: 1,
                pattern: 'Area',
                traits: 'Quake: This kind of spell may Stun the target.'
            },
            'Air': {
                atk_bonus: 2,
                def_bonus: 1,
                spd_bonus: 3,
                pattern: 'Corner Lateral',
                traits: 'Gust: This kind of spell may reduce the target\'s SPD.'
            },
            'Fire': {
                atk_bonus: 3,
                def_bonus: 2,
                spd_bonus: 1,
                pattern: 'Spread',
                traits: 'Flare: This kind of spell may Burn the target.'
            },
            'Water': {
                atk_bonus: 2,
                def_bonus: 3,
                spd_bonus: 1,
                pattern: 'Corner Diagonal',
                traits: 'Hydro: This kind of spell may reduce the target\'s DEF.'
            },
            'Light': {
                atk_bonus: 3,
                def_bonus: 3,
                spd_bonus: 0,
                pattern: 'Lateral',
                traits: 'Cure: This kind of spell may restore a target\'s HP.'
            },
            'Dark': {
                atk_bonus: 2,
                def_bonus: 0,
                spd_bonus: 4,
                pattern: 'Diagonal',
                traits: 'Weaken: This kind of spell may take MP from a target.'
            }
        }
    },
    'Step': {
        controlled: 'UND+BEU',
        skills: {
            'Flight': {
                atk_bonus: 0,
                def_bonus: 2,
                spd_bonus: 4,
                pattern: 'Omni',
                traits: 'Soaring: This kind of step prevents the caster from being targeted without reach.'
            },
            'Float': {
                atk_bonus: 2,
                def_bonus: 3,
                spd_bonus: 1,
                pattern: 'Diagonal',
                traits: 'Slide: This kind of step allows the caster to move long distances through the air.'
            },
            'Dash': {
                atk_bonus: 3,
                def_bonus: 1,
                spd_bonus: 2,
                pattern: 'Lateral',
                traits: 'Charge: This kind of step allows the caster to trample targets.'
            },
            'Acrobat': {
                atk_bonus: 3,
                def_bonus: 3,
                spd_bonus: 0,
                pattern: 'Corner Diagonal',
                traits: 'Free Run: This kind of step allows the caster to reach distant targets.'
            },
            'Warp': {
                atk_bonus: 0,
                def_bonus: 1,
                spd_bonus: 5,
                pattern: 'Area',
                traits: 'Teleport: This kind of step allows the caster to phase through walls.'
            },
            'Evade': {
                atk_bonus: 1,
                def_bonus: 4,
                spd_bonus: 1,
                pattern: 'Corner Lateral',
                traits: 'Elusive: This kind of step allows the caster to increase their SPD while dodging.'
            }
        }
    },
    'Special': {
        controlled: 'SPL+MNF',
        skills: {
            'White': {
                atk_bonus: 1,
                def_bonus: 3,
                spd_bonus: 2,
                pattern: 'Lateral',
                traits: 'Barrier: This kind of power can be used to prevent an amount of damage.'
            },
            'Blue': {
                atk_bonus: 2,
                def_bonus: 3,
                spd_bonus: 1,
                pattern: 'Diagonal',
                traits: 'Control: This kind of power can be used to command lower level spirits.'
            },
            'Black': {
                atk_bonus: 3,
                def_bonus: 1,
                spd_bonus: 2,
                pattern: 'Area',
                traits: 'Venom: This kind of power can be used to poison a target.'
            },
            'Red': {
                atk_bonus: 4,
                def_bonus: 0,
                spd_bonus: 2,
                pattern: 'Spread',
                traits: 'Blast: This kind of power can be used to increase damage or counters.'
            },
            'Green': {
                atk_bonus: 3,
                def_bonus: 3,
                spd_bonus: 0,
                pattern: 'Corner Lateral',
                traits: 'Growth: This kind of power may be used to restore a target\'s MP.'
            },
            'None': {
                atk_bonus: 2,
                def_bonus: 2,
                spd_bonus: 2,
                pattern: 'Omni',
                traits: 'Token: This kind of power may spawn a number of tokens.'
            }
        }
    },
    'Trance': {
        controlled: 'DIV+SEX',
        skills: {
            'Overdrive': {
                atk_bonus: 3,
                def_bonus: 3,
                spd_bonus: 0,
                pattern: 'Lateral',
                traits: 'Release: This kind of trance may multiply the combat stats of the caster until their next turn.'
            },
            'Stages': {
                atk_bonus: 1,
                def_bonus: 3,
                spd_bonus: 2,
                pattern: 'Diagonal',
                traits: 'Boost: This kind of trance may increase the caster\'s combat stats incrementally by a factor.'
            },
            'Duration': {
                atk_bonus: 2,
                def_bonus: 0,
                spd_bonus: 4,
                pattern: 'Corner Diagonal',
                traits: 'Persist: This kind of trance doesn\'t have to be recast for a number of turns.'
            },
            'Aura': {
                atk_bonus: 4,
                def_bonus: 2,
                spd_bonus: 0,
                pattern: 'Area',
                traits: 'Overwhelm: This kind of trance may inflict fear on nearby spirits.'
            },
            'Armor': {
                atk_bonus: 0,
                def_bonus: 5,
                spd_bonus: 1,
                pattern: 'Corner Lateral',
                traits: 'Protect: This kind of trance may be cast separate from the caster as a token.'
            },
            'Morph': {
                atk_bonus: 4,
                def_bonus: 1,
                spd_bonus: 1,
                pattern: 'Omni',
                traits: 'Shift: This kind of trance may change, and/or enhance, the caster\'s Species for a time.'
            }
        }
    }
};

const runesData = {
    'Cu': { effect: 'Target Other', cost: 100, desc: 'Togetherness, more than oneself' },
    'Jo': { effect: 'Changes bio to VIT', cost: 100, desc: 'Justice, liberty, respect, freedom' },
    'Mi': { effect: 'Target Self', cost: 100, desc: 'Pertaining to self, me, myself, I' },
    'Ah': { effect: 'End Action/Phase', cost: 100, desc: 'Tranquility, peace, rationality, sanity, enlightening' },
    'Lo': { effect: 'Target Ally', cost: 100, desc: 'Friendship, family, compassion, care' },
    'So': { effect: 'Reach', cost: 100, desc: 'And, above, up, over, more' },
    'Un': { effect: 'Changes bio to WIS', cost: 100, desc: 'Make, change, adapt, build' },
    'Vel': { effect: 'Changes bio to STR', cost: 100, desc: 'Strength, power, ego, confidence, pride' },
    'Aye': { effect: 'Changes bio to FND', cost: 100, desc: 'Stillness, motionless, unbiased, silence, steady' },
    'Sl': { effect: 'Vanish', cost: 100, desc: 'Sight, vision, to see clearly' },
    'Ge': { effect: 'Changes bio to UND', cost: 100, desc: 'Knowledge, understanding, intelligence' },
    'O': { effect: 'Dodge', cost: 100, desc: 'Avoid, or, dodge, around' },
    'Zeb': { effect: 'Invert effect', cost: 100, desc: 'No, not, but' },
    'Ta': { effect: 'Stun', cost: 100, desc: 'Before, the past, unfinished, lazy, sloth' },
    'Fol': { effect: 'Frostbite', cost: 100, desc: 'Wedged, stuck, curious, indecisive, narrow' },
    'Web': { effect: 'LifeLink', cost: 100, desc: 'Life, nature, smell, wild, scent' },
    'Ic': { effect: 'Living Armor', cost: 100, desc: 'Bring, keep, capture, closeness, to establish' },
    'Sai': { effect: 'Change bio to MNF', cost: 100, desc: 'Time, patience, perception, future, later' },
    'I': { effect: 'Reduction', cost: 100, desc: 'Small, short, close, tiny' },
    'Ki': { effect: 'Trample', cost: 100, desc: 'Toward, with, through, in the direction of' },
    'Ro': { effect: 'ManaLink', cost: 100, desc: 'Unity, Love, connection' },
    'Zic': { effect: 'Poison', cost: 100, desc: 'Wound, pain, illness, hurt' },
    'Lin': { effect: 'Vigilance', cost: 100, desc: 'Forward, determination, ambition' },
    'Gi': { effect: 'Element Earth', cost: 100, desc: 'Balance, agreement, earth, north, well founded' },
    'Ba': { effect: 'Change bio to SPL', cost: 100, desc: 'Crossroads, gathering, acceptance, to bring together' },
    'Na': { effect: 'Target Area', cost: 100, desc: 'Everything, everyone, whole' },
    'Ga': { effect: 'Changes to DEF', cost: 100, desc: 'Shield, guardian, protection' },
    'Ya': { effect: 'Defender', cost: 100, desc: 'Wall, obstacle, stop, barrier' },
    'Hi': { effect: 'Charge', cost: 100, desc: 'Hope, faith, belief' },
    'Zi': { effect: 'Element Water', cost: 100, desc: 'Flow, pattern, circulation, water, west' },
    'Oc': { effect: 'Change bio to KNO', cost: 100, desc: 'Truth, fact, logic, math' },
    'Ru': { effect: 'Change bio to DIV', cost: 100, desc: 'Reality, creation, dimensions, planes of existence' },
    'Sti': { effect: 'Guard', cost: 100, desc: 'One, single, rest, comfort' },
    'Din': { effect: 'Element Dark', cost: 100, desc: 'Destruction, death, mayhem, chaos, havoc' },
    'Wa': { effect: 'Changes bio to BEU', cost: 100, desc: 'Focus, attraction, attention, envy' },
    'Par': { effect: 'Changes to HP', cost: 100, desc: 'Healing, regeneration, cleansing, recovery, purity' },
    'Ma': { effect: 'Trade', cost: 100, desc: 'Much, abundance, wealth, glutton' },
    'Fa': { effect: 'Ranged', cost: 100, desc: 'Consumption, Greed, Money' },
    'Po': { effect: 'Increase', cost: 100, desc: 'Give, provide, allow, contribute, donate' },
    'Cel': { effect: 'MultiStrike', cost: 100, desc: 'Two, also, as well' },
    'Pow': { effect: 'Trance', cost: 100, desc: 'Being-ness, existence, am/are, higher self' },
    'Kai': { effect: 'Changes to MP', cost: 100, desc: 'Result, outcome, solution, answer' },
    'Te': { effect: 'Element Light', cost: 100, desc: 'Grace, beauty, blessed, elegance' },
    'El': { effect: 'Magic', cost: 100, desc: 'Acceptance, belonging, taste' },
    'Re': { effect: 'Special', cost: 100, desc: 'Excitement, imagination, games' },
    'Bo': { effect: 'Loyalty+', cost: 100, desc: 'Promise, obligation, loyalty, devotion' },
    'Nu': { effect: 'Battle-cry', cost: 100, desc: 'Group, society, country, nation, union' },
    'Rey': { effect: 'Color White', cost: 100, desc: 'Caring, virtue, kindness, joy, nobility' },
    'Vo': { effect: 'Shroud', cost: 100, desc: 'Hidden, disguised, secret' },
    'Kel': { effect: 'Burn', cost: 100, desc: 'Anger, aggression, rage, wrath' },
    'Et': { effect: 'Color Red', cost: 100, desc: 'Want, urge, compulsion, lust' },
    'Soo': { effect: 'Dispel', cost: 100, desc: 'Lost, solitary, alone' },
    'Ni': { effect: 'Step', cost: 100, desc: 'Different, strange, unusual' },
    'Ve': { effect: 'Faction', cost: 100, desc: 'Own, possess, shape, inside' },
    'Zyn': { effect: 'Target Ally', cost: 100, desc: 'Leader, master, guidance, boss' },
    'Wi': { effect: 'Element Fire', cost: 100, desc: 'Energy, spark, heat, bright, fire, south' },
    'Ap': { effect: 'Talk', cost: 100, desc: 'Hear, listen, voice, sound' },
    'Ka': { effect: 'Fear', cost: 100, desc: 'Sadness, lonesome, sorrow, lament, to cry' }, // Renamed to avoid conflict with Ta
    'Zyl': { effect: 'Flight', cost: 100, desc: 'Release, awaken, loose, refresh, open' },
    'Coh': { effect: 'Changes to ATK', cost: 100, desc: 'Cut, separate, sharp' },
    'Xep': { effect: 'Color Green', cost: 100, desc: 'Growth, progress, evolution' },
    'Del': { effect: 'Reverse meaning', cost: 100, desc: 'Fall, forget, drop, loss, reflection' },
    'Cho': { effect: 'Combat', cost: 100, desc: 'Big, tall, large, giant, territory' },
    'Sen': { effect: 'Examine', cost: 100, desc: 'Under, below, beneath, down' },
    'Co': { effect: 'Target Servant', cost: 100, desc: 'Follower, slave, dominated, servant, unwilling' },
    'Pel': { effect: 'Confusion', cost: 100, desc: 'Rotate, mix, stir, congeal, start, begin' },
    'Fi': { effect: 'Element Air', cost: 100, desc: 'Fly, levitate, transgress, rise, air, west' },
    'Deb': { effect: 'Changes bio to SEX', cost: 100, desc: 'Reproduce, rebirth, transformation, intercourse' },
    'Zo': { effect: 'Color Black', cost: 100, desc: 'Nothing, no one, void' },
    'Wic': { effect: 'Color Blue', cost: 100, desc: 'Magick, spell, ritual, witch, mind' },
    'Nai': { effect: 'Phase', cost: 100, desc: 'Essence, aura, spirit' },
    'Ket': { effect: 'Battle', cost: 100, desc: 'Rebuttal, frustrate, belittle, prejudice' },
    'Tos': { effect: 'Changes to SPD', cost: 100, desc: 'Speed, movement, quickly, to run' },
    'Ex': { effect: 'Phase', cost: 100, desc: 'Cover, disguise, veil, screen, shelter' },
    'Kon': { effect: 'Loyalty-', cost: 100, desc: 'Twist, bend, manipulate, fluxuate' },
    'Dus': { effect: 'Casting', cost: 100, desc: 'Touch, feel, sense' }
};

const cypherData = {
    vowels: {
        'A': 'I', 'E': 'O', 'I': 'U', 'O': 'Y', 'U': 'A', 'Y': 'E'
    },
    consonants: {
        'R': 'L', 'S': 'N', 'T': 'R', 'L': 'S', 'N': 'T',
        'B': 'M', 'C': 'P', 'D': 'Q', 'F': 'V', 'G': 'W',
        'H': 'X', 'J': 'Z', 'K': 'B', 'M': 'C', 'P': 'D',
        'Q': 'F', 'V': 'G', 'W': 'H', 'X': 'J', 'Z': 'K'
    },
    rules: {
        doubleLetters: 'remove', // Remove double letters (e.g., "nn" → "n")
        consonantBlends: 'reverse' // Reverse consonant blends (e.g., "st" → "ts")
    }
};

const narrativeMatrix = {

    'Prologue': { desc: 'I, myself who is reading these words, have come to Rememberence ready to embark on a journey of discovery and adventure. Little did I know I would be discovering me. Through the Signs which guide me, and the Spirits who derive me. Knowing that even to deny them, is to act within their purview, as they are the eternal cosmos. This IS only a game... Isn\'t it?' },

    'Governance': { desc: 'I will come to learn of my signs, and of my spirit, those things which are already integral to my being. They will no longer influence me from beneath my conscious, but become a weapon I hold in my hands. That I may raise myself from the ashes, and bring others along with me. That through their signs I might know them as I have come to know myself. That our spirits may take hold and reshape the fabric of eternity.' },

    'Religion': { desc: 'My spirit grows, as other Spirits come to me. Beings who have taken these learnings, and made themselves from within them. As I have done with myself, and my spirit. Establishing my potential, and realizing that I truly have no limitations. Least of all those I once placed upon myself.' },

    'Logic': { desc: 'I have only just begun to understand that there is more to this than merely a game or a story. That those things which are framed in numbers and words, become manifest in life itself. I am not yet as one with my spirit, it\'s reach escapes me. It\'s foundations within the tapestry of reality, intertwine with my own. I have discovered that they are both a mystery, and a tool which helps me uncover the nature of reality.' },

    'Wisdom': { desc: 'Mine is not the only spirit in the cosmos, and it is better to unite, than to stand divided. I have come to find allies, and friends within the spirits. They come to me when I call, and they fight alongside me when I am in dire need. These spirits who walk with me, are they of people I have yet to meet, or have already met? Are they people who have not yet brought themselves to Rememberence?' },

    'Wealth': { desc: 'There is nothing in these realms I have found, with more value than connecting to others, helping them learn of their spirit. Unifying our talents, overcoming complex obstacles, forging ourselves in the image of our aspirations, and striving for good, honorably. Building our connections and compounding our capabilities at every level of being. As a rising tide lifts all ships, what joy it is to help others achieve their goals, and encourage them to do the same for others still. Can they too learn, as I have, about our limitless potential?' },

    'Matter': { desc: 'I\'ve broken others, I have made them suffer. I have been broken and fueled my selfishness. The pieces I have shattered are both tools for me, and chances for me to learn. Blades that slice both ways, increasing our understanding, and revealing our suffering. I can only hope that I am able to make my darkest moments into lessons learned.' },

    'Illusion': { desc: 'I am not limited by my spirit, for Rememberence has liberated my imagination. These spirits who are separate from mine have given insight, and through that insight I have learned of something more true than true is. We are already playing the game, as we are constantly writing it\'s stories. As we are unknowingly weaving the spirits among us who inhabit the minds of everyone who has ever been. Both Saviors and Devils from beyond time, hidden within the fundamental nature of consciousness itself.' },

    'War': { desc: 'I wouldn\'t believe it, no way that\'s true. I am but a collection of possibilities made self aware. A cosmic mistake, the spirits couldn\'t be in the waters, and the air. In the breath of fire we call life, or the fabric of the very stones. Yet in all things the spirits call to me.' },

    'Space': { desc: 'I can see many worlds in my mind, from the countless stars, to planes of stones and dust or raining glass. Worlds of Oceans and Forests and Rivers. Beings of great and terrifying power, others with next to none. Not merely of worlds, but of realms who\'s body is of galaxies without number. Yet Stil, I somehow know there is more.' },

    'Vision': { desc: 'By reading these words, I am changing the future, and in understanding them I command it. What of the spirits who are woven through time, who\'s being persists, in spite of choices made, in the future or the past? We all have a plane which resembles us, a universe both within and without us, equally complex as we ourselves. The choices we made have already been woven by us, infinite times before us and beyond us.' },

    'Peace': { desc: 'It is plain to see the book of destiny is in my hands. Yet to be written, and yet already done. Knowing beyond knowing, in the whispers of a dream, in the words that I read. With it I may influence the tapestry of fate. To bring wisdom or desolation for those who seek it.' },

    'Decay': { desc: 'Patterns become more clear to me, 12 signs of both beasts and of stars. They reveal what was, what is, and what could be. I have within my grasp that which guides and drives me, beyond my perception. To let such knowledge go to waste would be a travesty. To embrace it makes me, and all things considered, divine to their very core.' },

    'Time': { desc: 'The spirits come in their forms and their types. Stories within stories, who have written themselves already, yet are still to come. From the rise and fall of clans and tribes, to beyond the clash of civilizations. From armies within the stars, to battles for each universe to survive. Reforming worlds through effort and honorable will.' },

    'Signs': { desc: 'Patterns become more clear to me, 12 signs of both beasts and of stars. They reveal what was, what is, and what could be. I have within my grasp that which guides and drives me, beyond my perception. To let such knowledge go to waste would be a travesty. To embrace it makes me, and all things considered, divine to their very core.' },

    'Life': { desc: 'The spirits are of 36 forms, and of 24 types among them. Species and kinds which both make them distinct and bring them together. Each with their own stories, written in the sands of time. Their types to forge the world around them under the guidance of the signs. Their fate now in my hands, while I read and come to understand these words.' },

    'Blood': { desc: 'When spirits merge their energy and make something new, it is they who have written it into being. Their offspring who are both part of what was, and in themselves something new. Merging the strengths and weaknesses of their progenitors, becoming something more. That those who come after them may be even greater still. In such a way we can persist both through, and beyond time.' },

    'Spirit': { desc: 'The spirits are of 36 forms, and of 24 types among them. Species and kinds which both make them distinct and bring them together. Each with their own stories, written in the sands of time. Their types to forge the world around them under the guidance of the signs. Their fate now in my hands, while I read and come to understand these words.' },

    'Minds': { desc: 'The spirits can think, and act for themselves. The signs will reveal the answers to my questions. The spirits are woven with the same fabric of being as me. The spirits reveal their wisdom, and their tragedy. As complex within, as the cosmos themselves.' },

    'Owners': { desc: 'A waking dream where perception is fluid, yet well formulated. Where proper action just comes easily, and it shows in how I treat others and how they respond to me. My spirit is with me and as strong as ever. They are both a lens and a framework, a way to view the world and the world itself. If that is so, then who is really me?' },

    'Lessons': { desc: 'I have learned from the worlds within many minds, and have both stolen and sacrificed. Pledged my word, and had it broken like a shattered mirror at my feet. Have made and have not made everything I could possibly desire. Opened doors and closed them only to find a single truth. A single thing which makes all that is, that which it is.' },

    'Truth': { desc: 'The nature of being is to derive meaning by transmitting information beyond perception over time. In every moment, of every day, I am living this truth. With every breath, and with every step, I am shaping reality. Yes, even in reading these words, I have changed what is, and what could be. As they have already changed the patterns in my mind, the sigils of my spirit, if only in a very small way.' },

    'Mystic': { desc: 'My mind is my own, and only I may forge it. Let me use the hidden key to protect the temple within me which is my consciousness. Both the conscious and subconscious must never leave my domain. Unifying my emotions with profound reason and logic. That no other could take my only true freedom, that of thought.' },

    'Epilogue': { desc: 'I, myself who has read these words, came through Rememberence expecting a journey of discovery and adventure. Little do I know about the discovery of me. Through the spirits who stand beside me, and the signs that light our way. Knowing I can not deny them, for I am within their purview, as they are the eternal cosmos. It\'s always been a game... Hasn\'t it?' }
};

const biorhythms = [
    {
        id: 'MNF',
        descriptions: {
            dominant: 'Entities with high MNF are catalysts of change, leading actions and decisions. They set the pace, acting as natural leaders or pioneers, dictating social encounters.',
            recessive: 'Low MNF entities are responsive, following established paths. They excel in adaptability or support, thriving under clear leadership in collaborative roles.'
        }
    },
    {
        id: 'SPL',
        descriptions: {
            dominant: 'High SPL entities draw attention with charisma or actions, commanding social presence. They initiate captivating conversations, setting a tone of awe.',
            recessive: 'Low SPL entities blend into the background, excelling in subtlety. They adapt to splendid entities, influencing from the sidelines.'
        }
    },
    {
        id: 'BEU',
        descriptions: {
            dominant: 'High BEU entities radiate courage and kindness, fostering nurturing environments. Their presence inspires altruism and ethical conduct.',
            recessive: 'Low BEU entities are pragmatic, focusing on personal gain. Their interactions prioritize efficiency over warmth, emphasizing survival.'
        }
    },
    {
        id: 'STR',
        descriptions: {
            dominant: 'High STR entities show unyielding will, leading in adversity. They inspire resilience, confronting challenges head-on.',
            recessive: 'Low STR entities are cautious, aligning with stronger entities for security. They prefer stability, deferring to others’ decisions.'
        }
    },
    {
        id: 'FND',
        descriptions: {
            dominant: 'High FND entities are pillars of stability, holding firm to principles. They lead by example, rallying or polarizing others.',
            recessive: 'Low FND entities adapt stances for advantage, seen as versatile or fickle. They navigate changing environments pragmatically.'
        }
    },
    {
        id: 'KNO',
        descriptions: {
            dominant: 'High KNO entities pursue truth as scholars, fostering learning environments. Their interactions center on intellectual engagement.',
            recessive: 'Low KNO entities prioritize simplicity, living in the moment. Their interactions focus on practical application over theory.'
        }
    },
    {
        id: 'UND',
        descriptions: {
            dominant: 'High UND entities excel in empathy, acting as peacemakers. They create mutual respect, facilitating understanding.',
            recessive: 'Low UND entities focus on self, with straightforward interactions. They prioritize personal goals over emotional nuance.'
        }
    },
    {
        id: 'WIS',
        descriptions: {
            dominant: 'High WIS entities offer seasoned perspectives, advocating patience. They guide through thoughtful decision-making.',
            recessive: 'Low WIS entities act impulsively, learning through action. Their interactions are spontaneous, often reckless.'
        }
    },
    {
        id: 'VIT',
        descriptions: {
            dominant: 'High VIT entities embody honor, committed to their word. They foster trust and moral steadfastness.',
            recessive: 'Low VIT entities lean toward pragmatism, bending ethics for gain. Their interactions may seem opportunistic.'
        }
    },
    {
        id: 'SEX',
        descriptions: {
            dominant: 'High SEX entities use sensuality in interactions, employing confident allure. They create open, expressive atmospheres.',
            recessive: 'Low SEX entities prefer subdued intimacy, prioritizing emotional or platonic bonds over overt sexuality.'
        }
    },
    {
        id: 'DIV',
        descriptions: {
            dominant: 'High DIV entities seek spiritual meaning, fostering metaphysical discussions. They inspire introspection and connection.',
            recessive: 'Low DIV entities focus on the physical, skeptical of spiritual pursuits. Their interactions prioritize practicality.'
        }
    },
    {
        id: 'EGO',
        descriptions: {
            dominant: 'High EGO entities focus on self, seeking to be central. They influence through confidence, often seen as egotistical.',
            recessive: 'Low EGO entities prioritize others, often at personal cost. They may be overlooked, sacrificing for harmony.'
        }
    }
];

const bioToVerse = {
    'MNF': { dominant: 'Prologue', recessive: 'Epilogue' },
    'SPL': { dominant: 'Governance', recessive: 'Mystic' },
    'BEU': { dominant: 'Religion', recessive: 'Truth' },
    'STR': { dominant: 'Logic', recessive: 'Lessons' },
    'FND': { dominant: 'Wisdom', recessive: 'Owners' },
    'KNO': { dominant: 'Wealth', recessive: 'Minds' },
    'UND': { dominant: 'Matter', recessive: 'Spirit' },
    'WIS': { dominant: 'Illusion', recessive: 'Blood' },
    'VIT': { dominant: 'War', recessive: 'Life' },
    'SEX': { dominant: 'Space', recessive: 'Signs' },
    'DIV': { dominant: 'Vision', recessive: 'Time' },
    'EGO': { dominant: 'Peace', recessive: 'Decay' }
};




const patternMap = {
    'Omni': 'Omni',
    'Area': 'Area',
    'Diag': 'Diagonal',
    'Lateral': 'Lateral',
    'CornerLat': 'Corner Lateral',
    'CornerDiag': 'Corner Diagonal'
};