'use client';

import { useState } from 'react';
import { FAULTS } from '@/lib/data';
import type { Fault } from '@/lib/types';

// [color, background] per severity — mirrors the mockup's sevMap.
const SEV_MAP: Record<Fault['sev'], [string, string]> = {
  LOW: ['#7A7A80', '#EEEEF0'],
  MED: ['#C77700', 'rgba(199,119,0,.12)'],
  HIGH: ['var(--red, #D5001C)', 'rgba(213,0,28,.1)'],
};

export default function FaultFinding() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  function askClaude(f: Fault) {
    // No-op for now; would open the Claude/MCP diagnosis flow.
    // eslint-disable-next-line no-console
    console.log('Diagnose with Claude:', f.title);
  }

  return (
    <div style={{ padding: 28, maxWidth: 920 }}>
      <div
        style={{
          background: '#fff',
          border: '1px solid #E3E3E5',
          borderRadius: 4,
          padding: '18px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--red, #D5001C)', fontSize: 18 }}>&lowast;</span>
        <div style={{ font: "400 14px/1.5 'Helvetica Neue',Arial,sans-serif", color: '#46464A' }}>
          Pick a symptom to see likely causes, diagnostic checks and parts &mdash; or send it to Claude over MCP to walk the
          diagnosis with your live fault codes.
        </div>
      </div>

      {FAULTS.map((f) => {
        const open = openId === f.id;
        const [sevColor, sevBg] = SEV_MAP[f.sev];

        return (
          <div key={f.id} style={{ background: '#fff', border: '1px solid #E3E3E5', borderRadius: 4, marginBottom: 12, overflow: 'hidden' }}>
            <div
              onClick={() => toggle(f.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', cursor: 'pointer' }}
            >
              <span
                style={{
                  flexShrink: 0,
                  font: "700 9px/1 'JetBrains Mono',monospace",
                  letterSpacing: '.1em',
                  padding: '6px 8px',
                  borderRadius: 2,
                  color: sevColor,
                  background: sevBg,
                }}
              >
                {f.sev}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ font: "400 16px/1.2 'Helvetica Neue',Arial,sans-serif", color: '#0B0B0C' }}>{f.title}</div>
                <div style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.1em', color: '#9A9AA0', marginTop: 5 }}>
                  {f.system}
                </div>
              </div>
              <span style={{ font: "500 18px/1 'JetBrains Mono',monospace", color: '#B4B4B8', transition: 'transform .2s' }}>
                {open ? '–' : '+'}
              </span>
            </div>

            <div
              style={{
                maxHeight: open ? 520 : 0,
                overflow: 'hidden',
                borderTop: open ? '1px solid #F0F0F1' : 'none',
                transition: 'max-height .3s',
              }}
            >
              <div style={{ padding: '4px 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
                <div>
                  <div style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.12em', color: '#9A9AA0', marginBottom: 10 }}>
                    LIKELY CAUSES
                  </div>
                  {f.causes.map((c, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', gap: 9, marginBottom: 8, font: "400 13px/1.45 'Helvetica Neue',Arial,sans-serif", color: '#2A2A2E' }}
                    >
                      <span style={{ color: 'var(--red, #D5001C)' }}>&bull;</span>
                      {c}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.12em', color: '#9A9AA0', marginBottom: 10 }}>
                    DIAGNOSTIC CHECKS
                  </div>
                  {f.checks.map((ck, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', gap: 9, marginBottom: 8, font: "400 13px/1.45 'Helvetica Neue',Arial,sans-serif", color: '#2A2A2E' }}
                    >
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: '#9A9AA0' }}>&rarr;</span>
                      {ck}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.1em', color: '#9A9AA0' }}>PARTS:</span>
                <span style={{ font: "500 11px/1.4 'JetBrains Mono',monospace", color: '#6E6E73' }}>{f.parts}</span>
                <button
                  onClick={() => askClaude(f)}
                  style={{
                    marginLeft: 'auto',
                    height: 36,
                    padding: '0 16px',
                    background: '#0B0B0C',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 2,
                    font: "600 10px/1 'Helvetica Neue',Arial,sans-serif",
                    letterSpacing: '.06em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                  }}
                >
                  <span style={{ color: 'var(--red, #D5001C)', fontFamily: "'JetBrains Mono',monospace" }}>&lowast;</span> Diagnose with Claude
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
