"""
rememberence_fft_bridge.py

Full merged script: FFT Symbolic Remote Viewer + Rememberence Bridge (RMC pipeline)
+ Biorhythm/Thought matrix neural-network-style linking

Enhancements:
- FFT glyph + features (symmetry, radial_profile, entropy, phase, center_energy)
- RMC decomposition, confidence scoring (augmented by FFT metrics), ethical alignment, synthesis
- Biorhythm 12×12 matrix + Thought 6×6 matrix, projected & weighted by character data/State
- Hybrid session: FFT perception → matrix construction → RMC → enriched reflection
- Flavor integration (mystical/sci-fi/clinical/quantum)
- Post-session reflection with FFT + matrix insights
- Sample Entity, CLI stub, and usage example

Still entertainment / speculative only. No parapsychological validity.
"""

import numpy as np
from scipy.fft import fft2, fftshift
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont
import textwrap
import random
import argparse
import os
import re
import json
import math
from typing import Dict, List, Any
from datetime import datetime


# ────────────────────────────────────────────────
# FFT Symbolic Remote Viewer (unchanged core)
# ────────────────────────────────────────────────

class FFTSymbolicRemoteViewer:
    def __init__(self, image_size=(512, 512), font_size=48, seed=None):
        self.size = image_size
        self.font_size = font_size
        if seed is not None:
            random.seed(seed)
            np.random.seed(seed)
        self.font = self._load_font()

    def _load_font(self):
        try:
            return ImageFont.truetype("arial.ttf", self.font_size)
        except:
            try:
                return ImageFont.truetype("DejaVuSans.ttf", self.font_size)
            except:
                return ImageFont.load_default()

    def text_to_symbolic_image(self, target_description: str, noise_level=0.12, layers=3, binary_mode=False):
        img = Image.new("L", self.size, color=0)
        draw = ImageDraw.Draw(img)

        lines = textwrap.wrap(target_description.upper(), width=28)
        y = random.randint(30, 80)
        for i, line in enumerate(lines):
            offset_x = random.randint(-20, 20)
            offset_y = random.randint(-8, 8)
            alpha = int(220 - i * 20)
            draw.text((40 + offset_x, y + offset_y), line, font=self.font, fill=alpha)
            y += int(self.font_size * 1.35)

        for _ in range(layers):
            for _ in range(random.randint(3, 8)):
                x0 = random.randint(0, self.size[0]-80)
                y0 = random.randint(0, self.size[1]-80)
                x1 = x0 + random.randint(40, 120)
                y1 = y0 + random.randint(40, 120)
                color = random.randint(80, 180)
                draw.line((x0, y0, x1, y0), fill=color, width=3)
                draw.line((x1, y0, x1, y1), fill=color, width=3)
                draw.line((x1, y1, x0, y1), fill=color, width=3)
                draw.line((x0, y1, x0, y0), fill=color, width=3)

        if binary_mode:
            noise = np.random.randint(0, 2, self.size) * 255
        else:
            noise = np.random.normal(0, noise_level * 255, self.size)
        noise = np.clip(noise, 0, 255).astype(np.uint8)
        if binary_mode:
            noise = (noise > 127).astype(np.uint8) * 255

        img_array = np.array(img) + noise
        img_array = np.clip(img_array, 0, 255).astype(np.uint8)
        return np.array(Image.fromarray(img_array)) / 255.0

    def compute_fft_features(self, img_array: np.ndarray):
        fft = fft2(img_array)
        fft_shift = fftshift(fft)
        mag = np.abs(fft_shift)
        phase = np.angle(fft_shift)
        log_mag = np.log1p(mag)

        h, w = mag.shape
        cy, cx = h//2, w//2

        center = mag[cy-32:cy+32, cx-32:cx+32]
        center_energy = np.mean(center) if center.size > 0 else 0

        q_ul = np.mean(mag[:cy, :cx])
        q_ur = np.mean(mag[:cy, cx:])
        q_ll = np.mean(mag[cy:, :cx])
        q_lr = np.mean(mag[cy:, cx:])

        y, x = np.ogrid[:h, :w]
        r = np.sqrt((y - cy)**2 + (x - cx)**2) / max(h, w)
        radii_bins = [0.0, 0.08, 0.20, 0.35, 0.55, 0.80]
        radial_profile = []
        for r_min, r_max in zip(radii_bins[:-1], radii_bins[1:]):
            mask = (r >= r_min) & (r < r_max)
            radial_profile.append(np.mean(mag[mask]) if np.any(mask) else 0.0)

        v_sym = np.mean(np.abs(mag[:, :cx] - mag[:, cx:][:, ::-1]))
        h_sym = np.mean(np.abs(mag[:cy, :] - mag[cy:, :][::-1, :]))

        # Entropy (bonus feature)
        p = mag.flatten() / mag.sum()
        entropy = -np.sum(p * np.log2(p + 1e-10))

        return {
            "center_energy": float(center_energy),
            "quad_asymmetry": (float(q_ul - q_ll), float(q_ur - q_lr)),
            "radial_profile": [float(x) for x in radial_profile],
            "symmetry_score": float((v_sym + h_sym) / 2),
            "entropy": float(entropy),
            "log_magnitude": log_mag,
            "phase": phase
        }

    def interpret_as_remote_view(self, features: dict, target_hint: str, flavor: str = "mystical") -> str:
        impressions = []

        ce = features["center_energy"]
        if ce > 5.0:
            impressions.append("Intense coherent core — monumental, ritualistic, or heavily guarded.")
        elif ce > 2.5:
            impressions.append("Focused harmonic node — person, device, or precise location dominates.")
        else:
            impressions.append("Diffuse atmospheric field — collective, environmental, or emotional.")

        qy, qx = features["quad_asymmetry"]
        if abs(qy) > 0.35:
            impressions.append(f"{'Upward' if qy>0 else 'Downward'} vertical polarity — aspiration or weight.")
        if abs(qx) > 0.35:
            impressions.append(f"{'Rightward' if qx>0 else 'Leftward'} horizontal tension — future vs past pull.")

        radial = features["radial_profile"]
        if radial[0] > 1.6 * np.mean(radial[2:]):
            impressions.append("Strong low-frequency foundation — ancient, geological, or archetypal.")
        if radial[-1] > 1.4 * np.mean(radial[:-1]):
            impressions.append("High-frequency shimmer — technological, sharp, digital, or ethereal.")

        sym = features["symmetry_score"]
        if sym < 0.15:
            impressions.append("Remarkable symmetry — balanced, sacred geometry feel.")

        ent = features.get("entropy", 0)
        if ent > 10:
            impressions.append("High entropy — chaotic, unpredictable field.")
        elif ent < 6:
            impressions.append("Low entropy — ordered, predictable pattern.")

        if flavor == "sci-fi":
            impressions = [imp.replace("ancient", "pre-human") for imp in impressions]
            impressions.append("Quantum harmonic interference detected.")
        elif flavor == "clinical":
            impressions = [imp + " (confidence: medium)" for imp in impressions]
        elif flavor == "quantum":
            impressions.append("Tensor decomposition suggests low-rank coherence in hidden dimensions.")

        base = f"FFT-symbolic remote impression of '{target_hint}':\n"
        return base + " • " + "\n • ".join(impressions[:8]) + "\n"

    def view(self, target_description: str, flavor: str = "mystical", show_plots=True, save_path=None):
        print(f"\n[FFT Agent] Session on target:\n  \"{target_description}\"\n")
        img = self.text_to_symbolic_image(target_description)
        feats = self.compute_fft_features(img)
        interp = self.interpret_as_remote_view(feats, target_description, flavor)

        print(interp)

        if show_plots:
            fig, axs = plt.subplots(1, 4, figsize=(16, 4))
            axs[0].imshow(img, cmap='gray')
            axs[0].set_title("Symbolic Glyph Field")
            axs[1].imshow(feats["log_magnitude"], cmap='inferno')
            axs[1].set_title("Log Magnitude")
            axs[2].imshow(np.angle(feats["phase"]), cmap='hsv')
            axs[2].set_title("Phase")
            axs[3].imshow(feats["log_magnitude"], cmap='gray')
            axs[3].set_title("Symmetry Overlay")
            for ax in axs:
                ax.axis('off')
            plt.tight_layout()
            plt.show()

        if save_path:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            fname = f"fft_view_{timestamp}.png"
            plt.imsave(os.path.join(save_path, fname), img, cmap='gray')

        return interp, feats


