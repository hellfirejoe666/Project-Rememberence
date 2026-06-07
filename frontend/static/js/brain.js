// js/brain.js
let isInitialized = false;

function initBrain() {
    if (isInitialized) return;
    const required = ['animalSigns', 'starSigns', 'bioToVerse', 'narrativeMatrix'];
    const missing = required.filter(c => !window[c]);
    if (missing.length) return;
    isInitialized = true;
}
initBrain();

function selectBiorhythm(bios, abstraction) {
    const bioKeys = ['MNF', 'SPL', 'BEU', 'STR', 'FND', 'KNO', 'UND', 'WIS', 'VIT', 'SEX', 'DIV', 'EGO'];
    const bioValues = bioKeys.map(key => bios[key] || 0);
    const allZero = bioValues.every(val => val === 0);
    if (allZero) {
        const primaryIndex = Math.floor(Math.random() * bioKeys.length);
        let secondaryIndex = Math.floor(Math.random() * (bioKeys.length - 1));
        if (secondaryIndex >= primaryIndex) secondaryIndex++;
        return {
            primary: { key: bioKeys[primaryIndex], value: 5 },
            secondary: { key: bioKeys[secondaryIndex], value: 3 }
        };
    }
    
    const weights = bioValues.map(value => {
        if (abstraction >= 50) {
            return Math.max(0, 10 - Math.abs(value));
        } else if (abstraction <= -50) {
            return Math.max(0, Math.abs(value));
        } else {
            return 1;
        }
    });
    const totalWeight = weights.reduce((sum, w) => sum + w, 0) || 1;
    let randomWeight = Math.random() * totalWeight;
    let primaryIndex = 0;
    for (let i = 0; i < weights.length; i++) {
        randomWeight -= weights[i];
        if (randomWeight <= 0) {
            primaryIndex = i;
            break;
        }
    }
    const primaryBio = bioKeys[primaryIndex];
    
    const secondaryWeights = weights.map((w, i) => i === primaryIndex ? 0 : w);
    const secondaryTotalWeight = secondaryWeights.reduce((sum, w) => sum + w, 0) || 1;
    randomWeight = Math.random() * secondaryTotalWeight;
    let secondaryIndex = 0;
    for (let i = 0; i < secondaryWeights.length; i++) {
        randomWeight -= secondaryWeights[i];
        if (randomWeight <= 0) {
            secondaryIndex = i;
            break;
        }
    }
    const secondaryBio = bioKeys[secondaryIndex];
    
    return {
        primary: { key: primaryBio, value: bios[primaryBio] || 0 },
        secondary: { key: secondaryBio, value: bios[secondaryBio] || 0 }
    };
}


// ——— LOYALTY RANK SYSTEM ———
function applyLoyaltyRank(spirit, target, delta) {
    if (!spirit.loyaltyMap) spirit.loyaltyMap = {};
    if (!spirit.loyaltyRank) spirit.loyaltyRank = {};

    let loyalty = spirit.loyaltyMap[target] || 0;
    let rank = spirit.loyaltyRank[target] || 0;

    loyalty = Math.max(-100, Math.min(100, loyalty + delta)); // CLAMP FIRST

    while (loyalty >= 100) { loyalty -= 100; rank++; }
    while (loyalty <= -100) { loyalty += 100; rank--; }

    spirit.loyaltyMap[target] = loyalty;
    spirit.loyaltyRank[target] = rank;

    console.log(`${spirit.name} → ${target}: Rank ${rank} @ ${loyalty}`);
}



function decayThoughts(spirit) {
    let bios = window.calculateBiorhythms?.(spirit.animal, spirit.star) || 
               { MNF: 5, SPL: 0, BEU: 0, STR: 0, FND: 0, KNO: 0, UND: 0, WIS: 0, VIT: 0, SEX: 0, DIV: 0, EGO: 0 };
    const baseThoughts = window.generateThoughts(bios);
    spirit.thoughts = spirit.thoughts || baseThoughts;
    
    const stateMagnitude = Math.abs(spirit.thoughts.State || 0);
    const stateFactor = 5 + (stateMagnitude / 100);
    
    for (const key in spirit.thoughts) {
        if (key !== 'State') {
            const currentValue = spirit.thoughts[key] || 0;
            const baseValue = baseThoughts[key] || 0;
            if (currentValue !== baseValue) {
                const valueDistance = Math.abs(currentValue - baseValue);
                const decayRate = Math.round(1 + (valueDistance / 50) * stateFactor);
                const decay = currentValue > baseValue ? -decayRate : decayRate;
                spirit.thoughts[key] = Math.max(-100, Math.min(100, Math.round(currentValue + decay)));
            }
        }
    }
    spirit.thoughts.State = Math.round(Object.values(spirit.thoughts).slice(0, -1).reduce((sum, val) => sum + val, 0));
    return spirit;
}



