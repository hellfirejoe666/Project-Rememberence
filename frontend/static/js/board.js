// js/board.js
let boardInitialized = false;
let boardCanvas, boardCtx;
let selectedPawn = null;
let activePawn = null;
let pawns = [];
let turnOrder = [];
let currentPhase = 'upkeep';
let currentTurnIndex = 0;
let actionMode = null;  // 'move' | 'attack' | null

// ——— INIT ———
window.initBattleBoard = function() {
    if (boardInitialized) return;
    boardInitialized = true;

    const hub = document.getElementById('board-hub');
    if (!hub) return;

    const boardHTML = `
    <div style="display: flex; flex-direction: column; min-height: 100vh; padding: 20px 0 0;">
        <div style="flex: 1; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden;">
            <canvas id="board-canvas" width="600" height="600" style="border: 2px solid #444; background: #111;"></canvas>
        </div>
        <div id="action-bar" style="position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 90%; max-width: 1200px; background: #111; color: #eee; padding: 15px; border-top: 2px solid #444; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 0.9em; z-index: 100;">
            <select id="pawn-select" style="padding: 8px; min-width: 180px;" onchange="previewSpirit(this.value)">
                <option value="">Select Spirit</option>
            </select>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; min-width: 320px;">
                <button id="add-pawn-btn">Add</button>
                <button id="remove-pawn-btn">Remove</button>
                <button id="move-action-btn">Move</button>
                <button id="attack-action-btn">Attack</button>
            </div>
            <button id="end-turn-btn" style="padding: 10px 20px; font-weight: bold; display: none;">
                End Turn
            </button>
            <div style="text-align: right; min-width: 280px; line-height: 1.4;">
                <p style="margin: 0;"><strong>Phase:</strong> <span id="current-phase">Upkeep</span></p>
                <p style="margin: 0;"><strong>Turn:</strong> <span id="turn-order">—</span></p>
                <p style="margin: 0; font-size: 0.85em;"><strong>Move:</strong> <span id="move-pattern">—</span> | <strong>Attack:</strong> <span id="attack-pattern">—</span></p>
            </div>
        </div>
        <div id="spirit-sheet" style="position: fixed; top: 20px; right: 20px; width: 280px; background: #222; color: #eee; padding: 15px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.7); display: none; z-index: 100;">
            <h4 id="pawn-name" style="margin-top: 0;">—</h4>
            <p><strong>HP:</strong> <span id="hp">0</span>/<span id="max-hp">0</span></p>
            <p><strong>ATK:</strong> <span id="atk">0</span> | <strong>DEF:</strong> <span id="def">0</span></p>
            <p><strong>SPD:</strong> <span id="spd">0</span>/<span id="max-spd">0</span> | <strong>MP:</strong> <span id="mp">0</span>/<span id="max-mp">0</span></p>
            <p><strong>Species:</strong> <span id="board-species">—</span></p>
            <p><strong>Type:</strong> <span id="board-type">—</span></p>
            <p id="species-active"><strong>Species Skill:</strong> —</p>
            <p id="type-active"><strong>Type Skill:</strong> —</p>
        </div>
        <div id="spirit-preview" style="position: fixed; top: 20px; left: 20px; width: 280px; background: #222; color: #eee; padding: 15px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.7); display: none; z-index: 100;">
            <h4 id="preview-name" style="margin-top: 0;">—</h4>
            <p><strong>HP:</strong> <span id="preview-hp">0</span>/<span id="preview-max-hp">0</span></p>
            <p><strong>ATK:</strong> <span id="preview-atk">0</span> | <strong>DEF:</strong> <span id="preview-def">0</span></p>
            <p><strong>SPD:</strong> <span id="preview-spd">0</span>/<span id="preview-max-spd">0</span> | <strong>MP:</strong> <span id="preview-mp">0</span>/<span id="preview-max-mp">0</span></p>
            <p><strong>Species:</strong> <span id="preview-species">—</span></p>
            <p><strong>Type:</strong> <span id="preview-type">—</span></p>
            <p id="preview-species-active"><strong>Species Skill:</strong> —</p>
            <p id="preview-type-active"><strong>Type Skill:</strong> —</p>
            <p><strong>Move Pattern:</strong> <span id="preview-move">—</span></p>
            <p><strong>Attack Pattern:</strong> <span id="preview-attack">—</span></p>
        </div>
    </div>
    `;

    hub.insertAdjacentHTML('beforeend', boardHTML);

    boardCanvas = document.getElementById('board-canvas');
    boardCtx = boardCanvas.getContext('2d');
    boardCanvas.addEventListener('click', handleBoardClick);

    const actionBar = document.getElementById('action-bar');
    actionBar.addEventListener('click', handleActionBarClick);

    document.getElementById('end-turn-btn').addEventListener('click', endCurrentTurn);

    refreshPawnDropdown();
    renderBoard();
    updatePhaseDisplay();
};

