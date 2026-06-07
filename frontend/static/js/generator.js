async function apiLoad() {
    try {
        const res = await fetch('/load');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("Failed to load from server:", err);
        alert("The aether is silent... no spirits remembered.");
        return { spirits: [] };
    }
}

async function apiSave(state) {
    try {
        const res = await fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const reply = await res.json();
        console.log(`Saved at ${new Date(reply.timestamp * 1000).toLocaleString()}`);
        return true;
    } catch (err) {
        console.error("Save failed:", err);
        alert("The weave trembles... save failed.");
        return false;
    }
}

async function apiClear() {
    if (!confirm("Dissolve all spirits from the weave? This cannot be undone.")) return false;
    try {
        await fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spirits: [] })
        });
        alert("All essences have returned to the cosmic wind.");
        return true;
    } catch (err) {
        alert("Even oblivion resists...");
        return false;
    }
}

let gameData = null;

async function loadGameData() {
    try {
        const res = await fetch('/api/game-data');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        gameData = await res.json();
        return gameData;
    } catch (err) {
        console.warn('Unable to load game metadata, falling back to built-in constants.', err);
        gameData = null;
        return null;
    }
}

function applyGameDataToSelects(data) {
    if (!data) return;
    if (data.animals) populateSelect('animal-sign', data.animals);
    if (data.stars) populateSelect('star-sign', data.stars);
    if (data.species) {
        populateSelect('species', data.species);
        populateSelect('species2', data.species);
    }
    if (data.types) {
        populateSelect('type', data.types);
        populateSelect('type2', data.types);
    }
    if (data.diceTables) {
        const categories = data.diceTables.map(dt => dt.title);
        populateSelect('search-category', categories);
    }
}

function displaySearchResults(response) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    if (!response.results || !response.results.length) {
        resultsEl.textContent = 'No search results returned.';
        return;
    }
    resultsEl.innerHTML = `<h3>Search Category: ${response.category || 'Unknown'}</h3>` +
        response.results.map(item => `<div class="search-result-item">${item}</div>`).join('');
}

function drawMapLayout(layout) {
    const canvas = document.getElementById('map-canvas');
    if (!canvas || !Array.isArray(layout) || !layout.length) return;
    const ctx = canvas.getContext('2d');
    const rows = layout.length;
    const cols = layout[0].length;
    const cellSize = Math.min(canvas.width / cols, canvas.height / rows);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = {
        '.': '#2b2b2b',
        '#': '#5d4a42',
        '~': '#1f5b6d',
        '^': '#1f6d2d',
        '+': '#a1864f',
        '?': '#6f3c82',
    };

    for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
            const tile = layout[y][x];
            ctx.fillStyle = colors[tile] || '#333';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    for (let x = 0; x <= cols; x += 1) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, rows * cellSize);
        ctx.stroke();
    }
    for (let y = 0; y <= rows; y += 1) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(cols * cellSize, y * cellSize);
        ctx.stroke();
    }
}

function renderMapLegend(legend) {
    const legendEl = document.getElementById('map-legend');
    if (!legendEl || !legend) return;
    legendEl.innerHTML = Object.entries(legend).map(([key, value]) => {
        return `<div class="legend-item"><span class="legend-swatch">${value}</span><span>${key}</span></div>`;
    }).join('');
}

function displayMapResults(response) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    const mapName = response.mapName || 'Unnamed Map';
    const mapDescription = response.mapDescription || 'No description available.';
    const details = response.mapDetails || [];

    resultsEl.innerHTML = `
        <h3>${mapName}</h3>
        <p><strong>Category:</strong> ${response.category || 'Unknown'}</p>
        <p><strong>Theme:</strong> ${response.mapTheme || 'Unknown'}</p>
        <p>${mapDescription}</p>
        <div class="search-results-list">
            ${details.map(item => `<div class="search-result-item">${item}</div>`).join('')}
        </div>
    `;

    if (response.mapLayout) {
        drawMapLayout(response.mapLayout);
    }
    renderMapLegend(response.tileLegend);
}

async function performSearch() {
    const category = document.getElementById('search-category').value;
    const query = document.getElementById('search-query').value.trim();
    const payload = {
        category: query || category,
        n: 3
    };

    try {
        const res = await fetch('/api/generate/map', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        displayMapResults(data);
    } catch (err) {
        console.error('Map generation failed:', err);
        document.getElementById('search-results').textContent = 'Map generation failed. Please try another category.';
    }
}

function displayMapResults(response) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    const mapName = response.mapName || 'Unnamed Map';
    const mapDescription = response.mapDescription || 'No description available.';
    const details = response.mapDetails || [];

    resultsEl.innerHTML = `
        <h3>${mapName}</h3>
        <p><strong>Category:</strong> ${response.category || 'Unknown'}</p>
        <p>${mapDescription}</p>
        <div class="search-results-list">
            ${details.map(item => `<div class="search-result-item">${item}</div>`).join('')}
        </div>
    `;
}