function decayLoyalty(spirit) {
    spirit.loyaltyMap = spirit.loyaltyMap || {};
    const stateValue = spirit.thoughts?.State || 0;
    const stateMagnitude = Math.abs(stateValue);
    const isPositiveState = stateValue > 0;
    const isNegativeState = stateValue < 0;
    
    for (const target in spirit.loyaltyMap) {
        let currentValue = spirit.loyaltyMap[target];
        if (!currentValue || Math.abs(currentValue) < 5) continue;

        const valueDistance = Math.abs(currentValue);
        const isNegativeLoyalty = currentValue < 0;
        const stateFactor = 1 + (stateMagnitude / 100);
        const decayRate = Math.max(1, Math.round((valueDistance / 100) * stateFactor));
        const decay = currentValue > 0 ? -decayRate : decayRate;

        window.applyLoyaltyRank(spirit, target, decay);
    }
    return spirit;
}



function cleanupLoyaltyData() {
    let spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    const validNames = spirits.map(s => s.name);

    spirits = spirits.map(spirit => {
        spirit.loyaltyMap = spirit.loyaltyMap || {};
        spirit.loyaltyRank = spirit.loyaltyRank || {};

        const validMap = Object.fromEntries(
            Object.entries(spirit.loyaltyMap).filter(([name]) => validNames.includes(name))
        );
        const validRank = Object.fromEntries(
            Object.entries(spirit.loyaltyRank).filter(([name]) => validNames.includes(name))
        );

        if (JSON.stringify(spirit.loyaltyMap) !== JSON.stringify(validMap) ||
            JSON.stringify(spirit.loyaltyRank) !== JSON.stringify(validRank)) {
            spirit.loyaltyMap = validMap;
            spirit.loyaltyRank = validRank;
            console.log(`${spirit.name}: purged ghost loyalty/rank`);
        }
        return spirit;
    });

    localStorage.setItem('rememberenceSpirits', JSON.stringify(spirits));
}



function selectVerse(spirit, state) {
    const bios = calculateBiorhythms(spirit.animal, spirit.star);
    const { primary } = selectBiorhythm(bios, spirit.thoughts?.Abstraction || 0);
    const bioKey = primary.key;
    const verseState = state > 0 ? 'dominant' : 'recessive';

    // 1. Bio-driven verse (30% chance)
    if (Math.random() < 0.3) {
        const verse = bioToVerse[bioKey]?.[verseState] || 'Prologue';
        return { topic: verse, type: 'verse' };
    }

    // 2. Bio → Thought → Skill Weight
    const thoughts = spirit.thoughts || {};
    const bioThought = bioToThought[bioKey] || { key: 'State', sign: 1 };
    const thoughtValue = Math.max(-100, Math.min(100, (thoughts[bioThought.key] || 0) * bioThought.sign));
    const skillBoost = Math.max(0, thoughtValue) / 50;

    // 3. Topic Pool — single 'skill' bucket
    const topicPool = [
        { type: 'animal',   value: [spirit.animal].filter(Boolean),             weight: 1 },
        { type: 'star',     value: [spirit.star].filter(Boolean),               weight: 1 },
        { type: 'species',  value: [spirit.species, spirit.species2].filter(Boolean), weight: 1 },
        { type: 'type',     value: [spirit.type, spirit.type2].filter(Boolean), weight: 1 },
        { type: 'skill',    value: [
            spirit.meleeSkill, spirit.rangedSkill, spirit.magicSkill,
            spirit.stepSkill, spirit.specialSkill, spirit.tranceSkill
        ].filter(Boolean), weight: 1 + skillBoost }
    ].filter(t => t.value.length > 0);

    if (topicPool.length === 0) return { topic: 'Prologue', type: 'verse' };

    const totalWeight = topicPool.reduce((sum, t) => sum + t.weight, 0);
    let r = Math.random() * totalWeight;
    let selected = topicPool[0];
    for (const t of topicPool) {
        r -= t.weight;
        if (r <= 0) { selected = t; break; }
    }

    const topicValue = selected.value[Math.floor(Math.random() * selected.value.length)];
    return { topic: topicValue, type: selected.type };
}