// ——— ADD PAWN ———
function addPawnFromSpirit(spiritName) {
    const savedSpirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    const spiritTemplate = savedSpirits.find(s => s.name === spiritName);
    if (!spiritTemplate) return;

    const spirit = JSON.parse(JSON.stringify(spiritTemplate));
    pawns = pawns.filter(p => p.name !== spiritName);

    const bios = calculateBiorhythms?.(spirit.animal, spirit.star) || {};
    const stats = calculateStats?.(bios, spirit.species, spirit.type, spirit.species2, spirit.type2, spirit.level) || 
                  { HP: 100, ATK: 15, DEF: 10, SPD: 8, MP: 20 };
    const gearStats = calculateGearStats?.(bios, spirit.species, spirit.type, spirit.species2, spirit.type2, spirit.level) || 
                      { HP: 0, ATK: 0, DEF: 0, SPD: 0, MP: 0 };

    const speciesEntry = (speciesData || {})[spirit.species] || {};
    const typeEntry = (typeData || {})[spirit.type] || {};

    const movePattern = speciesEntry.Move || 'Omni';
    const attackPattern = typeEntry.Attack || 'Area';

    const pawn = {
        id: Date.now(),
        name: spirit.name,
        x: Math.floor(Math.random() * 10) + 1,
        y: Math.floor(Math.random() * 10) + 1,
        spirit: spirit,
        hp: stats.HP + gearStats.HP,
        maxHp: stats.HP + gearStats.HP,
        atk: stats.ATK + gearStats.ATK,
        def: stats.DEF + gearStats.DEF,
        spd: stats.SPD + gearStats.SPD,
        maxSpd: stats.SPD + gearStats.SPD,
        mp: stats.MP + gearStats.MP,
        maxMp: stats.MP + gearStats.MP,
        movePattern: movePattern,
        attackPattern: attackPattern
    };

    pawns.push(pawn);
    setupTurnOrder();
    renderBoard();
    refreshPawnDropdown();
    document.getElementById('spirit-preview').style.display = 'none';

    if (pawns.length === 1) startTurn();
}