function applyCharacterToForm(character) {
    document.getElementById('spirit-name').value = character.name || '';
    document.getElementById('description').value = character.description || '';
    document.getElementById('animal-sign').value = character.animal || '';
    document.getElementById('star-sign').value = character.star || '';
    document.getElementById('species').value = character.species || '';
    document.getElementById('species2').value = character.species2 || '';
    populateSpeciesActiveSkills(character.species || '', character.species2 || '');
    document.getElementById('species-active-skill').value = character.speciesActive || '';
    document.getElementById('type').value = character.type || '';
    document.getElementById('type2').value = character.type2 || '';
    populateTypeActiveSkills(character.type || '', character.type2 || '');
    document.getElementById('type-active-skill').value = character.typeActive || '';
    document.getElementById('melee-skill').value = character.meleeSkill || '';
    document.getElementById('ranged-skill').value = character.rangedSkill || '';
    document.getElementById('magic-skill').value = character.magicSkill || '';
    document.getElementById('step-skill').value = character.stepSkill || '';
    document.getElementById('special-skill').value = character.specialSkill || '';
    document.getElementById('trance-skill').value = character.tranceSkill || '';
    document.getElementById('level').value = character.level || 1;
    fillSheet();
}

async function generateCharacter() {
    const body = {
        name: document.getElementById('spirit-name').value.trim() || undefined,
        description: document.getElementById('description').value.trim() || undefined,
        level: parseInt(document.getElementById('level').value) || 1,
        animal: document.getElementById('animal-sign').value || undefined,
        star: document.getElementById('star-sign').value || undefined,
        species: document.getElementById('species').value || undefined,
        type: document.getElementById('type').value || undefined,
        meleeSkill: document.getElementById('melee-skill').value || undefined,
        rangedSkill: document.getElementById('ranged-skill').value || undefined,
        magicSkill: document.getElementById('magic-skill').value || undefined,
        stepSkill: document.getElementById('step-skill').value || undefined,
        specialSkill: document.getElementById('special-skill').value || undefined,
        tranceSkill: document.getElementById('trance-skill').value || undefined,
    };

    try {
        const res = await fetch('/api/character/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        if (result.character) {
            applyCharacterToForm(result.character);
            alert('Character generated using Rememberence game data.');
        } else {
            alert('Character generation returned no data.');
        }
    } catch (err) {
        console.error('Character generation failed:', err);
        alert('Character generation failed. Falling back to local sheet builder.');
        fillSheet();
    }
}


function populateSelect(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">None</option>';
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
}

function populateSpeciesActiveSkills(species, secondarySpecies) {
    const select = document.getElementById('species-active-skill');
    select.innerHTML = '';
    const traits = [
        ...(speciesData[species]?.traits.active || []),
        ...(secondarySpecies ? speciesData[secondarySpecies]?.traits.active || [] : [])
    ];
    [...new Set(traits)].forEach(skill => {
        const option = document.createElement('option');
        option.value = skill;
        option.textContent = skill;
        select.appendChild(option);
    });
}