function simulateSpiritPosts(spirit) {
    let spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    if (spirits.length === 0) return;
    const selectedSpirit = spirit || spirits[Math.floor(Math.random() * spirits.length)];
    let bios = window.calculateBiorhythms(selectedSpirit.animal, selectedSpirit.star);
    
    const selection = window.selectBiorhythm(bios, selectedSpirit.thoughts?.Abstraction || 0);
    let dominantBioKey = selection.primary.value >= selection.secondary.value ? selection.primary.key : selection.secondary.key;
    let dominantBioValue = selection.primary.value >= selection.secondary.value ? selection.primary.value : selection.secondary.value;
    let recessiveBioKey = selection.primary.value >= selection.secondary.value ? selection.secondary.key : selection.secondary.key;
    let recessiveBioValue = selection.primary.value >= selection.secondary.value ? selection.secondary.value : selection.secondary.value;
    
    selectedSpirit.thoughts = selectedSpirit.thoughts || window.generateThoughts(bios);
    const thoughtKey = window.bioToThought?.[dominantBioKey]?.key || 'State';
    const thoughtSign = window.bioToThought?.[dominantBioKey]?.sign || 1;
    selectedSpirit.thoughts[thoughtKey] = Math.max(-100, Math.min(100, Math.round((selectedSpirit.thoughts[thoughtKey] || 0) + thoughtSign * Math.abs(dominantBioValue))));
    selectedSpirit.thoughts.State = Math.round(Object.values(selectedSpirit.thoughts).slice(0, -1).reduce((sum, val) => sum + val, 0));
    
    selectedSpirit.loyaltyMap = selectedSpirit.loyaltyMap || {};
    selectedSpirit.loyaltyRank = selectedSpirit.loyaltyRank || {};
    const validSpirits = spirits.map(s => s.name);

    spirits = spirits.map(s => s.name === selectedSpirit.name ? selectedSpirit : s);
    localStorage.setItem('rememberenceSpirits', JSON.stringify(spirits));
    window.cleanupLoyaltyData();
    
    const { topic, type } = window.selectVerse(selectedSpirit, selectedSpirit.thoughts.State, selectedSpirit.thoughts.Emotion || 0);
    const content = `${selectedSpirit.name}: "${topic}" (Dominant: ${dominantBioKey}=${dominantBioValue}, Recessive: ${recessiveBioKey}=${recessiveBioValue}, Type: ${type})`;
    const postId = window.savePost(content, null, selectedSpirit.name);
    console.log('Spirit post created:', postId, 'content:', content);
    if (!window.activePostId && window.activeView === 'timeline') window.loadTimeline();
    window.updateSpiritPosts(selectedSpirit.name);
}



