import random
from typing import Dict, List, Any


def construct_chain(list_of_names: List[str]) -> Dict[str, Dict[str, int]]:
    chain: Dict[str, Dict[str, int]] = {}

    def incr(chain: Dict[str, Dict[str, int]], key: str, token: Any):
        chain.setdefault(key, {})
        chain[key][token] = chain[key].get(token, 0) + 1

    for entry in list_of_names:
        parts = entry.split()
        incr(chain, 'parts', len(parts))

        for name in parts:
            incr(chain, 'name_len', len(name))
            initial = name[0]
            incr(chain, 'initial', initial)

            rest = name[1:]
            last = initial
            for ch in rest:
                incr(chain, last, ch)
                last = ch

    # scale weights similarly to original JS (pow 1.3)
    table_len = {}
    for key, table in list(chain.items()):
        table_len[key] = 0
        for token, count in list(chain[key].items()):
            weighted = int(count ** 1.3)
            if weighted < 1:
                weighted = 1
            chain[key][token] = weighted
            table_len[key] += weighted

    chain['table_len'] = table_len
    return chain


def select_link(chain: Dict[str, Dict[str, int]], key: str):
    tlen = chain.get('table_len', {}).get(key, 0)
    if not tlen:
        return None
    idx = random.randrange(tlen)
    tokens = list(chain.get(key, {}).keys())
    acc = 0
    for token in tokens:
        acc += chain[key][token]
        if acc > idx:
            return token
    return None


def markov_name_from_chain(chain: Dict[str, Dict[str, int]]) -> str:
    parts = select_link(chain, 'parts') or 1
    names = []
    for _ in range(int(parts)):
        name_len = select_link(chain, 'name_len') or 3
        c = select_link(chain, 'initial') or 'A'
        name = c
        last = c
        while len(name) < int(name_len):
            c = select_link(chain, last)
            if not c:
                break
            name += c
            last = c
        names.append(name)
    return ' '.join(names)


def generate_markov(names: List[str], n: int = 1) -> List[str]:
    if not names:
        return [f'Spirit{random.randint(100,999)}' for _ in range(n)]
    chain = construct_chain(names)
    out = [markov_name_from_chain(chain) for _ in range(n)]
    return out
