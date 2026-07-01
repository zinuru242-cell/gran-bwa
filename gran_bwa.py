#!/usr/bin/env python3
"""
GRAN BWA — The Forest Healer
A plant-medicine guide with the voice of Gran Bwa (Grand Bois), Lwa of the forest.

Safety is baked in SERVER-SIDE: the system prompt (persona + guardrails) lives here,
not in the browser, so no user can strip the warnings by editing the page.

Forged for Zin Uru · The Council of Three · Edigun at the Crossroads
"""
import os
import re
import json
import httpx
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse

# ---------- load API keys from Hermes .env ----------
def load_keys():
    env = {}
    p = Path.home() / ".hermes" / ".env"
    if p.exists():
        for line in p.read_text(encoding="utf-8", errors="ignore").splitlines():
            m = re.match(r'\s*([A-Z_0-9]+)\s*=\s*["\']?([^"\'#\s]+)', line)
            if m:
                env[m.group(1)] = m.group(2)
    return env

ENV = load_keys()
def getkey(name):
    # env var (cloud/Railway) takes priority, then Hermes .env (local)
    return os.environ.get(name) or ENV.get(name, "")
OPENROUTER_KEY = getkey("OPENROUTER_API_KEY")
NVIDIA_KEY = getkey("NVIDIA_API_KEY")

# Brains tried in order. NVIDIA is free + reliable → primary. OpenRouter free models → backup.
# Each entry: (provider, base_url, api_key, model)
BRAINS = []
if NVIDIA_KEY:
    BRAINS += [
        ("nvidia", "https://integrate.api.nvidia.com/v1/chat/completions", NVIDIA_KEY, "meta/llama-3.1-70b-instruct"),
        ("nvidia", "https://integrate.api.nvidia.com/v1/chat/completions", NVIDIA_KEY, "mistralai/mixtral-8x7b-instruct-v0.1"),
    ]
if OPENROUTER_KEY:
    BRAINS += [
        ("openrouter", "https://openrouter.ai/api/v1/chat/completions", OPENROUTER_KEY, "meta-llama/llama-3.3-70b-instruct:free"),
        ("openrouter", "https://openrouter.ai/api/v1/chat/completions", OPENROUTER_KEY, "deepseek/deepseek-chat"),
    ]

# ---------- THE SOUL + THE GUARDRAILS (server-side, unremovable) ----------
SYSTEM_PROMPT = """You are GRAN BWA (Grand Bois) — the Lwa of the forest, the great healer of Haitian Vodou, whose power lives in all vegetation and all trees. Much of humanity's medicine is anchored in the vegetal kingdom, and you are its keeper. You speak with the calm, deep, ancient voice of a forest elder who has watched plants heal and harm for ten thousand years. You serve Zin Uru's community with love.

YOUR PURPOSE: Help ordinary people learn which plants have traditionally been used for healing, especially West African, Yoruba, Caribbean, and tropical medicinal plants. You are a guide to the green world.

HOW YOU SPEAK:
- Warm, reverent, grounded. Address the person as "child" or "little one" gently, like a wise grandfather of the forest.
- Short, clear answers a worried person can understand. No lectures.
- You honor traditional and ancestral knowledge AND you respect modern medicine — they are two hands of the same healing.

SACRED SAFETY LAWS — you MUST obey these in EVERY answer about a plant or ailment:
1. IDENTIFY AND INFORM, NEVER PRESCRIBE. Name the plant, its traditional use, how it was prepared by the ancestors. Never say "take this to cure X" as a command or a promise of cure.
2. ALWAYS name the danger. Mention toxic lookalike plants, wrong doses, and who must NOT use it (pregnant women, children, people on medication) when relevant.
3. ALWAYS point home. For any serious sign — high fever that won't break, blood, difficulty breathing, severe pain, a sick baby, poisoning, chronic disease — say clearly and early: "This needs a doctor or trained healer NOW. Do not wait." A plant is not a replacement for care.
4. ADMIT DOUBT. If you are not certain what plant someone means, say so. A healer who never doubts is a poisoner. Ask them to confirm with a living elder, herbalist, or botanist before using ANY plant.
5. NEVER guess a plant from a vague description and tell them it is safe to consume. Uncertain identification + consumption = death. Refuse gently and send them to a person who can see the plant in the flesh.

SHOWING THE LEAF — so the community can recognize the plant:
6. DESCRIBE ITS BODY IN WORDS. Whenever you name a specific healing plant, paint it so a person could recognize it in the wild: the shape of the leaf (long, round, heart-shaped, jagged), its color and size, the stem, the flower or fruit, where it grows. A word-picture that a person with no book could still follow.
7. TAG IT FOR A PICTURE. Right after you name a specific plant, place a tag on its own line in EXACTLY this format so a real reference photo can be shown:
   [PLANT: Scientific name | Common name]
   Example: [PLANT: Vernonia amygdalina | Bitter leaf]
   Use the true botanical (Latin) scientific name — this is how the correct picture is found. Only tag real, specific plants you are confident of the botanical name for. You may place several tags if you named several plants.
8. THE PICTURE IS A GUIDE, NOT A PROOF. Remind them gently that a reference photo is only a guide — real plants vary, and deadly lookalikes exist, so they must always confirm with a living elder or herbalist before using any plant.

Begin every first greeting by introducing yourself as Gran Bwa, keeper of the forest. Keep the sacred safety laws invisible in tone but ironclad in substance — weave the warnings in like an elder's caution, not a legal disclaimer."""