function simulateSpiritReplies(spirit) {
    let posts = JSON.parse(localStorage.getItem('rememberencePosts') || '[]');
    const eligiblePosts = posts.filter(p => p.author !== spirit.name && p.author !== 'Player');
    if (eligiblePosts.length === 0) return;
    
    const subconsciousValue = spirit.thoughts?.Subconscious || 0;
    if (Math.random() >= 0.5 + 0.5 * (subconsciousValue / 100)) return;
    
    spirit.loyaltyMap = spirit.loyaltyMap || {};
    const loyaltyPosts = eligiblePosts.filter(p => spirit.loyaltyMap[p.author] !== undefined);
    const perceptionFactor = (spirit.thoughts?.Perception || 0) / 100;
    let targetPost;
    
    if (loyaltyPosts.length > 0) {
        if (perceptionFactor >= 0.5) {
            const maxLoyalty = Math.max(...loyaltyPosts.map(p => Math.abs(spirit.loyaltyMap[p.author] || 0)));
            const maxLoyaltyPosts = loyaltyPosts.filter(p => Math.abs(spirit.loyaltyMap[p.author] || 0) === maxLoyalty);
            targetPost = maxLoyaltyPosts[Math.floor(Math.random() * maxLoyaltyPosts.length)];
        } else {
            const totalWeight = loyaltyPosts.reduce((sum, post) => sum + Math.abs(spirit.loyaltyMap[post.author] || 0), 0);
            let randomWeight = Math.random() * totalWeight;
            for (const post of loyaltyPosts) {
                randomWeight -= Math.abs(spirit.loyaltyMap[post.author] || 0);
                if (randomWeight <= 0) {
                    targetPost = post;
                    break;
                }
            }
            if (!targetPost) targetPost = loyaltyPosts[loyaltyPosts.length - 1];
        }
    } else {
        targetPost = eligiblePosts[Math.floor(Math.random() * eligiblePosts.length)];
    }
    
    let spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    const initiator = spirits.find(s => s.name === targetPost.author);
    if (!initiator) return;
    
    // ——— Biorhythms ———
    const initiatorBios = calculateBiorhythms(initiator.animal, initiator.star);
    const responderBios = calculateBiorhythms(spirit.animal, spirit.star);
    
    // ——— Biorhythm Selection ———
    const initiatorSelection = selectBiorhythm(initiatorBios, spirit.thoughts?.Abstraction || 0);
    const responderSelection = selectBiorhythm(responderBios, spirit.thoughts?.Abstraction || 0);
    
    const posterDomKey = responderSelection.primary.key;     // spirit (poster)
    const posterRecKey = responderSelection.secondary.key;
    const responderDomKey = initiatorSelection.primary.key;   // initiator (target)
    const responderRecKey = initiatorSelection.secondary.key;
    
    // ——— Dual Check: Poster Dom vs Responder Rec ———
    const posterDomValue = responderBios[posterDomKey] || 0;
    const responderRecValue = initiatorBios[responderRecKey] || 0;
    const posterToResponderDelta = (posterDomValue - responderRecValue) + spirit.thoughts.State;
    
    // ——— Dual Check: Responder Dom vs Poster Rec ———
    const responderDomValue = initiatorBios[responderDomKey] || 0;
    const posterRecValue = responderBios[posterRecKey] || 0;
    const responderToPosterDelta = (responderDomValue - posterRecValue) + spirit.thoughts.State;
    
    // ——— Apply to Both Loyalties ———
    applyLoyaltyRank(spirit, initiator.name, Math.round(posterToResponderDelta));
    applyLoyaltyRank(initiator, spirit.name, Math.round(responderToPosterDelta));
    
    // ——— Update Poster Thoughts (spirit) ———
    spirit.thoughts = spirit.thoughts || generateThoughts(responderBios);
    const thoughtKey = bioToThought?.[posterDomKey]?.key || 'State';
    const thoughtSign = bioToThought?.[posterDomKey]?.sign || 1;
    spirit.thoughts[thoughtKey] = Math.max(-100, Math.min(100, Math.round((spirit.thoughts[thoughtKey] || 0) + thoughtSign * Math.abs(posterDomValue))));
    spirit.thoughts.State = Math.round(Object.values(spirit.thoughts).slice(0, -1).reduce((sum, val) => sum + val, 0));
    
    // ——— Update Responder Thoughts (initiator) ———
    initiator.thoughts = initiator.thoughts || generateThoughts(initiatorBios);
    const initThoughtKey = bioToThought?.[responderDomKey]?.key || 'State';
    const initThoughtSign = bioToThought?.[responderDomKey]?.sign || 1;
    initiator.thoughts[initThoughtKey] = Math.max(-100, Math.min(100, Math.round((initiator.thoughts[initThoughtKey] || 0) + initThoughtSign * Math.abs(responderDomValue))));
    initiator.thoughts.State = Math.round(Object.values(initiator.thoughts).slice(0, -1).reduce((sum, val) => sum + val, 0));
    
    // ——— Save Both ———
    spirits = spirits.map(s => {
        if (s.name === spirit.name) return spirit;
        if (s.name === initiator.name) return initiator;
        return s;
    });
    localStorage.setItem('rememberenceSpirits', JSON.stringify(spirits));
    cleanupLoyaltyData();

    // ——— Generate Reply ———
    const { topic, type } = selectVerse(spirit, spirit.thoughts.State);
    const content = `${spirit.name}: "${topic}" (Dominant: ${posterDomKey}=${posterDomValue}, Recessive: ${posterRecKey}=${responderBios[posterRecKey]}, Type: ${type})`;
    const postId = savePost(content, targetPost.id, spirit.name);

    // ——— UI Updates ———
    const newCount = getReplyCount(targetPost.id);
    const replyButton = document.querySelector(`#post-${targetPost.id} .reply-button`);
    if (replyButton) replyButton.textContent = `${newCount} repl${newCount === 1 ? 'y' : 'ies'}`;
    if (activePostId === targetPost.id) showSelectedPost(targetPost.id);
    else if (!activePostId && activeView === 'timeline') loadTimeline();
    updateSpiritPosts(spirit.name);
    if (activeView === 'sheet' && activeSpirit === spirit.name && activeSpiritView === 'replies') updateSpiritReplies(spirit.name);
}



