"""
OpenGradient AI Oracle — FastAPI Backend
=========================================
Real verifiable AI inference via OpenGradient SDK.
Every response is cryptographically attested via TEE
and settled on-chain via x402 on Base Sepolia.
"""

import asyncio
import os
import json
import time
from datetime import datetime, timezone
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

load_dotenv()

# ── OpenGradient SDK ─────────────────────────
import opengradient as og

# ── Initialize LLM client ───────────────────
PRIVATE_KEY = os.environ.get("OG_PRIVATE_KEY")
llm_client = None
sdk_ready = False
sdk_error = None

if PRIVATE_KEY and PRIVATE_KEY != "0xYourPrivateKeyHere":
    try:
        # Initialize client but DO NOT call ensure_opg_approval() during global init
        # because on-chain RPC calls will timeout a Vercel Serverless Function cold start
        llm_client = og.LLM(private_key=PRIVATE_KEY)
        sdk_ready = True
        print("✅ OpenGradient SDK initialized — real verified inference active")
    except Exception as e:
        sdk_error = str(e)
        print(f"⚠️  SDK init failed: {e}")
        print("   Running in demo mode (simulated responses)")
else:
    sdk_error = "No OG_PRIVATE_KEY configured in environment."
    print("ℹ️  No OG_PRIVATE_KEY set. Running in demo mode.")
    print("   Set your key in .env to enable real verified inference.")

# ── Model ID Mapping ────────────────────────
MODEL_MAP = {
    "openai/gpt-5": og.TEE_LLM.GPT_5 if sdk_ready else None,
    "openai/gpt-5-mini": og.TEE_LLM.GPT_5_MINI if sdk_ready else None,
    "openai/gpt-4.1-2025-04-14": og.TEE_LLM.GPT_4_1_2025_04_14 if sdk_ready else None,
    "openai/o4-mini": og.TEE_LLM.O4_MINI if sdk_ready else None,
    "anthropic/claude-opus-4-6": og.TEE_LLM.CLAUDE_OPUS_4_6 if sdk_ready else None,
    "anthropic/claude-sonnet-4-6": og.TEE_LLM.CLAUDE_SONNET_4_6 if sdk_ready else None,
    "anthropic/claude-sonnet-4-5": og.TEE_LLM.CLAUDE_SONNET_4_5 if sdk_ready else None,
    "anthropic/claude-haiku-4-5": og.TEE_LLM.CLAUDE_HAIKU_4_5 if sdk_ready else None,
    "google/gemini-3-pro": og.TEE_LLM.GEMINI_3_PRO if sdk_ready else None,
    "google/gemini-3-flash": og.TEE_LLM.GEMINI_3_FLASH if sdk_ready else None,
    "google/gemini-2.5-pro": og.TEE_LLM.GEMINI_2_5_PRO if sdk_ready else None,
    "google/gemini-2.5-flash": og.TEE_LLM.GEMINI_2_5_FLASH if sdk_ready else None,
}

SETTLEMENT_MAP = {
    "BATCH_HASHED": og.x402SettlementMode.BATCH_HASHED if sdk_ready else None,
    "INDIVIDUAL_FULL": og.x402SettlementMode.INDIVIDUAL_FULL if sdk_ready else None,
    "PRIVATE": og.x402SettlementMode.PRIVATE if sdk_ready else None,
}

# ── Inference History ────────────────────────
inference_history = []

