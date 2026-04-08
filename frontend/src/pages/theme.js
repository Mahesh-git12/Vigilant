export const THEME = {
  accent: "#00C2B3",
  accentDim: "rgba(0,194,179,0.15)",
  accentGlow: "rgba(0,194,179,0.25)",
  accentBright: "#00DDD0",
  danger: "#FF4444",
  warn: "#FF8C00",
  success: "#00C27A",
  bg: "#090C0F",
  surface: "#0E1318",
  surfaceHover: "#131A21",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(0,194,179,0.4)",
  textPrimary: "#E8EDF2",
  textSecondary: "rgba(232,237,242,0.5)",
  textMuted: "rgba(232,237,242,0.28)",
};

export const sharedCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --accent: #00C2B3;
    --accent-dim: rgba(0,194,179,0.15);
    --accent-glow: rgba(0,194,179,0.25);
    --accent-bright: #00DDD0;
    --danger: #FF4444;
    --success: #00C27A;
    --bg: #090C0F;
    --surface: #0E1318;
    --surface2: #131A21;
    --border: rgba(255,255,255,0.07);
    --border-accent: rgba(0,194,179,0.4);
    --text-primary: #E8EDF2;
    --text-secondary: rgba(232,237,242,0.5);
    --text-muted: rgba(232,237,242,0.25);
    --radius: 10px;
    --radius-lg: 16px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .v-root {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text-primary);
    overflow: hidden;
    position: relative;
  }

  /* ── GRID BACKGROUND ── */
  .v-grid-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(0,194,179,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,194,179,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }

  /* ── LEFT PANEL ── */
  .v-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;          /* CENTER instead of flex-start */
    padding: 64px 72px 64px 80px; /* more balanced padding */
    position: relative;
    overflow: hidden;
  }

  .v-left-glow {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,194,179,0.08) 0%, transparent 65%);
    top: -150px; left: -150px;
    pointer-events: none;
    animation: glowDrift 12s ease-in-out infinite alternate;
  }
  .v-left-glow2 {
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,194,179,0.05) 0%, transparent 65%);
    bottom: 60px; right: 0px;
    pointer-events: none;
    animation: glowDrift 9s ease-in-out infinite alternate-reverse;
  }

  @keyframes glowDrift {
    from { transform: translate(0, 0); }
    to   { transform: translate(25px, 30px); }
  }

  .v-left-content {
    position: relative; z-index: 2;
    width: 100%;
    max-width: 580px;             /* wider than before (was 460px) */
    display: flex; flex-direction: column;
    gap: 36px;
  }

  /* Logo */
  .v-logo {
    display: flex; align-items: center; gap: 14px;
  }
  .v-logo-mark {
    width: 46px; height: 46px;
    background: var(--accent-dim);
    border: 1.5px solid var(--border-accent);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .v-logo-mark::after {
    content: '';
    position: absolute; inset: -1px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(0,194,179,0.3), transparent);
    z-index: -1;
  }
  .v-logo-name {
    font-size: 1.5rem; font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }
  .v-logo-name em { color: var(--accent); font-style: normal; }

  /* Headline */
  .v-headline {
    display: flex; flex-direction: column; gap: 16px;
  }
  .v-headline-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    display: flex; align-items: center; gap: 8px;
  }
  .v-headline-eyebrow::before {
    content: '';
    display: inline-block;
    width: 20px; height: 1.5px;
    background: var(--accent);
  }
  .v-headline-title {
    font-size: clamp(2.2rem, 3.8vw, 3.2rem); /* bigger */
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: var(--text-primary);
  }
  .v-headline-title em {
    font-style: normal;
    color: var(--accent);
  }
  .v-headline-sub {
    font-size: 1.05rem; /* slightly bigger */
    color: var(--text-secondary);
    line-height: 1.7;
    font-weight: 400;
    max-width: 520px;
  }

  /* Feature list */
  .v-features {
    display: flex; flex-direction: column; gap: 10px;
  }
  .v-feature {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 16px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: border-color 0.2s, background 0.2s;
    cursor: default;
  }
  .v-feature:hover {
    border-color: var(--border-accent);
    background: var(--surface2);
  }
  .v-feature-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent);
    margin-top: 7px; flex-shrink: 0;
    box-shadow: 0 0 8px var(--accent);
  }
  .v-feature-body {}
  .v-feature-title { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 3px; }
  .v-feature-desc  { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }

  /* Stats */
  .v-stats { display: flex; gap: 12px; }
  .v-stat {
    flex: 1;
    padding: 18px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    text-align: center;
  }
  .v-stat-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.5rem; font-weight: 600;
    color: var(--accent); line-height: 1;
    margin-bottom: 5px;
  }
  .v-stat-label { font-size: 0.74rem; color: var(--text-muted); font-weight: 400; }

  /* ── RIGHT PANEL (form) ── */
  .v-right {
    width: 500px;                /* wider than before (was 460px) */
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 52px 48px;
    overflow-y: auto;
    position: relative;
    background: var(--surface);
    border-left: 1px solid var(--border);
  }

  .v-right::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    animation: topLine 4s ease-in-out infinite;
  }
  @keyframes topLine {
    0%,100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }

  /* Form header */
  .v-form-header { margin-bottom: 28px; }
  .v-form-title {
    font-size: 1.75rem; font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--text-primary);
    line-height: 1.2; margin-bottom: 8px;
  }
  .v-form-sub {
    font-size: 0.85rem; color: var(--text-muted);
  }
  .v-form-sub a {
    color: var(--accent); text-decoration: none; font-weight: 600;
    transition: opacity 0.15s;
  }
  .v-form-sub a:hover { opacity: 0.8; text-decoration: underline; }

  /* Google btn */
  .v-google-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 11px;
    padding: 13px 20px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius);
    color: var(--text-primary);
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    margin-bottom: 22px;
  }
  .v-google-btn:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.18);
    transform: translateY(-1px);
  }

  /* Divider */
  .v-divider {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px;
  }
  .v-divider-line { flex: 1; height: 1px; background: var(--border); }
  .v-divider-text { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }

  /* Fields */
  .v-fields { display: flex; flex-direction: column; gap: 14px; }

  .v-field { display: flex; flex-direction: column; gap: 6px; }
  .v-label {
    font-size: 0.76rem; font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 0.03em; text-transform: uppercase;
  }
  .v-label-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  .v-forgot {
    font-size: 0.75rem; color: var(--accent); text-decoration: none; font-weight: 500;
    transition: opacity 0.15s;
  }
  .v-forgot:hover { opacity: 0.75; }

  .v-input-wrap { position: relative; }
  .v-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--text-muted); pointer-events: none;
    display: flex; align-items: center;
  }
  .v-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-primary);
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; font-weight: 400;
    outline: none;
    transition: all 0.18s ease;
  }
  .v-input::placeholder { color: var(--text-muted); }
  .v-input:focus {
    border-color: var(--accent);
    background: rgba(0,194,179,0.04);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }

  /* Eye toggle */
  .v-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--text-muted);
    display: flex; align-items: center; padding: 0;
    transition: color 0.15s;
  }
  .v-eye:hover { color: var(--text-secondary); }

  /* Location row */
  .v-loc {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 15px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: all 0.2s;
  }
  .v-loc.active { border-color: rgba(0,194,115,0.4); background: rgba(0,194,115,0.04); }
  .v-loc.err    { border-color: rgba(255,68,68,0.35); }
  .v-loc-pulse {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    background: var(--text-muted);
    transition: background 0.3s;
  }
  .v-loc-pulse.active {
    background: var(--success);
    box-shadow: 0 0 8px var(--success);
    animation: pulse 1.8s ease-in-out infinite;
  }
  .v-loc-pulse.err { background: var(--danger); }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .v-loc-text { flex: 1; font-size: 0.8rem; color: var(--text-muted); }
  .v-loc-btn {
    padding: 4px 12px; border-radius: 6px;
    font-size: 0.72rem; font-weight: 700;
    border: 1px solid rgba(0,194,179,0.3);
    background: var(--accent-dim);
    color: var(--accent);
    font-family: 'Outfit', sans-serif; cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .v-loc-btn:hover { background: rgba(0,194,179,0.25); }
  .v-loc-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Hint */
  .v-hint { font-size: 0.71rem; color: var(--text-muted); margin-top: 2px; }

  /* Strength */
  .v-strength { display: flex; gap: 3px; margin-top: 6px; }
  .v-strength-bar {
    flex: 1; height: 2px; border-radius: 2px;
    background: var(--border);
    transition: background 0.3s;
  }

  /* Checkbox */
  .v-check-row { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .v-checkbox-wrap { position: relative; width: 17px; height: 17px; flex-shrink: 0; }
  .v-checkbox {
    appearance: none; -webkit-appearance: none;
    width: 17px; height: 17px;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 5px; cursor: pointer;
    transition: all 0.18s;
  }
  .v-checkbox:checked { background: var(--accent); border-color: var(--accent); }
  .v-checkbox:checked + .v-check-mark { opacity: 1; }
  .v-check-mark {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -52%);
    pointer-events: none; opacity: 0; transition: opacity 0.15s;
  }
  .v-check-label { font-size: 0.83rem; color: var(--text-secondary); }

  /* Submit */
  .v-submit {
    width: 100%; padding: 14px;
    margin-top: 4px;
    background: var(--accent);
    border: none; border-radius: var(--radius);
    color: #020d0c;
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem; font-weight: 800;
    cursor: pointer; letter-spacing: 0.01em;
    transition: all 0.2s ease;
    position: relative; overflow: hidden;
  }
  .v-submit:hover:not(:disabled) {
    background: var(--accent-bright);
    transform: translateY(-1px);
    box-shadow: 0 6px 24px var(--accent-glow);
  }
  .v-submit:active:not(:disabled) { transform: translateY(0); }
  .v-submit:disabled { opacity: 0.4; cursor: not-allowed; }
  .v-submit-inner { display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; z-index: 1; }

  /* Alert */
  .v-alert {
    padding: 12px 15px; border-radius: var(--radius);
    font-size: 0.82rem;
    display: flex; align-items: flex-start; gap: 9px;
    animation: fadeUp 0.28s ease;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:none; } }
  .v-alert.success { background: rgba(0,194,122,0.09); border: 1px solid rgba(0,194,122,0.25); color: #4ade9a; }
  .v-alert.error   { background: rgba(255,68,68,0.09);  border: 1px solid rgba(255,68,68,0.25);  color: #f87171; }

  /* Spinner */
  .v-spinner {
    width: 15px; height: 15px; border-radius: 50%;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: rgba(0,0,0,0.7);
    animation: spin 0.65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Status badge */
  .v-status-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 12px;
    background: rgba(0,194,179,0.08);
    border: 1px solid rgba(0,194,179,0.2);
    border-radius: 100px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem; color: var(--accent);
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .v-status-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s infinite;
  }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .v-left { display: none; }
    .v-right { width: 100%; border-left: none; padding: 40px 28px; }
  }
`;