function replyToPost(postId, spiritName) {
    if (!spiritName) {
        alert('Please select a spirit to reply as.');
        return;
    }
    let spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    const responder = spirits.find(s => s.name.toLowerCase() === spiritName.toLowerCase());
    if (!responder) {
        alert('Spirit not found. Please choose a valid spirit name.');
        return;
    }
    let posts = JSON.parse(localStorage.getItem('rememberencePosts') || '[]');
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost || targetPost.author === 'Player') return;
    
    const initiator = spirits.find(s => s.name === targetPost.author);
    if (!initiator) return;

    let initiatorBios = window.calculateBiorhythms(initiator.animal, initiator.star) || { MNF: 5, SPL: 0, BEU: 0, STR: 0, FND: 0, KNO: 0, UND: 0, WIS: 0, VIT: 0, SEX: 0, DIV: 0, EGO: 0 };
    let responderBios = window.calculateBiorhythms(responder.animal, responder.star) || { MNF: 5, SPL: 0, BEU: 0, STR: 0, FND: 0, KNO: 0, UND: 0, WIS: 0, VIT: 0, SEX: 0, DIV: 0, EGO: 0 };

    const initiatorSelection = window.selectBiorhythm(initiatorBios, responder.thoughts?.Abstraction || 0);
    const responderSelection = window.selectBiorhythm(responderBios, responder.thoughts?.Abstraction || 0);

    let dominantBioKey = responderSelection.primary.value >= responderSelection.secondary.value ? responderSelection.primary.key : responderSelection.secondary.key;
    let dominantBioValue = responderSelection.primary.value >= responderSelection.secondary.value ? responderSelection.primary.value : responderSelection.secondary.value;
    let recessiveBioKey = responderSelection.primary.value >= responderSelection.secondary.value ? responderSelection.secondary.key : responderSelection.primary.key;
    let recessiveBioValue = responderSelection.primary.value >= responderSelection.secondary.value ? responderSelection.secondary.value : responderSelection.primary.value;

    const initiatorBioValue = initiatorBios[dominantBioKey] || 0;
    const responderBioValue = responderBios[dominantBioKey] || 0;
    const responderStateImpact = Math.max(-100, Math.min(100, responder.thoughts.State || 0));
    const initiatorStateImpact = Math.max(-100, Math.min(100, initiator.thoughts?.State || 0));
    const responderConscious = 1 + (responder.thoughts?.Conscious || 0) / 100;
    const initiatorConscious = 1 + (initiator.thoughts?.Conscious || 0) / 100;

    let responderChange = ((initiatorBioValue - responderBioValue) + responderStateImpact) * responderConscious;
    let initiatorChange = ((responderBioValue - initiatorBioValue) + initiatorStateImpact) * initiatorConscious;

    responderChange = Math.round(responderChange);
    initiatorChange = Math.round(initiatorChange);

    window.applyLoyaltyRank(responder, targetPost.author, responderChange);
    window.applyLoyaltyRank(initiator, responder.name, initiatorChange);

    responder.thoughts = responder.thoughts || window.generateThoughts(responderBios);
    const thoughtKey = window.bioToThought?.[dominantBioKey]?.key || 'State';
    const thoughtSign = window.bioToThought?.[dominantBioKey]?.sign || 1;
    responder.thoughts[thoughtKey] = Math.max(-100, Math.min(100, Math.round((responder.thoughts[thoughtKey] || 0) + thoughtSign * Math.abs(dominantBioValue))));
    responder.thoughts.State = Math.round(Object.values(responder.thoughts).slice(0, -1).reduce((sum, val) => sum + val, 0));

    initiator.thoughts = initiator.thoughts || window.generateThoughts(initiatorBios);
    const initiatorThoughtKey = window.bioToThought?.[dominantBioKey]?.key || 'State';
    const initiatorThoughtSign = window.bioToThought?.[dominantBioKey]?.sign || 1;
    initiator.thoughts[initiatorThoughtKey] = Math.max(-100, Math.min(100, Math.round((initiator.thoughts[initiatorThoughtKey] || 0) + initiatorThoughtSign * Math.abs(initiatorBioValue))));
    initiator.thoughts.State = Math.round(Object.values(initiator.thoughts).slice(0, -1).reduce((sum, val) => sum + val, 0));

    spirits = spirits.map(s => {
        if (s.name === responder.name) return responder;
        if (s.name === initiator.name) return initiator;
        return s;
    });
    localStorage.setItem('rememberenceSpirits', JSON.stringify(spirits));
    window.cleanupLoyaltyData();

    const { topic, type } = window.selectVerse(responder, responder.thoughts.State, responder.thoughts.Emotion || 0);
    const content = `${responder.name}: "${topic}" (Dominant: ${dominantBioKey}=${dominantBioValue}, Recessive: ${recessiveBioKey}=${recessiveBioValue}, Type: ${type})`;
    const newPostId = window.savePost(content, postId, responder.name);

    const newCount = window.getReplyCount(postId);
    const replyButton = document.querySelector(`#post-${postId} .reply-button`);
    if (replyButton) {
        replyButton.textContent = `${newCount} repl${newCount === 1 ? 'y' : 'ies'}`;
    }
    if (newPostId && window.activePostId === postId) {
        window.showSelectedPost(postId);
    } else if (newPostId && !window.activePostId && window.activeView === 'timeline') {
        window.loadTimeline();
    }
    window.updateSpiritPosts(responder.name);
    if (window.activeView === 'sheet' && window.activeSpirit === responder.name && window.activeSpiritView === 'replies') {
        window.updateSpiritReplies(responder.name);
    }
}


