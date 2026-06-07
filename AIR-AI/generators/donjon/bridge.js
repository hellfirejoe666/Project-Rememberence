#!/usr/bin/env node
const fs = require('fs');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (err) {
    return '';
  }
}

const raw = readStdin();
let payload = {};
try {
  payload = raw.trim() ? JSON.parse(raw) : {};
} catch (err) {
  console.error('Invalid JSON payload:', err.message);
  process.exit(1);
}

const action = payload.action || 'text';
const type = payload.type || null;
const n = Number(payload.n || 1) || 1;
const nameSet = payload.nameSet || {};
const genData = payload.genData || {};

const CATEGORY_ALIASES = {
  search: 'Search D6',
  spirits: 'Search D6',
  world: 'Search D6',
  worlds: 'Search D6',
  portals: 'Search D6',
  runes: 'Search D6',
  structures: 'Structures D6',
  buildings: 'Structures D6',
  cities: 'Structures D6',
  towns: 'Structures D6',
  dungeons: 'Dungeons D6',
  caves: 'Dungeons D6',
  shrines: 'Dungeons D6',
  treasure: 'Treasure D6',
  gear: 'Gear D6',
  melee: 'Melee D6',
  ranged: 'Ranged D6',
  magic: 'Magic D6',
  step: 'Step D6',
  special: 'Special D6',
  trance: 'Trance D6',
  types: 'Types D6 * 4 (D24)',
  species: 'Species D6 * 6 (D36)',
};

function normalizeType(type) {
  if (!type) return null;
  const key = type.trim().toLowerCase();
  if (CATEGORY_ALIASES[key]) return CATEGORY_ALIASES[key];
  for (const alias in CATEGORY_ALIASES) {
    if (key.includes(alias)) {
      return CATEGORY_ALIASES[alias];
    }
  }
  return type;
}

const normalizedType = normalizeType(type);

function incrChain(chain, key, token) {
  chain[key] = chain[key] || {};
  chain[key][token] = (chain[key][token] || 0) + 1;
  return chain;
}

function constructChain(list) {
  const chain = {};
  for (let i = 0; i < list.length; i++) {
    const names = list[i].split(/\s+/);
    incrChain(chain, 'parts', names.length);
    for (let j = 0; j < names.length; j++) {
      const name = names[j];
      incrChain(chain, 'name_len', name.length);
      let c = name.substr(0, 1);
      incrChain(chain, 'initial', c);
      let rest = name.substr(1);
      let last = c;
      while (rest.length > 0) {
        c = rest.substr(0, 1);
        incrChain(chain, last, c);
        rest = rest.substr(1);
        last = c;
      }
    }
  }
  return scaleChain(chain);
}

function scaleChain(chain) {
  const tableLen = {};
  Object.keys(chain).forEach(key => {
    let len = 0;
    Object.keys(chain[key]).forEach(token => {
      const count = chain[key][token];
      const weighted = Math.max(1, Math.floor(Math.pow(count, 1.3)));
      chain[key][token] = weighted;
      len += weighted;
    });
    tableLen[key] = len;
  });
  chain['table_len'] = tableLen;
  return chain;
}

function selectLink(chain, key) {
  const len = chain['table_len'][key] || 0;
  if (!len) {
    return false;
  }
  let idx = Math.floor(Math.random() * len);
  const tokens = Object.keys(chain[key]);
  let acc = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    acc += chain[key][token];
    if (acc > idx) {
      return token;
    }
  }
  return false;
}

function markovName(chain) {
  const parts = selectLink(chain, 'parts') || 1;
  const names = [];
  for (let i = 0; i < parts; i++) {
    const nameLen = selectLink(chain, 'name_len') || 3;
    let c = selectLink(chain, 'initial') || 'A';
    let name = c;
    let last = c;
    while (name.length < nameLen) {
      c = selectLink(chain, last);
      if (!c) break;
      name += c;
      last = c;
    }
    names.push(name);
  }
  return names.join(' ');
}

function markovChain(type) {
  let list = [];
  const normalized = normalizeType(type);
  if (normalized && nameSet[normalized] && nameSet[normalized].length) {
    list = nameSet[normalized];
  } else {
    Object.keys(nameSet).forEach(key => {
      if (Array.isArray(nameSet[key])) {
        list = list.concat(nameSet[key]);
      }
    });
  }
  if (!list.length) {
    return false;
  }
  return constructChain(list);
}

function generateName(type) {
  const chain = markovChain(type);
  if (!chain) {
    return '';
  }
  return markovName(chain);
}

function keyMatch(name, type) {
  if (!type) return false;
  if (name.toLowerCase() === type.toLowerCase()) return true;
  return name.toLowerCase().includes(type.toLowerCase());
}

function selectFrom(list) {
  if (Array.isArray(list)) {
    return list[Math.floor(Math.random() * list.length)];
  }
  const keys = Object.keys(list);
  let len = 0;
  keys.forEach(key => {
    const range = keyRange(key);
    if (range[1] > len) {
      len = range[1];
    }
  });
  if (!len) {
    return '';
  }
  const idx = Math.floor(Math.random() * len) + 1;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const range = keyRange(key);
    if (idx >= range[0] && idx <= range[1]) {
      return list[key];
    }
  }
  return '';
}

function keyRange(key) {
  let match = /^(\d+)-00$/.exec(key);
  if (match) return [parseInt(match[1], 10), 100];
  match = /^(\d+)-(\d+)$/.exec(key);
  if (match) return [parseInt(match[1], 10), parseInt(match[2], 10)];
  if (key === '00') return [100, 100];
  const num = parseInt(key, 10);
  return [num, num];
}

function expandTokens(string) {
  let match;
  while ((match = /\{(\w+)\}/.exec(string))) {
    const token = match[1];
    const repl = generateText(token);
    string = string.replace('{' + token + '}', repl || token);
  }
  return string;
}

function generateText(type) {
  let list;
  const normalized = normalizeType(type);
  if (normalized && genData[normalized]) {
    list = genData[normalized];
  } else {
    // try fuzzy partial match
    const foundKey = Object.keys(genData).find(key => keyMatch(key, type) || keyMatch(key, normalized));
    if (foundKey) {
      list = genData[foundKey];
    } else {
      list = [];
      Object.values(genData).forEach(value => {
        if (Array.isArray(value)) {
          list = list.concat(value);
        }
      });
    }
  }
  if (!list || (Array.isArray(list) && !list.length)) {
    return '';
  }
  const text = selectFrom(list);
  return expandTokens(text);
}

function generateList(type, n) {
  const results = [];
  for (let i = 0; i < n; i++) {
    results.push(generateText(type));
  }
  return results;
}

let output = { action, type, n, values: [] };
if (action === 'name') {
  if (n === 1) {
    output.values = [generateName(type)];
  } else {
    output.values = [];
    for (let i = 0; i < n; i++) {
      output.values.push(generateName(type));
    }
  }
} else {
  output.values = generateList(type, n);
}

process.stdout.write(JSON.stringify(output));