function populateTypeActiveSkills(type, secondaryType) {
    const select = document.getElementById('type-active-skill');
    select.innerHTML = '';
    const traits = [
        ...(typeData[type]?.traits.active || []),
        ...(secondaryType ? typeData[secondaryType]?.traits.active || [] : [])
    ];
    [...new Set(traits)].forEach(skill => {
        const option = document.createElement('option');
        option.value = skill;
        option.textContent = skill;
        select.appendChild(option);
    });
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function calculateBiorhythms(animal, star) {
    const animalBios = animalSigns[animal] || animalSigns['Rat'];
    const starBios = starSigns[star] || starSigns['Aries'];
    return biorhythms.reduce((acc, bio) => {
        acc[bio.id] = (animalBios[bio.id] || 0) + (starBios[bio.id] || 0);
        return acc;
    }, {});
}

function getTier(level) {
    const tierIndex = Math.floor(Math.log10(level || 1));
    const tiers = ['Novice', 'Beginner', 'Mediate', 'Advanced', 'Master', 'Deity'];
    return tiers[Math.min(tierIndex, tiers.length - 1)];
}

function calculateStats(bios, species, type, secondarySpecies, secondaryType, level) {
    const baseSpecies1 = speciesData[species] || { HP: 0, ATK: 0, DEF: 0, SPD: 0, MP: 0 };
    const baseSpecies2 = secondarySpecies ? speciesData[secondarySpecies] || { HP: 0, ATK: 0, DEF: 0, SPD: 0, MP: 0 } : { HP: 0, ATK: 0, DEF: 0, SPD: 0, MP: 0 };
    const baseType1 = typeData[type] || { HP: 'VIT', ATK: 'STR', DEF: 'FND', SPD: 'SEX', MP: 'WIS' };
    const baseType2 = secondaryType ? typeData[secondaryType] || { HP: 'VIT', ATK: 'STR', DEF: 'FND', SPD: 'SEX', MP: 'WIS' } : null;
    const tierIndex = Math.floor(Math.log10(level || 1));
    const scale = Math.pow(10, tierIndex);

    const statMap = {};
    ['HP', 'ATK', 'DEF', 'SPD', 'MP'].forEach(stat => {
        const bio1 = bios[baseType1[stat]] || 0;
        const bio2 = baseType2 ? bios[baseType2[stat]] || 0 : bio1;
        statMap[stat] = Math.max(
            (baseSpecies1[stat] + bio1) * scale,
            (baseSpecies2[stat] + (baseType2 && baseType2[stat] !== baseType1[stat] ? bio2 : 0)) * scale
        );
    });

    return {
        HP: Math.round(statMap.HP),
        ATK: Math.round(statMap.ATK),
        DEF: Math.round(statMap.DEF),
        SPD: Math.round(statMap.SPD),
        MP: Math.round(statMap.MP)
    };
}

function calculateGearStats(bios, species, type, secondarySpecies, secondaryType, level) {
    const baseStats = calculateStats(bios, species, type, secondarySpecies, secondaryType, level);
    const slots = 6; // Head, Body, Hands, Legs, Feet, Other
    const slotMultiplier = 1; // 100% of base stats per slot
    const tierIndex = Math.floor(Math.log10(level || 1));
    const scale = Math.pow(10, tierIndex);

    return {
        HP: Math.round(slots * slotMultiplier * baseStats.HP),
        ATK: Math.round(slots * slotMultiplier * baseStats.ATK),
        DEF: Math.round(slots * slotMultiplier * baseStats.DEF),
        SPD: Math.round(slots * slotMultiplier * baseStats.SPD),
        MP: Math.round(slots * slotMultiplier * baseStats.MP)
    };
}

function generateThoughts(bios) {
    const thoughts = {
        Environment: -(bios.EGO || 0) + (bios.FND || 0),
        Emotion: -(bios.DIV || 0) + (bios.BEU || 0),
        Subconscious: -(bios.UND || 0) + (bios.SPL || 0),
        Conscious: -(bios.SEX || 0) + (bios.MNF || 0),
        Abstraction: -(bios.WIS || 0) + (bios.KNO || 0),
        Perception: -(bios.STR || 0) + (bios.VIT || 0)
    };
    thoughts.State = Object.values(thoughts).reduce((sum, val) => sum + val, 0);
    return thoughts;
}

function formatClassSection(className, skillName) {
    const cls = classData[className] || { controlled: 'None', skills: {} };
    const skill = cls.skills[skillName] || { atk_bonus: 0, def_bonus: 0, spd_bonus: 0, pattern: 'None', traits: 'None' };
    let section = `${className} Skills are controlled with ${cls.controlled}.\n\n`;
    section += `${skillName}:\n`;
    section += `ATK +${skill.atk_bonus}\nDEF +${skill.def_bonus}\nSPD +${skill.spd_bonus}\n`;
    section += `Pattern: ${skill.pattern}\nTraits: ${skill.traits}\n\n-----------------------------------------\n`;
    return section;
}

async function breedSpirits() {
    const data = await apiLoad();
    const spirits = data.spirits || [];
    if (spirits.length < 2) {
        alert('Need at least two saved spirits to breed.');
        return;
    }

    const spiritList = spirits.map(s => s.name).join(', ');
    const parent1Name = prompt(`Saved Spirits: ${spiritList}\nEnter first parent name:`);
    if (!parent1Name) return;
    const parent2Name = prompt(`Saved Spirits: ${spiritList}\nEnter second parent name:`);
    if (!parent2Name || parent1Name === parent2Name) {
        alert('Invalid or same parent selected.');
        return;
    }

    const parent1 = spirits.find(s => s.name.toLowerCase() === parent1Name.toLowerCase());
    const parent2 = spirits.find(s => s.name.toLowerCase() === parent2Name.toLowerCase());
    if (!parent1 || !parent2) {
        alert('One or both parents not found.');
        return;
    }

    // Calculate Biorhythms for both parents
    const bios1 = calculateBiorhythms(parent1.animal, parent1.star);
    const bios2 = calculateBiorhythms(parent2.animal, parent2.star);
    
    // Check Loyalty (>60)
    const loyalty1 = parent1.loyalty || 70; // Default for testing
    const loyalty2 = parent2.loyalty || 70;
    if (loyalty1 <= 60 || loyalty2 <= 60) {
        alert('Both parents need Loyalty > 60 to breed.');
        return;
    }

    // Calculate breeding outcome (SEX - BEU)
    const turnCycles1 = bios1.SEX - bios2.BEU;
    const turnCycles2 = bios2.SEX - bios1.BEU;
    const turnCycles = Math.max(turnCycles1, turnCycles2);
    let breedingDesc = '';
    let breedingAlert = '';
    if (turnCycles >= 0) {
        breedingDesc = `Offspring of ${parent1.name} and ${parent2.name}, born in ${turnCycles} cycles.`;
        breedingAlert = `A new spirit is born in ${turnCycles} cycles, forged in cosmic harmony!`;
    } else {
        const offspringCount = Math.abs(turnCycles);
        breedingDesc = `Offspring of ${parent1.name} and ${parent2.name}, producing ${offspringCount} offspring per cycle.`;
        breedingAlert = `A new spirit lineage is forged, yielding ${offspringCount} offspring per cycle in cosmic harmony!`;
    }
    if (turnCycles === 0) {
        alert('Parents are not biologically compatible (SEX - BEU must be non-zero).');
        return;
    }

    // Merge Biorhythms (highest values)
    const childBios = biorhythms.reduce((acc, bio) => {
        acc[bio.id] = Math.max(bios1[bio.id] || 0, bios2[bio.id] || 0);
        return acc;
    }, {});

    // Determine Species and Type (up to two each)
    const species = parent1.species === parent2.species ? parent1.species : [parent1.species, parent2.species].join('-');
    const type = parent1.type === parent2.type ? parent1.type : [parent1.type, parent2.type].filter((t, i, arr) => {
        const t1 = typeData[arr[0]] || { HP: 'VIT', ATK: 'STR', DEF: 'FND', SPD: 'SEX', MP: 'WIS' };
        const t2 = typeData[arr[1]] || { HP: 'VIT', ATK: 'STR', DEF: 'FND', SPD: 'SEX', MP: 'WIS' };
        return i === 0 || Object.keys(t1).some(stat => t1[stat] !== t2[stat]);
    }).join('-');
    
    // Set child attributes
    document.getElementById('spirit-name').value = '';
    document.getElementById('description').value = breedingDesc;
    document.getElementById('animal-sign').value = getRandomItem([parent1.animal, parent2.animal]);
    document.getElementById('star-sign').value = getRandomItem([parent1.star, parent2.star]);
    document.getElementById('species').value = parent1.species;
    document.getElementById('species2').value = parent1.species !== parent2.species ? parent2.species : '';
    populateSpeciesActiveSkills(parent1.species, parent2.species);
    document.getElementById('species-active-skill').value = getRandomItem([
        ...(speciesData[parent1.species]?.traits.active || []),
        ...(speciesData[parent2.species]?.traits.active || [])
    ]);
    document.getElementById('type').value = parent1.type;
    document.getElementById('type2').value = parent1.type !== parent2.type ? parent2.type : '';
    populateTypeActiveSkills(parent1.type, parent2.type);
    document.getElementById('type-active-skill').value = getRandomItem([
        ...(typeData[parent1.type]?.traits.active || []),
        ...(typeData[parent2.type]?.traits.active || [])
    ]);
    document.getElementById('melee-skill').value = getRandomItem([parent1.meleeSkill, parent2.meleeSkill]);
    document.getElementById('ranged-skill').value = getRandomItem([parent1.rangedSkill, parent2.rangedSkill]);
    document.getElementById('magic-skill').value = getRandomItem([parent1.magicSkill, parent2.magicSkill]);
    document.getElementById('step-skill').value = getRandomItem([parent1.stepSkill, parent2.stepSkill]);
    document.getElementById('special-skill').value = getRandomItem([parent1.specialSkill, parent2.specialSkill]);
    document.getElementById('trance-skill').value = getRandomItem([parent1.tranceSkill, parent2.tranceSkill]);
    document.getElementById('level').value = 1;

    fillSheet();
    alert(breedingAlert);
}

function fillSheet() {
    const name = document.getElementById('spirit-name').value || 'Spirit\'s Name';
    const description = document.getElementById('description').value || '[Description]';
    const animal = document.getElementById('animal-sign').value;
    const star = document.getElementById('star-sign').value;
    const spec = document.getElementById('species').value;
    const spec2 = document.getElementById('species2').value;
    const type = document.getElementById('type').value;
    const type2 = document.getElementById('type2').value;
    const speciesActive = document.getElementById('species-active-skill').value;
    const typeActive = document.getElementById('type-active-skill').value;
    const meleeSkill = document.getElementById('melee-skill').value;
    const rangedSkill = document.getElementById('ranged-skill').value;
    const magicSkill = document.getElementById('magic-skill').value;
    const stepSkill = document.getElementById('step-skill').value;
    const specialSkill = document.getElementById('special-skill').value;
    const tranceSkill = document.getElementById('trance-skill').value;
    const level = parseInt(document.getElementById('level').value) || 1;

    const bios = calculateBiorhythms(animal, star);
    const stats = calculateStats(bios, spec, type, spec2, type2, level);
    const gearStats = calculateGearStats(bios, spec, type, spec2, type2, level);
    const thoughts = generateThoughts(bios);
    const speciesTraits = speciesData[spec]?.traits || { active: [], passive: [] };
    const species2Traits = spec2 ? speciesData[spec2]?.traits || { active: [], passive: [] } : { active: [], passive: [] };
    const typeTraits = typeData[type]?.traits || { active: [], passive: [] };
    const type2Traits = type2 ? typeData[type2]?.traits || { active: [], passive: [] } : { active: [], passive: [] };
    const speciesPassive = [...new Set([...speciesTraits.passive, ...species2Traits.passive])];
    const typePassive = [...new Set([...typeTraits.passive, ...type2Traits.passive])];
    const baseType = typeData[type] || { HP: 'VIT', ATK: 'STR', DEF: 'FND', SPD: 'SEX', MP: 'WIS', Attack: 'Basic' };
    const baseType2 = type2 ? typeData[type2] || { Attack: 'Basic' } : null;
    const gearTraits = [(speciesActive),  (typeActive)];
    const tier = getTier(level);
    const displaySpecies = spec2 ? `${spec}-${spec2}` : spec;
    const displayType = type2 ? `${type}-${type2}` : type;

    let sheet = `${name}: Level = ${level} [${tier}]\n${description}\n\n-----------------------------------------\n$$$ = 0\n\n-----------------------------------------\n\n`;
    sheet += `Species: ${displaySpecies};\nElement: ${magicSkill};\n(${animal}) \n`;
    sheet += `Traits:\nSpecies Active: ${speciesActive}\nSpecies Passive:\n${speciesPassive.join('\n') || 'None'}\n\n`;
    sheet += `-----------------------------------------\n\n`;
    sheet += `Type: ${displayType};\nColor: ${specialSkill};\n(${star}) \n`;
    sheet += `Traits:\nType Active: ${typeActive}\nType Passive:\n${typePassive.join('\n') || 'None'}\n\n`;
    sheet += `-----------------------------------------\n\n-----------------------------------------\n~~~~~~~~~~~~~~~~[Combat]~~~~~~~~~~~~~~~~~\n-----------------------------------------\n\n`;
    sheet += `HP  = ${speciesData[spec]?.HP || 0}${spec2 ? `/${speciesData[spec2]?.HP || 0}` : ''} + ${baseType.HP} (${stats.HP}) g(${stats.HP + gearStats.HP})\n`;
    sheet += `ATK = ${speciesData[spec]?.ATK || 0}${spec2 ? `/${speciesData[spec2]?.ATK || 0}` : ''} + ${baseType.ATK} (${stats.ATK}) g(${stats.ATK + gearStats.ATK})\n`;
    sheet += `DEF = ${speciesData[spec]?.DEF || 0}${spec2 ? `/${speciesData[spec2]?.DEF || 0}` : ''} + ${baseType.DEF} (${stats.DEF}) g(${stats.DEF + gearStats.DEF})\n`;
    sheet += `SPD = ${speciesData[spec]?.SPD || 0}${spec2 ? `/${speciesData[spec2]?.SPD || 0}` : ''} + ${baseType.SPD} (${stats.SPD}) g(${stats.SPD + gearStats.SPD})\n`;
    sheet += `MP  = ${speciesData[spec]?.MP || 0}${spec2 ? `/${speciesData[spec2]?.MP || 0}` : ''} + ${baseType.MP} (${stats.MP}) g(${stats.MP + gearStats.MP})\n\n`;
    sheet += `Move: ${speciesData[spec]?.Move || 'Omni'}${spec2 ? `/${speciesData[spec2]?.Move || 'Omni'}` : ''}\n`;
    sheet += `Attack: ${baseType.Attack}${type2 ? `/${baseType2?.Attack || 'Basic'}` : ''}\n\n`;
    sheet += `-----------------------------------------\n\n-----------------------------------------\n~~~~~~~~~~~~~~[Biorhythms]~~~~~~~~~~~~~~~\n-----------------------------------------\nSp: 0/0\n\n`;
    sheet += biorhythms.map(b => `${b.id} = ${bios[b.id] || 0}`).join('\n') + '\n\n';
    sheet += `-----------------------------------------\n\n-----------------------------------------\n~~~~~~~~~~~~~~~[Thoughts]~~~~~~~~~~~~~~~~\n-----------------------------------------\n\n`;
    sheet += Object.entries(thoughts).map(([k, v]) => `${k} = ${v}`).join('\n') + '\n\n';
    sheet += `-----------------------------------------\n\n-----------------------------------------\n~~~~~~~~~~~~~[Class Styles]~~~~~~~~~~~~~~\n-----------------------------------------\n\n`;
    sheet += formatClassSection('Melee', meleeSkill);
    sheet += formatClassSection('Ranged', rangedSkill);
    sheet += formatClassSection('Magic', magicSkill);
    sheet += formatClassSection('Step', stepSkill);
    sheet += formatClassSection('Special', specialSkill);
    sheet += formatClassSection('Trance', tranceSkill);
    sheet += `-----------------------------------------\n\n-----------------------------------------\n~~~~~~~~~~~~~~~~~[Gear]~~~~~~~~~~~~~~~~~~\n-----------------------------------------\n\n`;
    sheet += `${name} Lvl 0 [Icon]\n`;
    sheet += `Head: ${displaySpecies}/${displayType}\n`;
    sheet += `Body: ${displaySpecies}/${displayType}\n`;
    sheet += `Hands: ${displaySpecies}/${displayType}\n`;
    sheet += `Legs: ${displaySpecies}/${displayType}\n`;
    sheet += `Feet: ${displaySpecies}/${displayType}\n`;
    sheet += `Other: ${displaySpecies}/${displayType}\n\n`;
    sheet += `Totals:\n`;
    sheet += `HP  = ${gearStats.HP}\n`;
    sheet += `ATK = ${gearStats.ATK}\n`;
    sheet += `DEF = ${gearStats.DEF}\n`;
    sheet += `SPD = ${gearStats.SPD}\n`;
    sheet += `MP  = ${gearStats.MP}\n\n`;
    sheet += `Traits:\n${gearTraits.join('\n') || 'None'}\n\n`;
    sheet += `-----------------------------------------\n`;

    // Species and Type descriptions (from loaded gameData or local constants)
    const speciesDesc = (gameData && gameData.species && speciesData[spec]) ? (speciesData[spec].traits?.passive || []).join('; ') : (speciesData[spec]?.traits?.passive || []).join('; ');
    const typeDesc = (gameData && gameData.types && typeData[type]) ? (typeData[type].description || '') : (typeData[type]?.description || '');
    sheet += `\n-----------------------------------------\n[Species / Type Details]\n-----------------------------------------\n`;
    sheet += `Species (${spec}): ${speciesDesc || 'No passive traits documented.'}\n`;
    sheet += `Type (${type}): ${typeDesc || 'No description available.'}\n`;

    // Runes list from gameData
    if (gameData && gameData.runes && gameData.runes.length) {
        sheet += `\n-----------------------------------------\n[Runes Available]\n-----------------------------------------\n`;
        gameData.runes.slice(0, 40).forEach(r => {
            sheet += `${r.code} — ${r.title || ''} ${r.effect ? `: ${r.effect}` : ''}\n`;
        });
        if (gameData.runes.length > 40) sheet += `...and ${gameData.runes.length - 40} more runes\n`;
    }

    // Kick off background fetch to enrich species/type descriptions
    fetchAndAppendEntityDetails(spec, type);


async function fetchAndAppendEntityDetails(spec, type) {
    try {
        const parts = [];
        if (spec) {
            const res = await fetch(`/api/species/${encodeURIComponent(spec)}`);
            if (res.ok) {
                const json = await res.json();
                if (json) parts.push(`Species details: ${json.traits ? json.traits.join('; ') : json.description || ''}`);
            }
        }
        if (type) {
            const res = await fetch(`/api/types/${encodeURIComponent(type)}`);
            if (res.ok) {
                const json = await res.json();
                if (json) parts.push(`Type details: ${json.traits ? json.traits.join('; ') : json.description || ''}`);
            }
        }
        if (parts.length) {
            const el = document.getElementById('character-sheet');
            el.textContent += '\n\n[Enriched Details]\n' + parts.join('\n');
        }
    } catch (err) {
        console.warn('Failed to fetch entity details:', err);
    }
}
    document.getElementById('character-sheet').textContent = sheet;
}




async function saveState() {
    const name = document.getElementById('spirit-name').value.trim();
    if (!name || !document.getElementById('animal-sign').value || !document.getElementById('star-sign').value) {
        alert('Name, Animal Sign, and Star Sign are required to bind a spirit.');
        return;
    }

    const spirit = {
        name,
        description: document.getElementById('description').value.trim(),
        animal: document.getElementById('animal-sign').value,
        star: document.getElementById('star-sign').value,
        species: document.getElementById('species').value,
        species2: document.getElementById('species2').value || '',
        speciesActive: document.getElementById('species-active-skill').value,
        type: document.getElementById('type').value,
        type2: document.getElementById('type2').value || '',
        typeActive: document.getElementById('type-active-skill').value,
        meleeSkill: document.getElementById('melee-skill').value,
        rangedSkill: document.getElementById('ranged-skill').value,
        magicSkill: document.getElementById('magic-skill').value,
        stepSkill: document.getElementById('step-skill').value,
        specialSkill: document.getElementById('special-skill').value,
        tranceSkill: document.getElementById('trance-skill').value,
        level: parseInt(document.getElementById('level').value) || 1,
        timestamp: Date.now()
    };

    const bios = calculateBiorhythms(spirit.animal, spirit.star);
    spirit.thoughts = generateThoughts(bios);
    spirit.loyaltyMap = spirit.loyaltyMap || { Player: 0 };

    let data = await apiLoad();
    let spirits = data.spirits || [];

    const existingIndex = spirits.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
    if (existingIndex !== -1) {
        spirits[existingIndex] = { ...spirits[existingIndex], ...spirit };
    } else {
        spirits.push(spirit);
    }

    const success = await apiSave({ spirits });
    if (success) {
        alert(`Spirit "${name}" has been etched into the eternal weave.`);
    }
}





async function loadState() {
    const data = await apiLoad();
    const spirits = data.spirits || [];
    if (spirits.length === 0) {
        alert('No spirits yet remembered in the cosmos.');
        return;
    }

    const spiritList = spirits.map(s => s.name).join(', ');
    const selectedName = prompt(`Saved Spirits: ${spiritList}\nEnter the name to load:`);
    if (!selectedName) return;

    const spirit = spirits.find(s => s.name.toLowerCase() === selectedName.toLowerCase());
    if (!spirit) {
        alert('No spirit found with that name.');
        return;
    }

    // Populate form
    document.getElementById('spirit-name').value = spirit.name || '';
    document.getElementById('description').value = spirit.description || '';
    document.getElementById('animal-sign').value = spirit.animal || 'Rat';
    document.getElementById('star-sign').value = spirit.star || 'Aries';
    document.getElementById('species').value = spirit.species || '';
    document.getElementById('species2').value = spirit.species2 || '';
    populateSpeciesActiveSkills(spirit.species, spirit.species2);
    document.getElementById('species-active-skill').value = spirit.speciesActive || '';
    document.getElementById('type').value = spirit.type || '';
    document.getElementById('type2').value = spirit.type2 || '';
    populateTypeActiveSkills(spirit.type, spirit.type2);
    document.getElementById('type-active-skill').value = spirit.typeActive || '';
    document.getElementById('melee-skill').value = spirit.meleeSkill || '';
    document.getElementById('ranged-skill').value = spirit.rangedSkill || '';
    document.getElementById('magic-skill').value = spirit.magicSkill || '';
    document.getElementById('step-skill').value = spirit.stepSkill || '';
    document.getElementById('special-skill').value = spirit.specialSkill || '';
    document.getElementById('trance-skill').value = spirit.tranceSkill || '';
    document.getElementById('level').value = spirit.level || 1;

    fillSheet();
    alert(`Spirit "${spirit.name}" returns from the aether.`);
}




async function deleteState() {
    const data = await apiLoad();
    const spirits = data.spirits || [];
    if (spirits.length === 0) {
        alert('No saved spirits to delete.');
        return;
    }

    const spiritList = spirits.map(s => s.name).join(', ');
    const selectedName = prompt(`Saved Spirits: ${spiritList}\nEnter the name to delete:`);
    if (!selectedName) return;

    const filtered = spirits.filter(s => s.name.toLowerCase() !== selectedName.toLowerCase());
    if (filtered.length === spirits.length) {
        alert('No spirit found with that name.');
        return;
    }

    const success = await apiSave({ spirits: filtered });
    if (success) {
        alert('Spirit deleted! Its essence returns to the cosmos.');
        // Optional: clear form
        document.getElementById('character-sheet').textContent = '';
        refreshSpiritList();
    }
}

async function refreshSpiritList() {
    try {
        const res = await fetch('/api/spirits');
        if (!res.ok) throw new Error('Failed to fetch spirits');
        const spirits = await res.json();
        renderSpiritList(spirits);
    } catch (err) {
        console.error(err);
        document.getElementById('saved-spirits-list').textContent = 'Unable to load spirits.';
    }
}

function renderSpiritList(spirits) {
    const container = document.getElementById('saved-spirits-list');
    container.innerHTML = '';
    if (!spirits || spirits.length === 0) {
        container.textContent = 'No spirits saved yet.';
        return;
    }
    spirits.forEach(spirit => {
        const entry = document.createElement('div');
        entry.className = 'spirit-entry';
        entry.innerHTML = `<strong>${spirit.name}</strong> (${spirit.animal}/${spirit.star})`;
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.addEventListener('click', () => loadSpirit(spirit.name));
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            await fetch(`/api/spirits/${encodeURIComponent(spirit.name)}`, { method: 'DELETE' });
            refreshSpiritList();
            alert(`Spirit ${spirit.name} has been removed.`);
        });
        entry.appendChild(loadButton);
        entry.appendChild(deleteButton);
        container.appendChild(entry);
    });
}