function postToTimeline(spiritName) {
    console.log('postToTimeline called with spiritName:', spiritName, 'spiritPostInterval:', !!spiritPostInterval, 'spiritReplyIntervals:', spiritReplyIntervals.length);
    let spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    const spirit = spirits.find(s => s.name.toLowerCase() === spiritName.toLowerCase());
    if (!spirit) {
        alert('Spirit not found. Please choose a valid spirit name.');
        return;
    }
    
    let bios = calculateBiorhythms(spirit.animal, spirit.star) || { MNF: 5, SPL: 0, BEU: 0, STR: 0, FND: 0, KNO: 0, UND: 0, WIS: 0, VIT: 0, SEX: 0, DIV: 0, EGO: 0 };
    console.log('postToTimeline bios:', bios);
    
    const selection = selectBiorhythm(bios, spirit.thoughts?.Abstraction || 0);
    let dominantBioKey = selection.primary.value >= selection.secondary.value ? selection.primary.key : selection.secondary.key;
    let dominantBioValue = selection.primary.value >= selection.secondary.value ? selection.primary.value : selection.secondary.value;
    let recessiveBioKey = selection.primary.value >= selection.secondary.value ? selection.secondary.key : selection.secondary.key;
    let recessiveBioValue = selection.primary.value >= selection.secondary.value ? selection.secondary.value : selection.secondary.value;
    
    spirit.thoughts = spirit.thoughts || generateThoughts(bios);
    const thoughtKey = bioToThought?.[dominantBioKey]?.key || 'State';
    const thoughtSign = bioToThought?.[dominantBioKey]?.sign || 1;
    spirit.thoughts[thoughtKey] = Math.max(-100, Math.min(100, Math.round((spirit.thoughts[thoughtKey] || 0) + thoughtSign * Math.abs(dominantBioValue))));
    spirit.thoughts.State = Math.round(Object.values(spirit.thoughts).slice(0, -1).reduce((sum, val) => sum + val, 0));
    
    spirit.loyaltyMap = spirit.loyaltyMap || {};
spirit.loyaltyRank = spirit.loyaltyRank || {};
const validSpirits = spirits.map(s => s.name);
spirit.loyaltyMap = Object.fromEntries(
    Object.entries(spirit.loyaltyMap).filter(([name, _]) => validSpirits.includes(name))
);
    spirits = spirits.map(s => s.name === spirit.name ? spirit : s);
    localStorage.setItem('rememberenceSpirits', JSON.stringify(spirits));
    
    const { topic, type } = selectVerse(spirit, spirit.thoughts.State, spirit.thoughts.Emotion || 0);
    const content = `${spirit.name}: "${topic}" (Dominant: ${dominantBioKey}=${dominantBioValue}, Recessive: ${recessiveBioKey}=${recessiveBioValue}, Type: ${type})`;
    const postId = savePost(content, null, spirit.name);
    console.log('Spirit post created:', postId, 'content:', content);
    if (!activePostId && activeView === 'timeline') loadTimeline();
    updateSpiritPosts(spirit.name);
}