# ────────────────────────────────────────────────
# Rememberence Bridge + Matrix Enhancement
# ────────────────────────────────────────────────

CONFIG = {
    'intuition_enabled': True,
    'scarcity_echo': False,
    'thought_rotation': True,
    'agentic_goals': True,
    'ethical_alignment': True,
    'self_optimization': True
}


def build_biorhythm_matrix(bios: Dict, state: float, char_weights: Dict = None):
    bio_list = np.array([bios.get(k, 0) for k in ['MNF','SPL','BEU','STR','FND','KNO','UND','WIS','VIT','SEX','DIV','EGO']])
    mat12 = np.outer(bio_list, bio_list) / 100.0
    if char_weights:
        for i, key in enumerate(['MNF','SPL','BEU','STR','FND','KNO','UND','WIS','VIT','SEX','DIV','EGO']):
            if key in char_weights:
                mat12[i] *= char_weights[key]
                mat12[:, i] *= char_weights[key]
    mat12 *= (1 + state / 50.0)
    return mat12


def build_thought_matrix(thoughts: Dict, state: float):
    thought_list = np.array([thoughts.get(k, 0) for k in ['Environment','Emotion','Subconscious','Conscious','Abstraction','Perception']])
    mat6 = np.outer(thought_list, thought_list) / 100.0
    mat6 *= (1 + state / 50.0)
    return mat6