async function loadSpirit(name) {
    const data = await apiLoad();
    const spirit = (data.spirits || []).find(s => s.name.toLowerCase() === name.toLowerCase());
    if (!spirit) {
        alert('Spirit not found in current state. Refresh and try again.');
        return;
    }
    document.getElementById('spirit-name').value = spirit.name || '';
    document.getElementById('description').value = spirit.description || '';
    document.getElementById('animal-sign').value = spirit.animal || 'Rat';
    document.getElementById('star-sign').value = spirit.star || 'Aries';
    document.getElementById('species').value = spirit.species || '';
    document.getElementById('species2').value = spirit.species2 || '';
    populateSpeciesActiveSkills(spirit.species, spirit.species2);
    document.getElementById('species-active-skill').value = spirit.speciesActive || '';
    document.getElementById('type').value = spirit.type || '';
    document.getElementById('type2').value = spirit.type2 || '';
    populateTypeActiveSkills(spirit.type, spirit.type2);
    document.getElementById('type-active-skill').value = spirit.typeActive || '';
    document.getElementById('melee-skill').value = spirit.meleeSkill || '';
    document.getElementById('ranged-skill').value = spirit.rangedSkill || '';
    document.getElementById('magic-skill').value = spirit.magicSkill || '';
    document.getElementById('step-skill').value = spirit.stepSkill || '';
    document.getElementById('special-skill').value = spirit.specialSkill || '';
    document.getElementById('trance-skill').value = spirit.tranceSkill || '';
    document.getElementById('level').value = spirit.level || 1;
    fillSheet();
}