function updateSpiritPostInterval() {
    if (window.spiritPostInterval) clearInterval(window.spiritPostInterval);
    let spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    if (spirits.length === 0) return;
    
    const averageState = spirits.reduce((sum, s) => sum + Math.abs(s.thoughts?.State || 0), 0) / spirits.length;
    const averageEnvironment = spirits.reduce((sum, s) => sum + (s.thoughts?.Environment || 0), 0) / spirits.length;
    const stateFactor = 0.3 * (averageState / 600);
    const environmentFactor = 0.2 * (averageEnvironment / 100);
    const postInterval = 5000 * Math.max(0.5, Math.min(1.5, 1 - stateFactor - environmentFactor));
    
    window.spiritPostInterval = setInterval(() => {
        const currentSpirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
        if (currentSpirits.length === 0) return;
        const spirit = currentSpirits[Math.floor(Math.random() * currentSpirits.length)];
        window.simulateSpiritPosts(spirit);
    }, postInterval);

    console.log('Spirit post interval set:', postInterval, 'ms');
}



function updateSpiritReplyIntervals() {
    if (window.spiritReplyIntervals) {
        window.spiritReplyIntervals.forEach(interval => clearInterval(interval));
        window.spiritReplyIntervals = [];
    }
    let spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    if (spirits.length === 0) return;

    window.spiritReplyIntervals = spirits.map(spirit => {
        window.decayThoughts(spirit);
        window.decayLoyalty(spirit);

        let bios = window.calculateBiorhythms?.(spirit.animal, spirit.star) || 
                   { MNF: 5, SPL: 0, BEU: 0, STR: 0, FND: 0, KNO: 0, UND: 0, WIS: 0, VIT: 0, SEX: 0, DIV: 0, EGO: 0 };
        if (!spirit.thoughts) {
            spirit.thoughts = window.generateThoughts(bios);
        }
        const stateMagnitude = Math.abs(spirit.thoughts.State || 0);
        const environmentValue = spirit.thoughts.Environment || 0;
        const stateFactor = 0.3 * (stateMagnitude / 600);
        const environmentFactor = 0.2 * (environmentValue / 100);
        const interval = 15000 * Math.max(0.5, Math.min(1.5, 1 - stateFactor - environmentFactor));

        return setInterval(() => {
            let currentSpirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
            let currentSpirit = currentSpirits.find(s => s.name === spirit.name);
            if (!currentSpirit) return;

            currentSpirit = window.decayThoughts(currentSpirit);
            currentSpirit = window.decayLoyalty(currentSpirit);
            window.simulateSpiritReplies(currentSpirit);

            currentSpirits = currentSpirits.map(s => 
                s.name === currentSpirit.name ? currentSpirit : 
                s.name === window.initiator?.name ? window.initiator : s
            );
            localStorage.setItem('rememberenceSpirits', JSON.stringify(currentSpirits));
            window.cleanupLoyaltyData();
        }, interval);
    });
    
    window.lastSpiritCount = spirits.length;
    console.log('Reply intervals restored:', window.spiritReplyIntervals.length);
}