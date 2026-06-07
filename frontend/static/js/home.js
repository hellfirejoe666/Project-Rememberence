let spiritPostInterval = null;
let spiritReplyIntervals = [];
let activePostId = null;
let lastSpiritCount = 0;
let sidebarUpdateInterval = null;
let activeView = 'timeline';
let activeSpirit = null;
let activeSpiritView = 'posts';




// ——— AUTO-REFRESH DROPDOWN ———
function refreshSpiritDropdown() {
    const select = document.getElementById('spirit-select');
    if (!select) return;

    const currentValue = select.value;
    const spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    const spiritNames = spirits.map(s => s.name);

    // Only rebuild if names changed
    const currentNames = Array.from(select.options).slice(1).map(opt => opt.value);
    if (JSON.stringify(currentNames) === JSON.stringify(spiritNames)) {
        return;
    }

    // Rebuild dropdown
    select.innerHTML = `<option value="">Select Spirit</option>` +
        spiritNames.map(name => `<option value="${name}">${name}</option>`).join('');

    // Restore selection
    if (currentValue && spiritNames.includes(currentValue)) {
        select.value = currentValue;
    }

    // Update intervals if spirit count changed
    if (spirits.length !== lastSpiritCount) {
        updateSpiritReplyIntervals();
    }

    console.log('Dropdown refreshed:', spirits.length, 'spirits');
}

// ——— INITIAL SETUP ———
function initHomeHub() {
    const hub = document.getElementById('home-hub');
    if (!hub) return;

    hub.innerHTML = `
        <div class="spirit-sidebar" id="spirit-sidebar"></div>
        <div class="post-section">
            <div style="display: flex; justify-content: center; margin-bottom: 10px;">
                <select id="spirit-select" style="padding: 5px; width: 200px;">
                    <option value="">Select Spirit</option>
                </select>
            </div>
            <div class="button-group" style="display: flex; flex-direction: row; gap: 10px; margin: 10px 0; justify-content: center;">
                <button id="post-command">Post as Spirit</button>
                <button id="refresh-timeline">Timeline</button>
                <button id="clear-timeline">Clear</button>
                <button id="load-spirit">Load Spirit</button>
            </div>
            <div id="timeline"></div>
            <div id="selected-post" style="display: none;"></div>
        </div>
    `;

    // ——— EVENT LISTENERS ———
    hub.addEventListener('click', (e) => {
    const spiritName = document.getElementById('spirit-select').value;
    if (e.target.id === 'post-command') {
        if (!spiritName) { alert('Please select a spirit.'); return; }
        postToTimeline(spiritName);
    } else if (e.target.id === 'refresh-timeline') {
        activeView = 'timeline'; activeSpirit = null; activeSpiritView = 'posts';
        loadTimeline();
    } else if (e.target.id === 'clear-timeline') {
        activeView = 'timeline'; activeSpirit = null; activeSpiritView = 'posts';
        clearTimeline();
    } else if (e.target.id === 'load-spirit') {
        if (!spiritName) { alert('Please select a spirit.'); return; }
        activeView = 'sheet'; activeSpirit = spiritName; activeSpiritView = 'posts';
        loadSpiritSheet(spiritName);
    } else if (e.target.classList.contains('reply-button')) {
        const postId = e.target.getAttribute('data-post-id');
        const responderName = document.getElementById('spirit-select').value;

        if (!responderName) {
            alert('Select a spirit to reply with.');
            return;
        }

        replyToPost(postId, responderName);
    } else if (e.target.id === 'recent-posts-btn') {
        activeSpiritView = 'posts'; updateSpiritPosts(activeSpirit);
    } else if (e.target.id === 'recent-replies-btn') {
        activeSpiritView = 'replies'; updateSpiritReplies(activeSpirit);
    } else if (e.target.closest('.post-box')) {
        const postId = e.target.closest('.post-box').id.replace('post-', '');
        activeView = 'post'; activeSpiritView = 'posts';
        showSelectedPost(postId);
    }
});

    // ——— INITIAL LOAD ———
    refreshSpiritDropdown();
    activeView = 'timeline';
    loadTimeline();

    if (!spiritPostInterval) updateSpiritPostInterval();
    if (spiritReplyIntervals.length === 0) updateSpiritReplyIntervals();

    // ——— AUTO-REFRESH EVERY 2 SECONDS ———
    setInterval(refreshSpiritDropdown, 2000);
    cleanupLoyaltyData();
    console.log('Home Hub initialized: Auto-refresh enabled');
}