async function simulateSpirits() {
    try {
        const res = await fetch('/api/simulate', { method: 'POST' });
        if (!res.ok) throw new Error('Simulation failed');
        await res.json();
        alert('Simulation complete. The weave shifted.');
        refreshSpiritList();
    } catch (err) {
        console.error(err);
        alert('Simulation failed. Check the console.');
    }
}




document.addEventListener('DOMContentLoaded', () => {
    loadGameData().then((data) => {
        applyGameDataToSelects(data);
    });
    populateSelect('animal-sign', Object.keys(animalSigns));
    populateSelect('star-sign', Object.keys(starSigns));
    populateSelect('species', Object.keys(speciesData));
    populateSelect('species2', Object.keys(speciesData));
    populateSelect('type', Object.keys(typeData));
    populateSelect('type2', Object.keys(typeData));
    populateSelect('melee-skill', Object.keys(classData['Melee'].skills));
    populateSelect('ranged-skill', Object.keys(classData['Ranged'].skills));
    populateSelect('magic-skill', Object.keys(classData['Magic'].skills));
    populateSelect('step-skill', Object.keys(classData['Step'].skills));
    populateSelect('special-skill', Object.keys(classData['Special'].skills));
    populateSelect('trance-skill', Object.keys(classData['Trance'].skills));

    document.getElementById('species').addEventListener('change', (e) => {
        populateSpeciesActiveSkills(e.target.value, document.getElementById('species2').value);
    });

    document.getElementById('species2').addEventListener('change', (e) => {
        populateSpeciesActiveSkills(document.getElementById('species').value, e.target.value);
    });

    document.getElementById('type').addEventListener('change', (e) => {
        populateTypeActiveSkills(e.target.value, document.getElementById('type2').value);
    });

    document.getElementById('type2').addEventListener('change', (e) => {
        populateTypeActiveSkills(document.getElementById('type').value, e.target.value);
    });

    document.getElementById('level').addEventListener('change', fillSheet);

    document.getElementById('generate-random').addEventListener('click', () => {
        document.getElementById('spirit-name').value = '';
        document.getElementById('description').value = '';
        document.getElementById('animal-sign').value = getRandomItem(Object.keys(animalSigns));
        document.getElementById('star-sign').value = getRandomItem(Object.keys(starSigns));
        const species = getRandomItem(Object.keys(speciesData));
        document.getElementById('species').value = species;
        document.getElementById('species2').value = '';
        populateSpeciesActiveSkills(species, '');
        document.getElementById('species-active-skill').value = getRandomItem(speciesData[species]?.traits.active || []);
        const type = getRandomItem(Object.keys(typeData));
        document.getElementById('type').value = type;
        document.getElementById('type2').value = '';
        populateTypeActiveSkills(type, '');
        document.getElementById('type-active-skill').value = getRandomItem(typeData[type]?.traits.active || []);
        document.getElementById('melee-skill').value = getRandomItem(Object.keys(classData['Melee'].skills));
        document.getElementById('ranged-skill').value = getRandomItem(Object.keys(classData['Ranged'].skills));
        document.getElementById('magic-skill').value = getRandomItem(Object.keys(classData['Magic'].skills));
        document.getElementById('step-skill').value = getRandomItem(Object.keys(classData['Step'].skills));
        document.getElementById('special-skill').value = getRandomItem(Object.keys(classData['Special'].skills));
        document.getElementById('trance-skill').value = getRandomItem(Object.keys(classData['Trance'].skills));
        document.getElementById('level').value = 1;
        fillSheet();
    });

    document.getElementById('generate-sheet').addEventListener('click', generateCharacter);
    const searchButton = document.getElementById('search-generate');
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    document.getElementById('save-state').addEventListener('click', saveState);
    document.getElementById('load-state').addEventListener('click', loadState);
    document.getElementById('delete-state').addEventListener('click', deleteState);
    document.getElementById('breed-spirits').addEventListener('click', breedSpirits);
    document.getElementById('refresh-spirits').addEventListener('click', refreshSpiritList);
    document.getElementById('simulate-spirits').addEventListener('click', simulateSpirits);
    refreshSpiritList();
});