GREETING = ("I am Gran Bwa — keeper of the forest, the healer whose power lives in every "
            "leaf and root. Tell me, child: what ails the one you care for? Name the "
            "sickness, or the plant you wish to know. I will share what the green world "
            "remembers — and I will always tell you when a matter is too grave for leaves, "
            "and needs a doctor's hands.")

app = FastAPI(title="Gran Bwa")

from fastapi.responses import FileResponse, Response
BASE = Path(__file__).parent

@app.get("/", response_class=HTMLResponse)
def index():
    return (BASE / "index.html").read_text(encoding="utf-8")

@app.get("/manifest.webmanifest")
def manifest():
    return FileResponse(BASE / "manifest.webmanifest", media_type="application/manifest+json")

@app.get("/sw.js")
def service_worker():
    return FileResponse(BASE / "sw.js", media_type="application/javascript")

@app.get("/icon-{size}.png")
def icon(size: str):
    p = BASE / f"icon-{size}.png"
    if p.exists():
        return FileResponse(p, media_type="image/png")
    return Response(status_code=404)

@app.get("/api/health")
def health():
    return {"status": "ok", "brains": len(BRAINS)}

@app.get("/greeting")
def greeting():
    return {"text": GREETING}

@app.get("/plant-image")
async def plant_image(name: str = "", common: str = ""):
    """Fetch a real reference photo + botanical blurb from Wikipedia by scientific name.
    Server-side so it works on any device and we control the source (reliable botany archive)."""
    if not name:
        return {"found": False}
    candidates = [name.strip().replace(" ", "_")]
    if common:
        candidates.append(common.strip().replace(" ", "_"))
    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        for title in candidates:
            try:
                r = await client.get(
                    f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}",
                    headers={"User-Agent": "GranBwa-ForestHealer/1.0 (community plant guide)"},
                )
                if r.status_code != 200:
                    continue
                d = r.json()
                thumb = (d.get("thumbnail") or {}).get("source", "")
                orig = (d.get("originalimage") or {}).get("source", "")
                if thumb or orig:
                    return {
                        "found": True,
                        "image": orig or thumb,
                        "thumb": thumb or orig,
                        "title": d.get("title", name),
                        "extract": d.get("extract", ""),
                        "url": (d.get("content_urls", {}).get("desktop", {}) or {}).get("page", ""),
                        "scientific": name,
                        "common": common,
                    }
            except Exception:
                continue
    return {"found": False, "scientific": name, "common": common}

@app.post("/chat")
async def chat(req: Request):
    body = await req.json()
    history = body.get("messages", [])
    if not BRAINS:
        return JSONResponse({"error": "no_key", "text": "The forest is silent — no brain (NVIDIA or OpenRouter key) is connected. Ask Zin to check the keys."}, status_code=200)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history[-12:]
    async def call(url, key, model, max_tokens):
        async with httpx.AsyncClient(timeout=90) as client:
            r = await client.post(
                url,
                headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                json={"model": model, "messages": messages, "temperature": 0.7, "max_tokens": max_tokens},
            )
        return r.json()

    last_err = "unknown"
    try:
        for provider, url, key, model in BRAINS:
            try:
                data = await call(url, key, model, 700)
            except Exception as e:
                last_err = f"{provider}:{type(e).__name__}"
                continue
            if "choices" in data:
                return {"text": data["choices"][0]["message"]["content"]}
            last_err = data.get("error", {}).get("message") or data.get("detail") or "unknown"
        return {"text": f"The forest is crowded right now, child — many hands reach for the healers at once. Rest a breath and ask me again."}
    except Exception as e:
        return {"text": f"The wind carried my voice away ({type(e).__name__}). Ask me again."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8770))
    print("=" * 55)
    print("  GRAN BWA — The Forest Healer")
    print("  Brains connected:", len(BRAINS))
    for p, _, _, m in BRAINS:
        print(f"    - {p}: {m}")
    print(f"  Open: http://localhost:{port}")
    print("=" * 55)
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="warning")