function updateSpiritPosts(spiritName) {
    if (activeView !== 'sheet' || activeSpirit !== spiritName) return;
    const postsContainer = document.querySelector('#spirit-posts-container');
    if (!postsContainer) return;
    let posts = JSON.parse(localStorage.getItem('rememberencePosts') || '[]');
    const spiritPosts = posts.filter(p => p.author === spiritName && !p.parentId).sort((a, b) => b.timestamp - a.timestamp);
    postsContainer.innerHTML = '';
    if (spiritPosts.length === 0) {
        postsContainer.innerHTML = '<p>No top-layer posts found for this spirit.</p>';
    } else {
        spiritPosts.forEach(post => {
            const postElement = createPostElement(post, false);
            postElement.style.marginBottom = '10px';
            postsContainer.appendChild(postElement);
        });
    }
    document.getElementById('recent-posts-btn').classList.add('active');
    document.getElementById('recent-replies-btn').classList.remove('active');
    console.log(`Updated posts for ${spiritName}: ${spiritPosts.length} top-layer posts`);
}




function updateSpiritReplies(spiritName) {
    if (activeView !== 'sheet' || activeSpirit !== spiritName) return;
    const postsContainer = document.querySelector('#spirit-posts-container');
    if (!postsContainer) return;
    let posts = JSON.parse(localStorage.getItem('rememberencePosts') || '[]');
    const spiritReplies = posts.filter(p => p.author === spiritName && p.parentId).sort((a, b) => b.timestamp - a.timestamp);
    postsContainer.innerHTML = '';
    if (spiritReplies.length === 0) {
        postsContainer.innerHTML = '<p>No replies found for this spirit.</p>';
    } else {
        spiritReplies.forEach(post => {
            const postElement = createPostElement(post, false);
            postElement.style.marginBottom = '10px';
            postsContainer.appendChild(postElement);
        });
    }
    document.getElementById('recent-posts-btn').classList.remove('active');
    document.getElementById('recent-replies-btn').classList.add('active');
    console.log(`Updated replies for ${spiritName}: ${spiritReplies.length} replies`);
}




function loadSpiritSheet(spiritName) {
    const spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    if (spirits.length === 0) {
        console.warn('No saved spirits found');
        alert('No saved spirits found.');
        return;
    }
    const spirit = spirits.find(s => s.name.toLowerCase() === spiritName.toLowerCase());
    if (spirit) {
        const bios = calculateBiorhythms(spirit.animal, spirit.star);
        spirit.thoughts = spirit.thoughts || generateThoughts(bios);
        localStorage.setItem('rememberenceSpirits', JSON.stringify(spirits));
        const selectedPostContainer = document.getElementById('selected-post');
        const timeline = document.getElementById('timeline');
        if (!selectedPostContainer || !timeline) return;
        timeline.style.display = 'none';
        selectedPostContainer.style.display = 'block';
        selectedPostContainer.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.style.padding = '20px';
        wrapper.style.maxWidth = '600px';
        wrapper.style.margin = '0 auto';
        wrapper.innerHTML = `
            <div class="data-card">
                <h3>${spirit.name}'s Profile</h3>
                <p><strong>Description:</strong> ${spirit.description || 'No description'}</p>
                <p><strong>Animal Sign:</strong> ${spirit.animal || 'Rat'}</p>
                <p><strong>Star Sign:</strong> ${spirit.star || 'Aries'}</p>
                <p><strong>Species:</strong> ${spirit.species || 'None'} / ${spirit.species2 || 'None'}</p>
                <p><strong>Species Active Skill:</strong> ${spirit.speciesActive || 'None'}</p>
                <p><strong>Type:</strong> ${spirit.type || 'None'} / ${spirit.type2 || 'None'}</p>
                <p><strong>Type Active Skill:</strong> ${spirit.typeActive || 'None'}</p>
                <h4>Skills:</h4>
                <ul>
                    <li><strong>Melee:</strong> ${spirit.meleeSkill || 'None'}</li>
                    <li><strong>Ranged:</strong> ${spirit.rangedSkill || 'None'}</li>
                    <li><strong>Magic:</strong> ${spirit.magicSkill || 'None'}</li>
                    <li><strong>Step:</strong> ${spirit.stepSkill || 'None'}</li>
                    <li><strong>Special:</strong> ${spirit.specialSkill || 'None'}</li>
                    <li><strong>Trance:</strong> ${spirit.tranceSkill || 'None'}</li>
                </ul>
                <p><strong>Level:</strong> ${spirit.level || 1}</p>
            </div>
            <div class="spirit-posts" style="margin-top: 20px;">
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button id="recent-posts-btn" class="active">Recent Posts</button>
                    <button id="recent-replies-btn">Recent Replies</button>
                </div>
                <div id="spirit-posts-container"></div>
            </div>
        `;
        selectedPostContainer.appendChild(wrapper);
        
        if (activeSpiritView === 'posts') {
            updateSpiritPosts(spiritName);
        } else {
            updateSpiritReplies(spiritName);
        }
        
        if (sidebarUpdateInterval) {
            clearInterval(sidebarUpdateInterval);
            sidebarUpdateInterval = null;
        }
        showSpiritSidebar(spirit.name, null);
        sidebarUpdateInterval = setInterval(() => {
            showSpiritSidebar(spirit.name, null);
        }, 1000);
        console.log(`Loaded spirit ${spirit.name} with thoughts: ${JSON.stringify(spirit.thoughts)} and ${JSON.parse(localStorage.getItem('rememberencePosts') || '[]').filter(p => p.author === spirit.name && !p.parentId).length} top-layer posts`);
    } else {
        console.warn(`No spirit found with name: ${spiritName}`);
        alert('No spirit found with that name.');
        activeView = 'timeline';
        activeSpirit = null;
        activeSpiritView = 'posts';
        loadTimeline();
    }
}