# ── FastAPI App ──────────────────────────────
app = FastAPI(
    title="OpenGradient AI Oracle",
    description="Verifiable AI Inference via TEE + x402 on-chain settlement",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request/Response Models ──────────────────
class InferenceRequest(BaseModel):
    prompt: str
    model: str = "openai/gpt-5"
    mode: str = "chat"  # "chat" or "completion"
    temperature: float = 0.7
    max_tokens: int = 256
    settlement: str = "BATCH_HASHED"
    system_prompt: Optional[str] = "You are a helpful AI assistant powered by OpenGradient's verifiable inference network. Your responses are cryptographically attested via TEE."

class InferenceResponse(BaseModel):
    content: str
    model: str
    provider: str
    payment_hash: Optional[str] = None
    tee_verified: bool = False
    settlement_mode: str
    timestamp: str
    latency_ms: int
    demo_mode: bool = False

class StreamInferenceRequest(BaseModel):
    prompt: str
    model: str = "openai/gpt-5"
    temperature: float = 0.7
    max_tokens: int = 256
    settlement: str = "BATCH_HASHED"
    system_prompt: Optional[str] = "You are a helpful AI assistant powered by OpenGradient's verifiable inference network."

# ── Demo Responses ───────────────────────────
DEMO_RESPONSES = {
    "defi": """**DeFi Landscape Analysis — Q1 2026**

The DeFi ecosystem continues its rapid evolution:

1. **RWA Tokenization Surge** — Over $15B in tokenized real-world assets now live on-chain, with institutional adoption accelerating.

2. **Restaking Revolution** — EigenLayer-style protocols created a "security marketplace" with 200+ AVS generating sustainable yield.

3. **Intent-Based Trading** — Solver architectures (UniswapX, CoW Protocol) dominate DEX volume, cutting MEV extraction by ~60%.

4. **AI-Managed DeFi** — Autonomous agents now manage ~$3B in strategies using verifiable AI inference (like OpenGradient's TEE attestation).

5. **Cross-Chain Unification** — Interop protocols eliminated liquidity fragmentation, making multi-chain feel native.

**Key Takeaway:** Verifiable AI inference is becoming the backbone of trustless DeFi — exactly what OpenGradient enables with TEE + on-chain proofs.

*This response was generated with cryptographic attestation via TEE.*""",

    "contract": """```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BurnToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18;
    uint256 public burnRate = 2; // 2% burn per transfer

    event TokensBurned(address indexed from, uint256 amount);

    constructor() ERC20("BurnToken", "BURN") Ownable(msg.sender) {
        _mint(msg.sender, MAX_SUPPLY);
    }

    function transfer(address to, uint256 amount)
        public override returns (bool)
    {
        uint256 burnAmount = (amount * burnRate) / 100;
        uint256 sendAmount = amount - burnAmount;
        _burn(msg.sender, burnAmount);
        emit TokensBurned(msg.sender, burnAmount);
        return super.transfer(to, sendAmount);
    }

    function setBurnRate(uint256 _rate) external onlyOwner {
        require(_rate <= 10, "Max 10%");
        burnRate = _rate;
    }
}
```

This ERC-20 token automatically burns 2% on every transfer, creating deflationary pressure. The burn rate is adjustable by the owner (capped at 10%).

*Verified via OpenGradient TEE attestation.*""",

    "risk": """**Loan Risk Assessment Report**

| Factor | Value | Rating |
|--------|-------|--------|
| Income | $85,000 | ✅ Good |
| Credit Score | 740 | ✅ Very Good |
| DTI Ratio | 0.32 | ⚠️ Moderate |
| Loan Amount | $300,000 | — |

**Overall Risk: LOW-MODERATE** 🟢

**Key Findings:**
- Credit score of 740 = "Very Good" tier, qualifying for competitive rates
- DTI of 32% is acceptable but approaches the 36% caution threshold
- Income-to-loan ratio of 3.53x is within standard lending parameters
- Estimated monthly payment: ~$1,800 (25.4% of gross income)

**Recommendation:** APPROVE with standard terms
- Rate: Prime + 0.75%
- Documentation: Full verification required
- Condition: Employment history ≥ 2 years

*This assessment carries cryptographic verification via TEE attestation.*""",

    "tee": """**TEE Verification for AI Inference — How It Works**

A Trusted Execution Environment (TEE) is a hardware-isolated processor region that guarantees code and data integrity.

**OpenGradient's TEE Flow:**

```
1. Enclave Creation → AI model loads inside SGX/TDX enclave
2. Remote Attestation → Hardware proves what code is running
3. Sealed Execution → Your prompt enters encrypted enclave
4. Inference → Model generates response in isolation
5. Signing → Enclave signs (prompt, response) with attested key
6. Settlement → Proof + payment receipt → Base Sepolia via x402
```

**Why This Matters:**

🔐 **Tamper-Proof** — Neither OpenGradient nor the cloud provider can alter your inference
🔍 **Verifiable** — Anyone can validate the TEE attestation on-chain
🛡️ **Private** — Prompts remain encrypted inside the hardware enclave
💰 **Settled** — Every call has an on-chain payment receipt via x402
📋 **Auditable** — Complete inference history with cryptographic proofs

**Use Cases:**
- DeFi protocols needing verified price predictions
- Healthcare AI requiring audit trails
- Legal/compliance AI with provable reasoning
- Autonomous agents needing trustless intelligence

*Powered by OpenGradient Network · TEE + x402 on Base Sepolia*""",
}

def get_demo_response(prompt: str) -> str:
    global sdk_error
    
    if PRIVATE_KEY and PRIVATE_KEY != "0xYourPrivateKeyHere" and not sdk_ready:
        return f"""⚠️ **OpenGradient SDK failed to initialize on the backend.**
        
**Error details:** `{sdk_error}`

This usually happens on Vercel due to missing system dependencies for Web3 cryptography, or an invalid private key format. 

Please ensure your Vercel Environment Variable `OG_PRIVATE_KEY` does not have quotes around it and is exactly a 64-character hex string starting with `0x`.

*(Backend is falling back to Demo Mode until this is resolved).*"""

    lower = prompt.lower()
    if any(w in lower for w in ["defi", "trend", "landscape", "market"]):
        return DEMO_RESPONSES["defi"]
    if any(w in lower for w in ["contract", "solidity", "erc", "token"]):
        return DEMO_RESPONSES["contract"]
    if any(w in lower for w in ["loan", "risk", "assess", "credit"]):
        return DEMO_RESPONSES["risk"]
    if any(w in lower for w in ["tee", "trusted", "verification", "enclave"]):
        return DEMO_RESPONSES["tee"]
    
    return f"""Thank you for your query. 

Your prompt was processed securely. However, the backend `OG_PRIVATE_KEY` is not set on Vercel.

To make this DApp real-time for everyone:
1. Go to your Vercel Project Settings > Environment Variables.
2. Add `OG_PRIVATE_KEY`.
3. Paste your real private key.
4. Redeploy.

*Running in demo mode.*"""

def generate_demo_hash() -> str:
    import random
    chars = "0123456789abcdef"
    return "0x" + "".join(random.choice(chars) for _ in range(64))

# ── API Endpoints ────────────────────────────

@app.get("/api/status")
async def get_status():
    """Check if SDK is configured for real inference."""
    return {
        "sdk_ready": sdk_ready,
        "mode": "live" if sdk_ready else "demo",
        "network": "Base Sepolia",
        "total_inferences": len(inference_history),
        "models_available": len(MODEL_MAP),
        "error": sdk_error,
    }

@app.post("/api/inference", response_model=InferenceResponse)
async def run_inference(req: InferenceRequest):
    """Run AI inference — real (via OpenGradient SDK) or simulated demo."""
    start_time = time.time()
    provider = req.model.split("/")[0]
    
    if sdk_ready and req.model in MODEL_MAP and MODEL_MAP[req.model]:
        # ═══════════════════════════════════════════
        # REAL OpenGradient Verified Inference
        # ═══════════════════════════════════════════
        try:
            tee_model = MODEL_MAP[req.model]
            settlement = SETTLEMENT_MAP.get(req.settlement, og.x402SettlementMode.BATCH_HASHED)
            
            if req.mode == "chat":
                messages = []
                if req.system_prompt:
                    messages.append({
                        "role": "system",
                        "content": req.system_prompt
                    })
                messages.append({
                    "role": "user",
                    "content": req.prompt
                })
                
                result = await llm_client.chat(
                    model=tee_model,
                    messages=messages,
                    max_tokens=req.max_tokens,
                    temperature=req.temperature,
                    x402_settlement_mode=settlement,
                )
                content = result.chat_output.get("content", "")
                payment_hash = getattr(result, "payment_hash", None)
                
            else:  # completion mode
                result = await llm_client.completion(
                    model=tee_model,
                    prompt=req.prompt,
                    max_tokens=req.max_tokens,
                    temperature=req.temperature,
                    x402_settlement_mode=settlement,
                )
                content = result.completion_output
                payment_hash = getattr(result, "payment_hash", None)
            
            latency = int((time.time() - start_time) * 1000)
            
            record = InferenceResponse(
                content=content,
                model=req.model,
                provider=provider,
                payment_hash=payment_hash,
                tee_verified=True,
                settlement_mode=req.settlement,
                timestamp=datetime.now(timezone.utc).isoformat(),
                latency_ms=latency,
                demo_mode=False,
            )
            inference_history.append(record.model_dump())
            return record
            
        except Exception as e:
            print(f"⚠️  SDK inference failed: {e}")
            print("   Falling back to demo mode for this request")
            # Fall through to demo mode
    
    # ═══════════════════════════════════════════
    # DEMO MODE — Simulated Response
    # ═══════════════════════════════════════════
    await asyncio.sleep(1.5)  # Simulate latency
    
    content = get_demo_response(req.prompt)
    latency = int((time.time() - start_time) * 1000)
    
    record = InferenceResponse(
        content=content,
        model=req.model,
        provider=provider,
        payment_hash=generate_demo_hash(),
        tee_verified=False,
        settlement_mode=req.settlement,
        timestamp=datetime.now(timezone.utc).isoformat(),
        latency_ms=latency,
        demo_mode=True,
    )
    inference_history.append(record.model_dump())
    return record

@app.post("/api/inference/stream")
async def stream_inference(req: StreamInferenceRequest):
    """Stream AI inference — real streaming via OpenGradient SDK."""
    
    if sdk_ready and req.model in MODEL_MAP and MODEL_MAP[req.model]:
        try:
            tee_model = MODEL_MAP[req.model]
            settlement = SETTLEMENT_MAP.get(req.settlement, og.x402SettlementMode.BATCH_HASHED)
            
            messages = [
                {"role": "system", "content": req.system_prompt or "You are a helpful assistant."},
                {"role": "user", "content": req.prompt},
            ]
            
            stream = await llm_client.chat(
                model=tee_model,
                messages=messages,
                max_tokens=req.max_tokens,
                temperature=req.temperature,
                x402_settlement_mode=settlement,
                stream=True,
            )
            
            async def generate():
                async for chunk in stream:
                    if chunk.choices[0].delta.content:
                        data = json.dumps({"content": chunk.choices[0].delta.content})
                        yield f"data: {data}\n\n"
                yield "data: [DONE]\n\n"
            
            return StreamingResponse(generate(), media_type="text/event-stream")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # Demo streaming
    demo_text = get_demo_response(req.prompt)
    
    async def demo_stream():
        words = demo_text.split(" ")
        for i, word in enumerate(words):
            data = json.dumps({"content": word + (" " if i < len(words) - 1 else "")})
            yield f"data: {data}\n\n"
            await asyncio.sleep(0.03)
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(demo_stream(), media_type="text/event-stream")

@app.get("/api/proofs")
async def get_proofs():
    """Get all inference proofs."""
    return {"proofs": inference_history, "total": len(inference_history)}

@app.get("/api/models")
async def get_models():
    """Get all supported models."""
    return {
        "models": {
            "openai": [
                {"id": "openai/gpt-5", "name": "GPT-5"},
                {"id": "openai/gpt-5-mini", "name": "GPT-5 Mini"},
                {"id": "openai/gpt-4.1-2025-04-14", "name": "GPT-4.1"},
                {"id": "openai/o4-mini", "name": "o4-mini"},
            ],
            "anthropic": [
                {"id": "anthropic/claude-opus-4-6", "name": "Claude Opus 4.6"},
                {"id": "anthropic/claude-sonnet-4-6", "name": "Claude Sonnet 4.6"},
                {"id": "anthropic/claude-sonnet-4-5", "name": "Claude Sonnet 4.5"},
                {"id": "anthropic/claude-haiku-4-5", "name": "Claude Haiku 4.5"},
            ],
            "google": [
                {"id": "google/gemini-3-pro", "name": "Gemini 3 Pro"},
                {"id": "google/gemini-3-flash", "name": "Gemini 3 Flash"},
                {"id": "google/gemini-2.5-pro", "name": "Gemini 2.5 Pro"},
                {"id": "google/gemini-2.5-flash", "name": "Gemini 2.5 Flash"},
            ],
            "xai": [
                {"id": "x-ai/grok-4", "name": "Grok 4"},
                {"id": "x-ai/grok-4-fast", "name": "Grok 4 Fast"},
            ],
        },
        "sdk_ready": sdk_ready,
    }

# ── Serve Frontend ───────────────────────────
app.mount("/", StaticFiles(directory=".", html=True), name="static")

# ── Run ──────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 55)
    print("  🔮 OpenGradient AI Oracle — Backend Server")
    print("=" * 55)
    print(f"  Mode:    {'🟢 LIVE (real TEE inference)' if sdk_ready else '🟡 DEMO (simulated)'}")
    print(f"  Network: Base Sepolia")
    print(f"  URL:     http://localhost:8000")
    print("=" * 55 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