// ——— PREVIEW SPIRIT ———
function previewSpirit(spiritName) {
    const savedSpirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    const spiritTemplate = savedSpirits.find(s => s.name === spiritName);
    const preview = document.getElementById('spirit-preview');
    if (!spiritTemplate || !preview) {
        preview.style.display = 'none';
        return;
    }

    const bios = calculateBiorhythms?.(spiritTemplate.animal, spiritTemplate.star) || {};
    const stats = calculateStats?.(bios, spiritTemplate.species, spiritTemplate.type, spiritTemplate.species2, spiritTemplate.type2, spiritTemplate.level) || 
                  { HP: 100, ATK: 15, DEF: 10, SPD: 8, MP: 20 };
    const gearStats = calculateGearStats?.(bios, spiritTemplate.species, spiritTemplate.type, spiritTemplate.species2, spiritTemplate.type2, spiritTemplate.level) || 
                      { HP: 0, ATK: 0, DEF: 0, SPD: 0, MP: 0 };

    const speciesEntry = (speciesData || {})[spiritTemplate.species] || {};
    const typeEntry = (typeData || {})[spiritTemplate.type] || {};

    const el = id => document.getElementById(id);
    el('preview-name').textContent = spiritTemplate.name || '—';
    el('preview-hp').textContent = (stats.HP + gearStats.HP) || 0;
    el('preview-max-hp').textContent = (stats.HP + gearStats.HP) || 0;
    el('preview-atk').textContent = (stats.ATK + gearStats.ATK) || 0;
    el('preview-def').textContent = (stats.DEF + gearStats.DEF) || 0;
    el('preview-spd').textContent = (stats.SPD + gearStats.SPD) || 0;
    el('preview-max-spd').textContent = (stats.SPD + gearStats.SPD) || 0;
    el('preview-mp').textContent = (stats.MP + gearStats.MP) || 0;
    el('preview-max-mp').textContent = (stats.MP + gearStats.MP) || 0;
    el('preview-species').textContent = spiritTemplate.species || 'None';
    el('preview-type').textContent = spiritTemplate.type || 'None';
    el('preview-species-active').innerHTML = `<strong>Species Skill:</strong> ${spiritTemplate.speciesActive || 'None'}`;
    el('preview-type-active').innerHTML = `<strong>Type Skill:</strong> ${spiritTemplate.typeActive || 'None'}`;
    el('preview-move').textContent = speciesEntry.Move || 'Omni';
    el('preview-attack').textContent = typeEntry.Attack || 'Area';

    preview.style.display = 'block';
}

// ——— TURN LOGIC ———
function startTurn() {
    if (pawns.length === 0) return;
    setupTurnOrder();
    currentTurnIndex = 0;
    advanceTurn();
}

function advanceTurn() {
    if (currentTurnIndex >= turnOrder.length) currentTurnIndex = 0;
    activePawn = turnOrder[currentTurnIndex];
    selectedPawn = activePawn;
    actionMode = null;
    currentPhase = 'upkeep';
    updatePhaseDisplay();
    updatePatternDisplay();
    document.getElementById('end-turn-btn').style.display = 'none';

    activePawn.spd = activePawn.maxSpd;

    setTimeout(() => {
        currentPhase = 'main1';
        updatePhaseDisplay();
        updatePatternDisplay();
        showPawnSheet();
        renderBoard();
        document.getElementById('end-turn-btn').style.display = 'block';
    }, 300);
}

function endCurrentTurn() {
    document.getElementById('end-turn-btn').style.display = 'none';
    currentTurnIndex++;
    advanceTurn();
}