function showSpiritSidebar(author, postId) {
    const sidebar = document.getElementById('spirit-sidebar');
    if (!sidebar || author === 'Player') {
        hideSpiritSidebar();
        return;
    }
    let spirits = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]');
    const spirit = spirits.find(s => s.name === author);
    if (!spirit) {
        hideSpiritSidebar();
        return;
    }
    let bios = calculateBiorhythms?.(spirit.animal, spirit.star) || { MNF: 5, SPL: 0, BEU: 0, STR: 0, FND: 0, KNO: 0, UND: 0, WIS: 0, VIT: 0, SEX: 0, DIV: 0, EGO: 0 };
    if (!spirit.thoughts) {
        spirit.thoughts = generateThoughts(bios);
        spirits = spirits.map(s => s.name === spirit.name ? spirit : s);
        localStorage.setItem('rememberenceSpirits', JSON.stringify(spirits));
	spirit = cleanupLoyaltyData([spirit])[0];
    }
    const thoughts = spirit.thoughts;
    const loyaltyMap = spirit.loyaltyMap || {};

    // Helper: Format crossbreed/cross type
    const formatCross = (main, cross) => main && cross ? `${main} / ${cross}` : main || cross || 'None';

    sidebar.innerHTML = `
        <h3>${spirit.name}</h3>
        <p><strong>Animal:</strong> ${spirit.animal}</p>
        <p><strong>Star:</strong> ${spirit.star}</p>
        <p><strong>Species:</strong> ${formatCross(spirit.species, spirit.species2)}</p>
        <p><strong>Type:</strong> ${formatCross(spirit.type, spirit.type2)}</p>
        <h4>Biorhythms:</h4>
        <ul>
            ${Object.entries(bios).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
        </ul>
        <h4>Thoughts:</h4>
        <ul>
            ${Object.entries(thoughts).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
        </ul>
        <h4>Loyalties:</h4>
<ul>
    ${(() => {
        const loyaltyEntries = Object.entries(loyaltyMap || {});
        const rankEntries = Object.entries(spirit.loyaltyRank || {});
        const allNames = new Set([...loyaltyEntries.map(([n]) => n), ...rankEntries.map(([n]) => n)]);
        return Array.from(allNames).map(name => {
            const value = loyaltyMap[name] ?? 0;
            const rank = spirit.loyaltyRank?.[name] || 0;
            const rankText = rank > 0 ? `+${rank}` : rank < 0 ? `${rank}` : '0';
            return `<li>${name}: ${value} <strong>[R${rankText}]</strong></li>`;
        }).join('') || '<li>No loyalties recorded</li>';
    })()}
</ul>
    `;
    sidebar.style.display = 'block';
    sidebar.style.opacity = '0';
    setTimeout(() => {
        sidebar.style.opacity = '1';
        sidebar.style.transform = 'translateX(0)';
    }, 10);
}

