/* ============================================
   OpenGradient AI Oracle — Application Logic
   ============================================ */

// ── Model Registry ──────────────────────────
const MODELS = {
    openai: [
        { id: 'openai/gpt-5', name: 'GPT-5', desc: 'Most capable reasoning model' },
        { id: 'openai/gpt-5-2', name: 'GPT-5.2', desc: 'Enhanced GPT-5 variant' },
        { id: 'openai/gpt-5-mini', name: 'GPT-5 Mini', desc: 'Fast and efficient' },
        { id: 'openai/gpt-4.1-2025-04-14', name: 'GPT-4.1', desc: 'Balanced performance' },
        { id: 'openai/o4-mini', name: 'o4-mini', desc: 'Reasoning-focused model' },
    ],
    anthropic: [
        { id: 'anthropic/claude-opus-4-6', name: 'Claude Opus 4.6', desc: 'Most powerful Claude model' },
        { id: 'anthropic/claude-opus-4-5', name: 'Claude Opus 4.5', desc: 'Advanced reasoning' },
        { id: 'anthropic/claude-sonnet-4-6', name: 'Claude Sonnet 4.6', desc: 'Balanced intelligence' },
        { id: 'anthropic/claude-sonnet-4-5', name: 'Claude Sonnet 4.5', desc: 'Fast and smart' },
        { id: 'anthropic/claude-haiku-4-5', name: 'Claude Haiku 4.5', desc: 'Ultra-fast responses' },
    ],
    google: [
        { id: 'google/gemini-3-pro', name: 'Gemini 3 Pro', desc: 'Latest Gemini flagship' },
        { id: 'google/gemini-3-flash', name: 'Gemini 3 Flash', desc: 'Blazing fast inference' },
        { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Advanced multimodal' },
        { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Speed-optimized' },
        { id: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Lite', desc: 'Lightweight model' },
    ],
    xai: [
        { id: 'x-ai/grok-4', name: 'Grok 4', desc: 'Flagship reasoning model' },
        { id: 'x-ai/grok-4-fast', name: 'Grok 4 Fast', desc: 'Optimized for speed' },
        { id: 'x-ai/grok-4.1-fast', name: 'Grok 4.1 Fast', desc: 'Latest fast variant' },
        { id: 'x-ai/grok-4-1-fast-non-reasoning', name: 'Grok 4.1 NR', desc: 'Non-reasoning mode' },
    ],
};

const PROVIDER_NAMES = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    google: 'Google',
    xai: 'xAI',
};

const PROVIDER_ICONS = {
    openai: '⚡',
    anthropic: '🔮',
    google: '💎',
    xai: '🚀',
};

// ── Simulated AI Responses ──────────────────
const AI_RESPONSES = {
    defi: `**DeFi Landscape Analysis — Q1 2026**

The DeFi ecosystem has undergone significant transformation. Key trends include:

1. **Real-World Asset (RWA) Tokenization** — Institutions are increasingly bridging TradFi assets on-chain. Over $15B in tokenized treasuries and private credit now live across major chains.

2. **Restaking & AVS Growth** — EigenLayer and competing protocols have created a new "security marketplace" with 200+ Active Validator Services generating yield.

3. **Intent-Based DEXs** — UniswapX and CoW Protocol now dominate DEX volume with solver-based execution, reducing MEV extraction by ~60%.

4. **AI-Managed Vaults** — Autonomous agents now manage ~$3B in DeFi strategies, using on-chain oracle feeds for dynamic rebalancing.

5. **Cross-Chain Liquidity** — Hop, Across, and Stargate have unified fragmented liquidity, making cross-chain swaps feel native.

**Emerging Trend:** Verifiable AI inference (via TEE + on-chain proofs) is enabling trustless AI oracles — precisely what OpenGradient pioneered.`,
    
    contract: `\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BurnToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18;
    uint256 public burnRate = 2; // 2% burn on transfer

    event TokensBurned(address indexed from, uint256 amount);
    event BurnRateUpdated(uint256 newRate);

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
        emit BurnRateUpdated(_rate);
    }
}
\`\`\`

This contract features automatic token burning on every transfer (2% default), with an adjustable burn rate capped at 10%.`,
    
    risk: `**Loan Risk Assessment Report**

| Factor | Value | Score |
|--------|-------|-------|
| Income | $85,000 | ✅ Good |
| Credit Score | 740 | ✅ Very Good |
| Debt-to-Income | 0.32 | ⚠️ Moderate  |
| Loan Amount | $300,000 | — |

**Risk Level: LOW-MODERATE** 🟢

**Analysis:**
- Credit score of 740 places the applicant in the "Very Good" tier (700-749)
- DTI ratio of 32% is within acceptable range but approaching the 36% threshold
- Income of $85k supports the requested $300k loan (3.53x multiple)
- Monthly payment estimate: ~$1,800/mo (approximately 25.4% of gross monthly income)

**Recommendation:** APPROVE with standard terms
- Suggested rate: Prime + 0.75%
- Full documentation required
- Verify 2 years of employment history

*This assessment was generated with cryptographic proof via TEE attestation.*`,
    
    tee: `**How TEE Verification Works for AI Inference in Web3**

A Trusted Execution Environment (TEE) is a secure area of a processor that guarantees code and data loaded inside is protected with respect to confidentiality and integrity.

**The Flow:**

1. **Enclave Creation** — The AI model runs inside an SGX/TDX enclave, isolated from the host OS
2. **Attestation** — The enclave produces a cryptographic quote proving:
   - Which code is running (measurement hash)
   - That it's running inside genuine hardware
   - The enclave's public key
3. **Inference Execution** — Your prompt enters the enclave, model generates response
4. **Proof Generation** — The enclave signs the (prompt, response) pair with its attested key
5. **On-Chain Settlement** — The proof + payment receipt is recorded on Base Sepolia via x402

**Why This Matters for Web3:**

🔐 **Tamper-Proof** — Nobody (not even OpenGradient) can alter the inference  
🔍 **Verifiable** — Anyone can check the TEE attestation on-chain  
🛡️ **Private** — The prompt stays encrypted inside the enclave  
💰 **Settled** — Every inference has an on-chain payment receipt  

This is the foundation of OpenGradient's decentralized AI network.`,

    default: `I'll provide a comprehensive analysis of your query. The OpenGradient network ensures this response is cryptographically verified through TEE attestation, with the payment settled on-chain via x402 protocol on Base Sepolia.

Key observations from your prompt:
- Your query has been securely processed inside a Trusted Execution Environment
- The inference used multi-provider model routing for optimal performance
- A cryptographic proof of this interaction is being settled on-chain

All OpenGradient inferences benefit from:
1. **Hardware-attested execution** — SGX enclave verification
2. **Payment transparency** — x402 on-chain settlement
3. **Multi-provider access** — OpenAI, Anthropic, Google, xAI
4. **Tamper-proof results** — Cryptographic attestation of every response

*Verified via OpenGradient Network · TEE Attestation Active*`,
};

// ── State ───────────────────────────────────
let state = {
    connected: false,
    walletAddress: null,
    provider: 'openai',
    model: 'openai/gpt-5',
    mode: 'chat',
    temperature: 0.7,
    maxTokens: 256,
    settlement: 'BATCH_HASHED',
    messages: [],
    proofs: [],
    inferenceCount: 0,
    settledAmount: 0,
    backendReady: false,
    sdkLive: false,
};

// ── Backend API Config ──────────────────────
const API_BASE = window.location.origin;

async function checkBackendStatus() {
    try {
        const res = await fetch(`${API_BASE}/api/status`);
        if (res.ok) {
            const data = await res.json();
            state.backendReady = true;
            state.sdkLive = data.sdk_ready;
            updateBackendBadge(data);
            return data;
        }
    } catch (e) {
        state.backendReady = false;
        state.sdkLive = false;
        console.log('Backend not available — using client-side demo mode');
    }
    return null;
}

function updateBackendBadge(data) {
    const badge = document.createElement('div');
    badge.className = 'backend-badge';
    badge.innerHTML = data.sdk_ready 
        ? '<span class="badge-live">● LIVE</span> Real TEE Inference'
        : '<span class="badge-demo">● DEMO</span> Simulated Responses';
    
    if (!$('#backendBadgeStyle')) {
        const style = document.createElement('style');
        style.id = 'backendBadgeStyle';
        style.textContent = `
            .backend-badge {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                background: rgba(10, 11, 15, 0.9);
                border: 1px solid var(--border-subtle);
                border-radius: 20px;
                font-size: 0.72rem;
                font-weight: 500;
                color: var(--text-secondary);
                z-index: 9999;
                backdrop-filter: blur(20px);
                font-family: var(--font-mono);
            }
            .badge-live {
                color: #00E68A;
                font-weight: 700;
            }
            .badge-demo {
                color: #FF9F43;
                font-weight: 700;
            }
        `;
        document.head.appendChild(style);
    }
    
    const existing = $('.backend-badge');
    if (existing) existing.remove();
    document.body.appendChild(badge);
}

// ── DOM References ──────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Particle Animation ─────────────────────
function initParticles() {
    const canvas = $('#particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.3 + 0.05;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.04 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
}

// ── Utility Functions ───────────────────────
function generateHash() {
    const chars = '0123456789abcdef';
    return '0x' + Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

function shortHash(hash) {
    return hash.slice(0, 10) + '...' + hash.slice(-6);
}

function generateWalletAddress() {
    const chars = '0123456789abcdef';
    return '0x' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Animate Counter ─────────────────────────
function animateCounter(element, target, duration = 1500) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    function update() {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = Math.round(target).toLocaleString();
            return;
        }
        element.textContent = Math.round(current).toLocaleString();
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ── Navigation ──────────────────────────────
function initNavigation() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        const navbar = $('#navbar');
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Nav links
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            $$('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ── Wallet Connection ───────────────────────
function initWallet() {
    $('#connectWallet').addEventListener('click', () => {
        if (state.connected) {
            state.connected = false;
            state.walletAddress = null;
            $('#walletLabel').textContent = 'Connect Wallet';
            $('#connectWallet').classList.remove('connected');
            return;
        }

        // Simulate wallet connection
        state.connected = true;
        state.walletAddress = generateWalletAddress();
        const short = state.walletAddress.slice(0, 6) + '...' + state.walletAddress.slice(-4);
        $('#walletLabel').textContent = short;
        $('#connectWallet').classList.add('connected');
        
        // Flash notification
        showToast('Wallet connected on Base Sepolia', 'success');
    });
}

// ── Toast Notifications ─────────────────────
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span>${message}</span>
    `;
    
    // Add toast styles if not present
    if (!$('#toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 80px;
                right: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 20px;
                border-radius: 10px;
                font-size: 0.85rem;
                font-family: var(--font-sans);
                z-index: 9999;
                animation: toastIn 0.4s ease, toastOut 0.4s ease 2.5s forwards;
                backdrop-filter: blur(20px);
            }
            .toast-success {
                background: rgba(0, 230, 138, 0.12);
                border: 1px solid rgba(0, 230, 138, 0.2);
                color: #00E68A;
            }
            .toast-error {
                background: rgba(255, 77, 77, 0.12);
                border: 1px solid rgba(255, 77, 77, 0.2);
                color: #FF4D4D;
            }
            .toast-info {
                background: rgba(0, 240, 255, 0.12);
                border: 1px solid rgba(0, 240, 255, 0.2);
                color: #00F0FF;
            }
            .toast-icon {
                font-weight: 700;
            }
            @keyframes toastIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes toastOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ── Provider & Model Selection ──────────────
function initProviderSelection() {
    $$('.provider-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const provider = tab.dataset.provider;
            state.provider = provider;
            
            $$('.provider-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            updateModelSelect(provider);
        });
    });
    
    $('#modelSelect').addEventListener('change', (e) => {
        state.model = e.target.value;
    });
}

function updateModelSelect(provider) {
    const select = $('#modelSelect');
    const models = MODELS[provider];
    
    select.innerHTML = models.map(m => 
        `<option value="${m.id}">${m.name}</option>`
    ).join('');
    
    state.model = models[0].id;
}

// ── Parameters ──────────────────────────────
function initParameters() {
    const tempSlider = $('#temperature');
    const tokensSlider = $('#maxTokens');
    
    tempSlider.addEventListener('input', (e) => {
        state.temperature = parseFloat(e.target.value);
        $('#tempValue').textContent = state.temperature.toFixed(1);
    });
    
    tokensSlider.addEventListener('input', (e) => {
        state.maxTokens = parseInt(e.target.value);
        $('#tokensValue').textContent = state.maxTokens;
    });
}

// ── Mode Toggle ─────────────────────────────
function initModeToggle() {
    $$('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.mode = btn.dataset.mode;
        });
    });
}

// ── Settlement Selection ────────────────────
function initSettlement() {
    $$('.settlement-option').forEach(option => {
        option.addEventListener('click', () => {
            $$('.settlement-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            state.settlement = option.querySelector('input').value;
        });
    });
}

// ── Chat Interface ──────────────────────────
function initChat() {
    const input = $('#chatInput');
    const sendBtn = $('#sendBtn');
    
    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
    
    // Send message
    sendBtn.addEventListener('click', () => sendMessage());
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Quick prompts
    $$('.quick-prompt').forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.dataset.prompt;
            input.dispatchEvent(new Event('input'));
            sendMessage();
        });
    });
}

async function sendMessage() {
    const input = $('#chatInput');
    const text = input.value.trim();
    if (!text) return;
    
    // Clear welcome
    const welcome = $('.welcome-message');
    if (welcome) welcome.remove();
    
    // Add user message
    addMessage('user', text);
    input.value = '';
    input.style.height = 'auto';
    
    // Show typing
    const typingEl = addTypingIndicator();
    
    // Disable send
    $('#sendBtn').disabled = true;
    
    let response, paymentHash, modelName, teeVerified, demoMode;
    
    // Try backend API first
    if (state.backendReady) {
        try {
            const res = await fetch(`${API_BASE}/api/inference`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: text,
                    model: state.model,
                    mode: state.mode,
                    temperature: state.temperature,
                    max_tokens: state.maxTokens,
                    settlement: state.settlement,
                }),
            });
            
            if (res.ok) {
                const data = await res.json();
                typingEl.remove();
                
                response = data.content;
                paymentHash = data.payment_hash || generateHash();
                modelName = data.model.split('/').pop();
                teeVerified = data.tee_verified;
                demoMode = data.demo_mode;
                
                addMessage('assistant', response, {
                    model: modelName,
                    hash: paymentHash,
                    verified: teeVerified,
                    demoMode: demoMode,
                    latency: data.latency_ms,
                });
                
                addProof(paymentHash, modelName, teeVerified);
                
                state.inferenceCount++;
                state.settledAmount += (0.001 + Math.random() * 0.005);
                animateCounter($('#statInferences'), state.inferenceCount, 500);
                $('#statSettled').textContent = state.settledAmount.toFixed(4);
                
                $('#sendBtn').disabled = false;
                
                const badge = teeVerified ? 'TEE Verified' : 'Demo Mode';
                showToast(`${badge} · ${shortHash(paymentHash)} · ${data.latency_ms}ms`, 
                    teeVerified ? 'success' : 'info');
                return;
            }
        } catch (err) {
            console.log('Backend call failed, using client-side fallback:', err);
        }
    }
    
    // Client-side fallback (no backend)
    await sleep(1500 + Math.random() * 2000);
    typingEl.remove();
    
    response = getAIResponse(text);
    paymentHash = generateHash();
    modelName = state.model.split('/').pop();
    
    addMessage('assistant', response, {
        model: modelName,
        hash: paymentHash,
        verified: false,
        demoMode: true,
    });
    
    addProof(paymentHash, modelName, false);
    
    state.inferenceCount++;
    state.settledAmount += (0.001 + Math.random() * 0.005);
    animateCounter($('#statInferences'), state.inferenceCount, 500);
    $('#statSettled').textContent = state.settledAmount.toFixed(4);
    
    $('#sendBtn').disabled = false;
    showToast(`Demo Mode · ${shortHash(paymentHash)}`, 'info');
}

function getAIResponse(prompt) {
    const lower = prompt.toLowerCase();
    if (lower.includes('defi') || lower.includes('trend')) return AI_RESPONSES.defi;
    if (lower.includes('contract') || lower.includes('solidity') || lower.includes('erc')) return AI_RESPONSES.contract;
    if (lower.includes('loan') || lower.includes('risk') || lower.includes('assess')) return AI_RESPONSES.risk;
    if (lower.includes('tee') || lower.includes('trusted') || lower.includes('verification')) return AI_RESPONSES.tee;
    return AI_RESPONSES.default;
}

function addMessage(role, content, meta = null) {
    const messages = $('#chatMessages');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    
    const avatarContent = role === 'user' ? 'U' : 'OG';
    
    let metaHTML = '';
    if (meta) {
        const verifyBadge = meta.verified 
            ? '<span class="meta-badge">✓ TEE Verified</span>' 
            : '<span class="meta-badge demo">◎ Demo Mode</span>';
        const latencyText = meta.latency ? `<span class="meta-latency">${meta.latency}ms</span>` : '';
        metaHTML = `
            <div class="message-meta">
                ${verifyBadge}
                <span class="proof-model">${meta.model}</span>
                <span class="meta-hash">${shortHash(meta.hash)}</span>
                ${latencyText}
            </div>
        `;
    } else if (role === 'user') {
        metaHTML = `<div class="message-meta"><span>${formatTime(new Date())}</span></div>`;
    }
    
    // Simple markdown rendering
    let rendered = content
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code style="background:rgba(0,240,255,0.08);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:0.8em;">$1</code>')
        .replace(/\n/g, '<br>');
    
    div.innerHTML = `
        <div class="message-avatar">${avatarContent}</div>
        <div class="message-body">
            <div class="message-content">${rendered}</div>
            ${metaHTML}
        </div>
    `;
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addTypingIndicator() {
    const messages = $('#chatMessages');
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.innerHTML = `
        <div class="message-avatar">OG</div>
        <div class="message-body">
            <div class="message-content typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
}

// ── Proof Explorer ──────────────────────────
function addProof(hash, model, teeVerified = false) {
    const proof = {
        timestamp: new Date(),
        model: model,
        provider: state.provider,
        settlement: state.settlement,
        hash: hash,
        status: teeVerified ? 'verified' : 'pending',
    };
    
    state.proofs.unshift(proof);
    renderProofs();
}

function renderProofs() {
    const tbody = $('#proofTableBody');
    const empty = $('#emptyProofs');
    const count = $('#proofCount');
    
    if (state.proofs.length === 0) {
        empty.style.display = 'flex';
        tbody.closest('.proof-table').style.display = 'none';
        count.textContent = '0 proofs on-chain';
        return;
    }
    
    empty.style.display = 'none';
    tbody.closest('.proof-table').style.display = 'table';
    count.textContent = `${state.proofs.length} proof${state.proofs.length > 1 ? 's' : ''} on-chain`;
    
    tbody.innerHTML = state.proofs.map(p => `
        <tr>
            <td>${formatTime(p.timestamp)}</td>
            <td><span class="proof-model">${p.model}</span></td>
            <td>${PROVIDER_NAMES[p.provider]}</td>
            <td>${p.settlement.replace('_', ' ')}</td>
            <td><span class="proof-hash">${p.hash}</span></td>
            <td><span class="proof-status ${p.status}">✓ ${p.status}</span></td>
        </tr>
    `).join('');
}

// ── Models Grid ─────────────────────────────
function renderModelsGrid() {
    const grid = $('#modelsGrid');
    let html = '';
    
    for (const [provider, models] of Object.entries(MODELS)) {
        models.forEach(model => {
            html += `
                <div class="model-card" data-provider="${provider}" data-model="${model.id}">
                    <div class="model-card-header">
                        <span class="model-provider ${provider}">${PROVIDER_NAMES[provider]}</span>
                        <span class="model-tee-badge">🛡️ TEE</span>
                    </div>
                    <div class="model-name">${model.name}</div>
                    <div class="model-id">${model.id}</div>
                </div>
            `;
        });
    }
    
    grid.innerHTML = html;
    
    // Click to select model
    $$('.model-card').forEach(card => {
        card.addEventListener('click', () => {
            const provider = card.dataset.provider;
            const modelId = card.dataset.model;
            
            // Update provider tabs
            state.provider = provider;
            $$('.provider-tab').forEach(t => t.classList.remove('active'));
            $(`.provider-tab[data-provider="${provider}"]`).classList.add('active');
            
            // Update model select
            updateModelSelect(provider);
            $('#modelSelect').value = modelId;
            state.model = modelId;
            
            const modelName = MODELS[provider].find(m => m.id === modelId)?.name;
            showToast(`Selected ${modelName} from ${PROVIDER_NAMES[provider]}`, 'info');
            
            // Scroll to inference
            document.querySelector('#inference').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ── Code Tabs ───────────────────────────────
function initCodeTabs() {
    $$('.code-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.code-tab').forEach(t => t.classList.remove('active'));
            $$('.code-block').forEach(b => b.classList.remove('active'));
            
            tab.classList.add('active');
            $(`#code-${tab.dataset.tab}`).classList.add('active');
        });
    });
    
    $$('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const codeBlock = btn.closest('.code-block').querySelector('code');
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                btn.textContent = 'Copied!';
                btn.style.color = '#00E68A';
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.style.color = '';
                }, 2000);
            });
        });
    });
}

// ── Animated Stats ──────────────────────────
function animateHeroStats() {
    setTimeout(() => {
        animateCounter($('#statInferences'), 847291, 2500);
        animateCounter($('#statSettled'), 12847, 2500);
    }, 500);
}

// ── Initialize ──────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    initParticles();
    initNavigation();
    initWallet();
    initProviderSelection();
    initParameters();
    initModeToggle();
    initSettlement();
    initChat();
    initCodeTabs();
    renderModelsGrid();
    renderProofs();
    animateHeroStats();
    
    // Check if backend is running
    await checkBackendStatus();
});