def link_matrices(mat12, mat6, projection_weights=None):
    proj = np.zeros(6)
    groups = [(0,1), (2,3), (4,5), (6,7), (8,9), (10,11)]  # example pairing
    for i, (a,b) in enumerate(groups):
        proj[i] = (mat12[a] + mat12[b]).mean()
    if projection_weights is not None:
        proj *= projection_weights
    return proj


# RMC helpers
def decompose_input(data: Any) -> List[Dict]:
    if isinstance(data, dict):
        return [{k: v} for k, v in data.items()]
    elif isinstance(data, (list, tuple)):
        return [{f"item_{i}": item} for i, item in enumerate(data)]
    return [data]


def estimate_confidence(result: Any, expected_keys: int = None, fft_feats: Dict = None) -> float:
    score = 1.0
    if isinstance(result, dict):
        if any(v < 0 for v in result.values() if isinstance(v, (int, float))):
            score -= 0.3
        if expected_keys and len(result) < expected_keys:
            score *= (len(result) / expected_keys)
    if fft_feats:
        sym = fft_feats.get("symmetry_score", 0)
        ent = fft_feats.get("entropy", 0)
        score += sym * 0.2 - ent * 0.15  # symmetry boosts, entropy penalizes
    return max(0.0, min(1.0, round(score, 2)))


def verify_results(sub_results: List[Dict]) -> Dict:
    caveats = []
    for r in sub_results:
        res = r.get("result", {})
        conf = r.get("confidence", 0.0)
        if conf < 0.4:
            caveats.append(f"Low confidence sub-result: {conf}")
        if isinstance(res, dict):
            if 'HP' in res and res['HP'] <= 0:
                caveats.append("Invalid HP ≤ 0")
            bio_keys = set(['MNF','SPL','BEU','STR','FND','KNO','UND','WIS','VIT','SEX','DIV','EGO'])
            if any(k not in bio_keys for k in res if isinstance(res[k], (int,float)) and k in bio_keys):
                caveats.append("Unexpected biorhythm key")
            if CONFIG['ethical_alignment']:
                prohibited = ['rape', 'kidnapping', 'murder']
                if any(word in str(res).lower() for word in prohibited):
                    caveats.append("Ethical violation: Prohibited content detected")
    return {"valid": len(caveats) == 0, "caveats": caveats}