// ——— PATTERNS ———
function getMoveTiles(pawn) {
    const tiles = [];
    const range = pawn.spd;
    const { x, y } = pawn;
    let pattern = patternMap[pawn.movePattern] || pawn.movePattern;

    const addLine = (dx, dy) => {
        for (let i = 1; i <= range; i++) {
            const tx = x + dx * i, ty = y + dy * i;
            if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12 && !pawns.find(p => p.x === tx && p.y === ty)) {
                tiles.push({ x: tx, y: ty });
            }
        }
    };

    switch (pattern) {
        case 'Omni':
            for (let i = 1; i <= range; i++) {
                [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dx, dy]) => {
                    const tx = x + dx * i, ty = y + dy * i;
                    if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12 && !pawns.find(p => p.x === tx && p.y === ty)) {
                        tiles.push({ x: tx, y: ty });
                    }
                });
            }
            break;
        case 'Area':
            for (let dx = -range; dx <= range; dx++) for (let dy = -range; dy <= range; dy++) if (Math.abs(dx) + Math.abs(dy) <= range && (dx || dy)) {
                const tx = x + dx, ty = y + dy;
                if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12 && !pawns.find(p => p.x === tx && p.y === ty)) tiles.push({ x: tx, y: ty });
            }
            break;
        case 'Lateral':
            [[1,0], [-1,0], [0,1], [0,-1]].forEach(([dx, dy]) => addLine(dx, dy));
            break;
        case 'Diagonal':
            [[1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dx, dy]) => addLine(dx, dy));
            break;
        case 'Corner Lateral':
            const latDirs = [[1,0], [-1,0], [0,1], [0,-1]];
            for (let a = 1; a <= range; a++) {
                for (let b = 1; b <= range - a; b++) {
                    latDirs.forEach(([dx1, dy1]) => {
                        const midX = x + dx1 * a;
                        const midY = y + dy1 * a;
                        if (midX < 0 || midX >= 12 || midY < 0 || midY >= 12) return;
                        latDirs.forEach(([dx2, dy2]) => {
                            if (dx1 * dy2 - dy1 * dx2 === 0) return;
                            const tx = midX + dx2 * b;
                            const ty = midY + dy2 * b;
                            if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12 && !pawns.find(p => p.x === tx && p.y === ty)) {
                                tiles.push({ x: tx, y: ty });
                            }
                        });
                    });
                }
            }
            break;
        case 'Corner Diagonal':
            const diagDirs = [[1,1], [1,-1], [-1,1], [-1,-1]];
            for (let a = 1; a <= range; a++) {
                for (let b = 1; b <= range - a; b++) {
                    diagDirs.forEach(([dx1, dy1]) => {
                        const midX = x + dx1 * a;
                        const midY = y + dy1 * a;
                        if (midX < 0 || midX >= 12 || midY < 0 || midY >= 12) return;
                        diagDirs.forEach(([dx2, dy2]) => {
                            if (dx1 * dy2 - dy1 * dx2 === 0) return;
                            const tx = midX + dx2 * b;
                            const ty = midY + dy2 * b;
                            if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12 && !pawns.find(p => p.x === tx && p.y === ty)) {
                                tiles.push({ x: tx, y: ty });
                            }
                        });
                    });
                }
            }
            break;
        default:
            console.warn('Unknown move pattern:', pawn.movePattern);
    }
    return tiles;
}

function getAttackTiles(pawn) {
    const tiles = [];
    const range = pawn.spd;
    const { x, y } = pawn;
    let pattern = patternMap[pawn.attackPattern] || pawn.attackPattern;

    const addLine = (dx, dy) => {
        for (let i = 1; i <= range; i++) {
            const tx = x + dx * i, ty = y + dy * i;
            if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12) tiles.push({ x: tx, y: ty });
        }
    };

    switch (pattern) {
        case 'Area':
            for (let dx = -range; dx <= range; dx++) for (let dy = -range; dy <= range; dy++) if (dx || dy) {
                const tx = x + dx, ty = y + dy;
                if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12) tiles.push({ x: tx, y: ty });
            }
            break;
        case 'Lateral':
            [[1,0], [-1,0], [0,1], [0,-1]].forEach(([dx, dy]) => addLine(dx, dy));
            break;
        case 'Diagonal':
            [[1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dx, dy]) => addLine(dx, dy));
            break;
        case 'Corner Lateral':
            const latDirs = [[1,0], [-1,0], [0,1], [0,-1]];
            for (let a = 1; a <= range; a++) {
                for (let b = 1; b <= range - a; b++) {
                    latDirs.forEach(([dx1, dy1]) => {
                        const midX = x + dx1 * a;
                        const midY = y + dy1 * a;
                        if (midX < 0 || midX >= 12 || midY < 0 || midY >= 12) return;
                        latDirs.forEach(([dx2, dy2]) => {
                            if (dx1 * dy2 - dy1 * dx2 === 0) return;
                            const tx = midX + dx2 * b;
                            const ty = midY + dy2 * b;
                            if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12) tiles.push({ x: tx, y: ty });
                        });
                    });
                }
            }
            break;
        case 'Corner Diagonal':
            const diagDirs = [[1,1], [1,-1], [-1,1], [-1,-1]];
            for (let a = 1; a <= range; a++) {
                for (let b = 1; b <= range - a; b++) {
                    diagDirs.forEach(([dx1, dy1]) => {
                        const midX = x + dx1 * a;
                        const midY = y + dy1 * a;
                        if (midX < 0 || midX >= 12 || midY < 0 || midY >= 12) return;
                        diagDirs.forEach(([dx2, dy2]) => {
                            if (dx1 * dy2 - dy1 * dx2 === 0) return;
                            const tx = midX + dx2 * b;
                            const ty = midY + dy2 * b;
                            if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12) tiles.push({ x: tx, y: ty });
                        });
                    });
                }
            }
            break;
        case 'Omni':
            for (let i = 1; i <= range; i++) {
                [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dx, dy]) => {
                    const tx = x + dx * i, ty = y + dy * i;
                    if (tx >= 0 && tx < 12 && ty >= 0 && ty < 12) tiles.push({ x: tx, y: ty });
                });
            }
            break;
        default:
            console.warn('Unknown attack pattern:', pawn.attackPattern);
    }
    return tiles;
}