function hideSpiritSidebar() {
    const sidebar = document.getElementById('spirit-sidebar');
    if (sidebar) {
        sidebar.style.opacity = '0';
        sidebar.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            sidebar.style.display = 'none';
            sidebar.innerHTML = '';
        }, 300);
    }
}

function getReplyCount(postId) {
    let posts = JSON.parse(localStorage.getItem('rememberencePosts') || '[]');
    return posts.filter(p => p.parentId === postId).length;
}

function showSelectedPost(postId) {
    console.log('showSelectedPost called with postId:', postId, 'activeView:', activeView, 'spiritPostInterval:', !!spiritPostInterval, 'spiritReplyIntervals:', spiritReplyIntervals.length);
    const timeline = document.getElementById('timeline');
    const selectedPostContainer = document.getElementById('selected-post');
    if (!timeline || !selectedPostContainer) {
        console.error('Timeline or selected-post container not found');
        return;
    }
    
    if (sidebarUpdateInterval) {
        clearInterval(sidebarUpdateInterval);
        sidebarUpdateInterval = null;
    }
    
    timeline.style.display = 'none';
    selectedPostContainer.style.display = 'block';
    selectedPostContainer.innerHTML = '';

    let posts = JSON.parse(localStorage.getItem('rememberencePosts') || '[]');
    const post = posts.find(p => p.id === postId);
    if (!post) {
        console.error(`Post not found for ID: ${postId}`);
        selectedPostContainer.innerHTML = '<p>Error: Post not found</p>';
        return;
    }
    console.log('Selected post:', post);

    const parentPosts = [];
    let currentPost = post;
    while (currentPost.parentId) {
        const parent = posts.find(p => p.id === currentPost.parentId);
        if (parent) {
            parentPosts.unshift(parent);
            currentPost = parent;
        } else break;
    }

    const wrapper = document.createElement('div');
    wrapper.style.padding = '20px';
    wrapper.style.maxWidth = '600px';
    wrapper.style.margin = '0 auto';

    parentPosts.forEach(parent => {
        const parentElement = createPostElement(parent, false);
        console.log('Parent post element created:', parentElement.outerHTML);
        wrapper.appendChild(parentElement);
    });

    const postElement = createPostElement(post, true);
    postElement.classList.add('highlight');
    console.log('Main post element created:', postElement.outerHTML);
    wrapper.appendChild(postElement);
    
    selectedPostContainer.appendChild(wrapper);
    console.log('Wrapper content:', wrapper.outerHTML);
    
    setTimeout(() => {
        const targetElement = document.getElementById(`post-${postId}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log('Scrolled to post:', postId);
        } else {
            console.warn(`Post element post-${postId} not found for scrolling`);
        }
    }, 0);
    
    activePostId = postId;
    showSpiritSidebar(post.author, postId);

    if (post.author !== 'Player') {
        sidebarUpdateInterval = setInterval(() => {
            showSpiritSidebar(post.author, postId);
        }, 1000);
    }
}

function loadTimeline() {
    if (activeView !== 'timeline') return;
    const timeline = document.getElementById('timeline');
    const selectedPostContainer = document.getElementById('selected-post');
    if (!timeline) {
        console.error('Timeline element not found');
        return;
    }
    
    if (sidebarUpdateInterval) {
        clearInterval(sidebarUpdateInterval);
        sidebarUpdateInterval = null;
    }
    
    timeline.style.display = 'grid';
    timeline.style.gridTemplateColumns = 'repeat(3, 1fr)';
    timeline.style.gap = '10px';
    if (selectedPostContainer) selectedPostContainer.style.display = 'none';
    hideSpiritSidebar();
    
    activePostId = null;
    
    timeline.innerHTML = '';
    let posts = JSON.parse(localStorage.getItem('rememberencePosts') || '[]');
    console.log('Loading timeline with posts:', posts.length);
    if (posts.length === 0) {
        console.warn('No posts found in localStorage');
    }
    const threadedPosts = buildThreadedPosts(posts);
    threadedPosts
        .filter(post => !post.parentId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .forEach(post => {
            const postElement = createPostElement(post, false);
            console.log('Timeline post element created:', postElement.outerHTML);
            timeline.appendChild(postElement);
        });
}

function clearTimeline() {
    console.log('Clearing timeline');
    localStorage.setItem('rememberencePosts', JSON.stringify([]));
    localStorage.setItem('rememberencePostCounters', JSON.stringify({ lastId: 0 }));
    loadTimeline();
}

function createPostElement(post, includeReplies = true) {
    const postElement = document.createElement('div');
    postElement.id = `post-${post.id}`;
    postElement.className = `post-box ${post.parentId ? 'reply' : ''}`;
    const replyCount = getReplyCount(post.id);

    let name, dominantBio, recessiveBio, topic, topicType, topicDesc;
    let dominantDesc = 'No description available.';
    let recessiveDesc = 'No description available.';

    console.log('createPostElement: Processing post content:', post.content);
    if (post.author !== 'Player') {
        const match = post.content.match(/^([^:]+): "([^"]*)"\s*\(Dominant: (\w+)=([-]?\d+), Recessive: (\w+)=([-]?\d+), Type: (\w+)\)$/);
        console.log('createPostElement: Match result:', match);
        if (match) {
            name = match[1];
            topic = match[2] || 'Unknown';
            dominantBio = `${match[3]}=${match[4]}`;
            recessiveBio = `${match[5]}=${match[6]}`;
            topicType = match[7];
            
            if (includeReplies) {
                const dominantBioData = biorhythms?.find(b => b.id === match[3]);
                const recessiveBioData = biorhythms?.find(b => b.id === match[5]);
                dominantDesc = dominantBioData?.descriptions?.dominant || 'No description available.';
                recessiveDesc = recessiveBioData?.descriptions?.recessive || 'No description available.';

                if (topicType === 'verse' && narrativeMatrix) {
                    topicDesc = narrativeMatrix[topic]?.desc || 'No verse description available.';
                } else if (topicType === 'animal' && typeof animalSigns === 'object' && topic in animalSigns) {
                    const sign = animalSigns[topic];
                    topicDesc = sign ? `Biorhythms: ${Object.entries(sign).map(([k, v]) => `${k}=${v}`).join(', ')}` : 'No animal sign data available.';
                } else if (topicType === 'star' && typeof starSigns === 'object' && topic in starSigns) {
                    const sign = starSigns[topic];
                    topicDesc = sign ? `Biorhythms: ${Object.entries(sign).map(([k, v]) => `${k}=${v}`).join(', ')}` : 'No star sign data available.';
                } else if (topicType === 'species' && speciesData) {
                    const species = speciesData[topic];
                    topicDesc = species ? `Stats: HP=${species.HP}, ATK=${species.ATK}, DEF=${species.DEF}, SPD=${species.SPD}, MP=${species.MP}, Move=${species.Move}\nActive Traits: ${species.traits?.active?.join('; ') || 'None'}\nPassive Traits: ${species.traits?.passive?.join('; ') || 'None'}` : 'No species data available.';
                } else if (topicType === 'type' && typeData) {
                    const type = typeData[topic];
                    topicDesc = type ? `Attributes: HP=${type.HP}, ATK=${type.ATK}, DEF=${type.DEF}, SPD=${type.SPD}, MP=${type.MP}, Attack=${type.Attack}\nActive Traits: ${type.traits?.active?.join('; ') || 'None'}\nPassive Traits: ${type.traits?.passive?.join('; ') || 'None'}` : 'No type data available.';
                } else if (topicType === 'skill' && classData) {
                    let skillDesc = 'No skill data available.';
                    const spirit = JSON.parse(localStorage.getItem('rememberenceSpirits') || '[]').find(s => s.name === post.author);
                    if (spirit) {
                        const classSkillMap = [
                            { className: 'Melee', skill: spirit.meleeSkill },
                            { className: 'Ranged', skill: spirit.rangedSkill },
                            { className: 'Magic', skill: spirit.magicSkill },
                            { className: 'Step', skill: spirit.stepSkill },
                            { className: 'Special', skill: spirit.specialSkill },
                            { className: 'Trance', skill: spirit.tranceSkill }
                        ];
                        const matchingClass = classSkillMap.find(m => m.skill === topic);
                        if (matchingClass && classData[matchingClass.className]?.skills[topic]) {
                            const skill = classData[matchingClass.className].skills[topic];
                            skillDesc = `Class: ${matchingClass.className}\nAttributes: ATK Bonus=${skill.atk_bonus}, DEF Bonus=${skill.def_bonus}, SPD Bonus=${skill.spd_bonus}, Pattern=${skill.pattern}\nTraits: ${skill.traits}`;
                        }
                    }
                    topicDesc = skillDesc;
                } else {
                    topicDesc = `No data available for topic type: ${topicType}`;
                }
                console.log(`Topic description for ${topicType} (${topic}): ${topicDesc}`);
            } else {
                topicDesc = topic;
            }
        } else {
            console.warn(`Failed to parse post content: ${post.content}`);
            name = post.author;
            topic = 'Prologue';
            topicType = 'verse';
            topicDesc = includeReplies ? (narrativeMatrix?.['Prologue']?.desc || 'The beginning of all journeys, where the cosmos whispers its secrets.') : 'Prologue';
            dominantBio = 'None=0';
            recessiveBio = 'None=0';
        }
    } else {
        name = post.author;
        topic = post.content.replace(/^Player: "(.*)"$/, '$1') || 'Unknown';
        topicType = 'custom';
        topicDesc = includeReplies ? (narrativeMatrix?.[topic]?.desc || 'A mortal’s voice echoes in the cosmic tapestry.') : topic;
        dominantBio = 'None=0';
        recessiveBio = 'None=0';
    }

    const bioDetails = includeReplies ? `
        <p>${dominantBio}</p>
        <p style="font-style: italic;">${dominantDesc}</p>
        <p>${recessiveBio}</p>
        <p style="font-style: italic;">${recessiveDesc}</p>
        <p><strong>${topicType === 'verse' ? 'Narrative Verse' : topicType === 'animal' ? 'Animal Sign' : topicType === 'star' ? 'Star Sign' : topicType.charAt(0).toUpperCase() + topicType.slice(1)}:</strong> ${topic}</p>
        <p style="font-style: italic;">${topicDesc}</p>
    ` : `
        <p><strong>Dominant Bio:</strong> ${dominantBio}</p>
        <p><strong>Recessive Bio:</strong> ${recessiveBio}</p>
        <p><strong>Topic:</strong> ${topic}</p>
    `;

    postElement.innerHTML = `
        <div class="post-frame" style="border: none; padding: 0; background: transparent; border-radius: 8px; transition: transform 0.2s ease, box-shadow 0.2s ease;">
            <div class="data-card">
                <p><strong>Name:</strong> ${name}</p>
                ${bioDetails}
            </div>
            <div class="post-actions">
                <button class="reply-button" data-post-id="${post.id}">${replyCount} repl${replyCount === 1 ? 'y' : 'ies'}</button>
            </div>
        </div>
        <div class="replies-container"></div>
    `;
    
    if (includeReplies) {
        const repliesContainer = postElement.querySelector('.replies-container');
        let allPosts = JSON.parse(localStorage.getItem('rememberencePosts') || '[]');
        const replies = allPosts.filter(p => p.parentId === post.id).sort((a, b) => b.timestamp - a.timestamp);
        replies.forEach(reply => {
            const replyElement = createPostElement(reply, false);
            console.log('Reply element created:', replyElement.outerHTML);
            repliesContainer.appendChild(replyElement);
        });
    }
    
    console.log('createPostElement output:', postElement.outerHTML);
    return postElement;
}

function buildThreadedPosts(posts) {
    return posts.filter(post => !post.parentId);
}

async function savePost(content, parentId, author) {
    try {
        const state = await apiLoad();

        let nextId = (state.postCounters?.lastId || 0) + 1;

        const newPost = {
            id: nextId.toString(),
            content,
            parentId: parentId || null,
            author,
            timestamp: Date.now(),
            replies: []
        };

        const updatedState = {
            ...state,
            posts: [...(state.posts || []), newPost],
            postCounters: { lastId: nextId }
        };

        const success = await apiSave(updatedState);

        if (success) {
            console.log('Post saved to server:', newPost, 'Total posts now:', updatedState.posts.length);
            return newPost.id;
        } else {
            console.error("Failed to save post to server");
            return null;
        }
    } catch (err) {
        console.error("Error while saving post:", err);
        return null;
    }
}


document.addEventListener('DOMContentLoaded', initHomeHub);