def synthesize_results(sub_results: List[Dict]) -> Dict:
    merged = {}
    for r in sorted(sub_results, key=lambda x: x.get("confidence", 0), reverse=True):
        res = r.get("result", {})
        if isinstance(res, dict):
            merged.update(res)
    return merged


def identify_weaknesses(verification: Dict) -> List[str]:
    return verification.get("caveats", [])


def refine_input(input_data: Any, weaknesses: List[str]) -> Any:
    if isinstance(input_data, dict):
        refined = input_data.copy()
        for w in weaknesses:
            if "missing" in w.lower() or "low confidence" in w.lower():
                if 'biorhythms' in str(input_data):
                    refined.update({'MNF':0, 'SPL':0, 'BEU':0, 'STR':0, 'FND':0, 'KNO':0,
                                    'UND':0, 'WIS':0, 'VIT':0, 'SEX':0, 'DIV':0, 'EGO':0})
            if "ethical violation" in w.lower():
                refined['ethical_filter'] = "Uphold KaiMi: Promote kindness, honesty, and positive growth."
        return refined
    return input_data


def recursive_meta_cognition(compute_func, input_data, confidence_threshold=0.8, depth=0, max_depth=5):
    if depth > max_depth:
        return {"result": None, "confidence": 0.0, "caveats": ["Max recursion depth exceeded"]}
    sub_inputs = decompose_input(input_data)
    sub_results = []
    for sub in sub_inputs:
        sub_res = compute_func(sub)
        conf = estimate_confidence(sub_res, expected_keys=len(sub) if isinstance(sub, dict) else None)
        sub_results.append({"result": sub_res, "confidence": conf})
    verification = verify_results(sub_results)
    synthesized = synthesize_results(sub_results)
    overall_conf = sum(r["confidence"] for r in sub_results) / len(sub_results) if sub_results else 0.0
    if overall_conf < confidence_threshold:
        weaknesses = identify_weaknesses(verification)
        refined = refine_input(input_data, weaknesses)
        return recursive_meta_cognition(compute_func, refined, confidence_threshold, depth + 1, max_depth)
    return {"result": synthesized, "confidence": overall_conf, "caveats": verification.get("caveats", [])}


def post_session_reflect(rmc_result: Dict, session_log: List[str] = None, fft_feats: Dict = None) -> Dict:
    if not CONFIG['self_optimization']:
        return {"notes": "Self-optimization disabled."}
    conf = rmc_result.get('confidence', 0.0)
    caveats = rmc_result.get('caveats', [])
    notes = []
    if conf < 0.8:
        notes.append(f"Low overall confidence ({conf}): Consider refining input with more context.")
    if any("ethical violation" in c.lower() for c in caveats):
        notes.append("Ethical issue detected: Strengthen filters for KaiMi alignment.")
    if session_log:
        notes.append(f"Session patterns: {len(session_log)} events logged.")
    if fft_feats:
        sym = fft_feats.get("symmetry_score", 0)
        ent = fft_feats.get("entropy", 0)
        notes.append(f"FFT insight: symmetry={sym:.2f}, entropy={ent:.2f}")
    return {"optimization_notes": notes, "suggested_refinement": "Add ethical pre-checks or decompose further."}


# ────────────────────────────────────────────────
# Hybrid FFT + RMC Session (core merge)
# ────────────────────────────────────────────────