// ——— RENDER ———
function renderBoard() {
    if (!boardCtx) return;
    const cellSize = 50;
    boardCtx.clearRect(0, 0, 600, 600);

    // Grid
    for (let gx = 0; gx < 12; gx++) {
        for (let gy = 0; gy < 12; gy++) {
            boardCtx.strokeStyle = '#444';
            boardCtx.strokeRect(gx * cellSize, gy * cellSize, cellSize, cellSize);
        }
    }

    // Highlight action mode
    if (selectedPawn && actionMode && ['main1', 'main2'].includes(currentPhase)) {
        const tiles = actionMode === 'move' ? getMoveTiles(selectedPawn) : getAttackTiles(selectedPawn);
        const color = actionMode === 'move' ? 'rgba(0, 255, 0, 0.35)' : 'rgba(255, 0, 0, 0.35)';
        const stroke = actionMode === 'move' ? '#0f0' : '#f00';
        tiles.forEach(t => {
            boardCtx.fillStyle = color;
            boardCtx.fillRect(t.x * cellSize, t.y * cellSize, cellSize, cellSize);
            boardCtx.strokeStyle = stroke;
            boardCtx.lineWidth = 1;
            boardCtx.strokeRect(t.x * cellSize, t.y * cellSize, cellSize, cellSize);
        });
    }

    // Render non-active pawns first
    pawns.filter(p => p !== activePawn).forEach(pawn => {
        drawPawn(pawn, false);
    });

    // Render active pawn on top
    if (activePawn) {
        drawPawn(activePawn, true);
    }
}

function drawPawn(pawn, isActive) {
    const cellSize = 50;
    const px = pawn.x * cellSize + 5;
    const py = pawn.y * cellSize + 5;

    boardCtx.fillStyle = '#4a9';
    boardCtx.fillRect(px, py, 40, 40);
    boardCtx.fillStyle = '#fff';
    boardCtx.font = '12px monospace';
    boardCtx.fillText(pawn.name[0], px + 15, py + 25);

    if (isActive || selectedPawn === pawn) {
        boardCtx.strokeStyle = '#ff0';
        boardCtx.lineWidth = 3;
        boardCtx.strokeRect(px - 2, py - 2, 44, 44);
    }
}

// ——— CLICK ———
function handleBoardClick(e) {
    if (!boardCanvas) return;
    const rect = boardCanvas.getBoundingClientRect();
    const tx = Math.floor((e.clientX - rect.left) / 50);
    const ty = Math.floor((e.clientY - rect.top) / 50);

    let targetPawn = null;
    if (activePawn && activePawn.x === tx && activePawn.y === ty) {
        targetPawn = activePawn;
    } else {
        targetPawn = pawns.find(p => p.x === tx && p.y === ty && p !== activePawn);
    }

    if (targetPawn) {
        if (targetPawn === activePawn && ['main1', 'main2'].includes(currentPhase)) {
            selectedPawn = targetPawn;
            renderBoard();
            showPawnSheet();
            updatePatternDisplay();
            return;
        }

        // ATTACK: melee or ranged — BOTH cost full distance
        if (selectedPawn && actionMode === 'attack' && ['main1', 'main2'].includes(currentPhase)) {
            const attackTiles = getAttackTiles(selectedPawn);
            const isInRange = attackTiles.some(t => t.x === tx && t.y === ty);
            if (isInRange && targetPawn !== selectedPawn) {
                const dist = Math.abs(selectedPawn.x - tx) + Math.abs(selectedPawn.y - ty);
                const isMelee = attackMode === 'melee';

                if (selectedPawn.spd < dist) {
                    console.log(`Not enough SPD! Need ${dist}, have ${selectedPawn.spd}`);
                    return;
                }

                const damage = Math.max(1, selectedPawn.atk - targetPawn.def);
                targetPawn.hp -= damage;

                if (isMelee) {
                    selectedPawn.x = tx;
                    selectedPawn.y = ty;
                    console.log(`${selectedPawn.name} melee strikes ${targetPawn.name} for ${damage}! (SPD -${dist})`);
                } else {
                    console.log(`${selectedPawn.name} ranged strikes ${targetPawn.name} for ${damage}! (SPD -${dist})`);
                }

                selectedPawn.spd -= dist;

                if (targetPawn.hp <= 0) {
                    console.log(`${targetPawn.name} falls!`);
                    pawns = pawns.filter(p => p !== targetPawn);
                    setupTurnOrder();
                }

                selectedPawn = null;
                actionMode = null;
                attackMode = 'melee';
                document.getElementById('attack-action-btn').textContent = 'Melee';

                renderBoard();
                showPawnSheet();
                updatePatternDisplay();
            }
            return;
        }
    }

    // MOVE
    if (selectedPawn && actionMode === 'move' && ['main1', 'main2'].includes(currentPhase)) {
        const moveTiles = getMoveTiles(selectedPawn);
        const isValidMove = moveTiles.some(t => t.x === tx && t.y === ty);
        if (isValidMove) {
            const dist = Math.abs(selectedPawn.x - tx) + Math.abs(selectedPawn.y - ty);
            if (selectedPawn.spd >= dist) {
                selectedPawn.x = tx;
                selectedPawn.y = ty;
                selectedPawn.spd -= dist;
                renderBoard();
                showPawnSheet();
                updatePatternDisplay();
            }
        }
    }
}

// ——— PHASE & TURN ———
function setupTurnOrder() {
    turnOrder = [...pawns].sort((a, b) => b.spd - a.spd);
    const el = document.getElementById('turn-order');
    if (el) el.textContent = turnOrder.map(p => p.name).join(' → ');
}

function updatePhaseDisplay() {
    const names = { upkeep: 'Upkeep', main1: 'Main Phase 1', main2: 'Main Phase 2' };
    const cur = document.getElementById('current-phase');
    if (cur) cur.textContent = names[currentPhase] || currentPhase;
}

function updatePatternDisplay() {
    const moveEl = document.getElementById('move-pattern');
    const attackEl = document.getElementById('attack-pattern');
    if (activePawn && moveEl && attackEl) {
        moveEl.textContent = activePawn.movePattern;
        attackEl.textContent = activePawn.attackPattern;
    } else {
        if (moveEl) moveEl.textContent = '—';
        if (attackEl) attackEl.textContent = '—';
    }
}