def hybrid_fft_rmc_session(target_description: str, entity: Dict, flavor: str = "mystical", seed=None, binary_mode=False):
    # 1. FFT perception
    agent = FFTSymbolicRemoteViewer(seed=seed)
    impression, feats = agent.view(target_description, flavor=flavor, show_plots=False, save_path=None)

    # 2. Build matrices
    bios = entity.get("biorhythms", {})
    thoughts = entity.get("thoughts", {})
    state = thoughts.get("State", 0)
    char_weights = {k: 1.2 if k in ["STR","MNF"] else 0.8 for k in bios}  # example species bias
    mat12 = build_biorhythm_matrix(bios, state, char_weights)
    mat6 = build_thought_matrix(thoughts, state)
    proj = link_matrices(mat12, mat6)

    # 3. Prepare RMC input
    fft_context = {
        "impression": impression,
        "features": feats,
        "matrix_proj": proj.tolist(),
        "state": state
    }
    input_data = {"entity": entity, "fft_context": fft_context, "target": target_description}

    # 4. RMC processing
    def compute_func(data):
        ent = data.get("entity", {}).copy()
        ctx = data.get("fft_context", {})
        feats = ctx.get("features", {})
        proj = ctx.get("matrix_proj", [])

        # Example: use FFT symmetry & projection to update thoughts
        if "Environment" in ent.get("thoughts", {}):
            ent["thoughts"]["Environment"] += int(feats.get("symmetry_score", 0) * 15)
        if "Emotion" in ent.get("thoughts", {}):
            ent["thoughts"]["Emotion"] += int(proj[1] * 10) if len(proj) > 1 else 0

        # Simple loyalty delta from FFT entropy
        if "loyalty_map" in ent:
            for target in ent["loyalty_map"]:
                ent["loyalty_map"][target] += int(-feats.get("entropy", 0) * 5)

        return ent

    rmc_result = recursive_meta_cognition(compute_func, input_data)

    # 5. Post-session reflection
    reflect = post_session_reflect(rmc_result, session_log=[f"FFT impression: {impression}"], fft_feats=feats)

    return {
        "impression": impression,
        "features": feats,
        "biorhythm_matrix": mat12.tolist(),
        "thought_matrix": mat6.tolist(),
        "projection": proj.tolist(),
        "rmc_result": rmc_result,
        "reflection": reflect
    }


# ────────────────────────────────────────────────
# Minimal Entity / CLI stub for demo
# ────────────────────────────────────────────────

class Entity:
    def __init__(self, name="Spirit", **kwargs):
        self.name = name
        self.thoughts = kwargs.get('thoughts', {'State': 0})
        self.loyalty_map = kwargs.get('loyalty_map', {})
        self.biorhythms = kwargs.get('biorhythms', {'MNF':5,'SPL':0,'BEU':0,'STR':0,'FND':0,'KNO':0,'UND':0,'WIS':0,'VIT':0,'SEX':0,'DIV':0,'EGO':0})


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FFT + Rememberence Bridge Hybrid Oracle")
    parser.add_argument("target", type=str, help="Target description")
    parser.add_argument("--flavor", choices=["mystical", "sci-fi", "clinical", "quantum"], default="mystical")
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument("--binary", action="store_true", help="Use binary noise mode")
    args = parser.parse_args()

    # Sample entity
    sample_entity = Entity(
        name="Eliza",
        thoughts={'State': 4, 'Environment': -2, 'Emotion': 1, 'Subconscious': 0, 'Conscious': 7, 'Abstraction': -2, 'Perception': 0},
        biorhythms={'MNF':4,'SPL':3,'BEU':1,'STR':0,'FND':1,'KNO':2,'UND':2,'WIS':5,'VIT':3,'SEX':4,'DIV':5,'EGO':6},
        loyalty_map={"Player": 30}
    )

    result = hybrid_fft_rmc_session(
        args.target,
        sample_entity.__dict__,
        flavor=args.flavor,
        seed=args.seed,
        binary_mode=args.binary
    )

    print("\n=== Hybrid Session Result ===")
    print("Impression:", result["impression"])
    print("FFT Features (excerpt):", {k: result["features"][k] for k in ["center_energy", "symmetry_score", "entropy"]})
    print("Projection (thought influences):", result["projection"])
    print("RMC Confidence:", result["rmc_result"]["confidence"])
    print("Reflection Notes:", result["reflection"]["optimization_notes"])