// ——— ACTION BAR ———
let attackMode = 'melee';  // 'melee' | 'ranged'

function handleActionBarClick(e) {
    const id = e.target.id;
    if (id === 'add-pawn-btn') {
        const name = document.getElementById('pawn-select').value;
        if (name && !pawns.find(p => p.name === name)) {
            addPawnFromSpirit(name);
        }
    } else if (id === 'remove-pawn-btn') {
        if (!selectedPawn) return alert('Select a pawn.');
        pawns = pawns.filter(p => p !== selectedPawn);
        selectedPawn = null; activePawn = null;
        showPawnSheet(); renderBoard(); setupTurnOrder(); refreshPawnDropdown(); updatePatternDisplay();
        if (pawns.length === 0) document.getElementById('end-turn-btn').style.display = 'none';
    } else if (id === 'move-action-btn') {
        if (activePawn && ['main1', 'main2'].includes(currentPhase)) {
            actionMode = 'move';
            selectedPawn = activePawn;
            attackMode = 'melee';  // Reset
            document.getElementById('attack-action-btn').textContent = 'Attack';  // ← RESET
            renderBoard();
        }
    } else if (id === 'attack-action-btn') {
        if (activePawn && ['main1', 'main2'].includes(currentPhase)) {
            attackMode = attackMode === 'melee' ? 'ranged' : 'melee';
            actionMode = 'attack';
            selectedPawn = activePawn;
            const btn = document.getElementById('attack-action-btn');
            btn.textContent = attackMode === 'melee' ? 'Melee' : 'Ranged';
            renderBoard();
        }
    }
}

// ——— SHEET & DROPDOWN ———
function showPawnSheet() {
    const sheet = document.getElementById('spirit-sheet');
    if (!sheet || !activePawn?.spirit) {
        if (sheet) sheet.style.display = 'none';
        return;
    }
    updatePawnSheet();
    sheet.style.display = 'block';
}

function updatePawnSheet() {
    if (!activePawn?.spirit) return;
    const spirit = activePawn.spirit;
    const el = id => document.getElementById(id);
    if (el('pawn-name')) el('pawn-name').textContent = spirit.name || '—';
    if (el('hp')) el('hp').textContent = activePawn.hp ?? 0;
    if (el('max-hp')) el('max-hp').textContent = activePawn.maxHp ?? 0;
    if (el('atk')) el('atk').textContent = activePawn.atk ?? 0;
    if (el('def')) el('def').textContent = activePawn.def ?? 0;
    if (el('spd')) el('spd').textContent = activePawn.spd ?? 0;
    if (el('max-spd')) el('max-spd').textContent = activePawn.maxSpd ?? 0;
    if (el('mp')) el('mp').textContent = activePawn.mp ?? 0;
    if (el('max-mp')) el('max-mp').textContent = activePawn.maxMp ?? 0;
    if (el('board-species')) el('board-species').textContent = spirit.species || 'None';
    if (el('board-type')) el('board-type').textContent = spirit.type || 'None';
    if (el('species-active')) el('species-active').innerHTML = `<strong>Species Skill:</strong> ${spirit.speciesActive || 'None'}`;
    if (el('type-active')) el('type-active').innerHTML = `<strong>Type Skill:</strong> ${spirit.typeActive || 'None'}`;
}

function refreshPawnDropdown() {
    const select = document.getElementById('pawn-select');
    if (!select) return;
    const savedSpirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    const names = savedSpirits.map(s => s.name);
    select.innerHTML = `<option value="">Select Spirit</option>` + names.map(n => `<option value="${n}">${n}</option>`).join('');
}

// ——— NAVIGATION ———
document.addEventListener('DOMContentLoaded', () => {
    const gridBtn = document.querySelector('[data-mode="board-hub"]');
    if (gridBtn) {
        gridBtn.addEventListener('click', () => {
            if (!boardInitialized) window.initBattleBoard();
        });
    }
});