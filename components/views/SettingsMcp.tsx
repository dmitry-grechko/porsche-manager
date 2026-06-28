'use client';

import { useEffect, useState } from 'react';
import { MCP_TOOLS, RAG_SOURCES, ENGINES, TRANS, COLORS } from '@/lib/data';
import { useVehicle, MODEL_OPTIONS } from '@/lib/vehicle-context';
import { createClient } from '@/lib/supabase/client';
import { DEMO_MODE, DEMO_EMAIL, DEMO_TOKEN } from '@/lib/demo';
import type { BodyType } from '@/lib/types';

const DEFAULT_MODEL_NAME: Record<BodyType, string> = {
  boxster: 'Boxster S (981)',
  cayman: 'Cayman S (981)',
};

export default function SettingsMcp() {
  const { vehicle, update, reset } = useVehicle();
  const [mcpOn, setMcpOn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [endpoint, setEndpoint] = useState<string>('/api/mcp');
  const [token, setToken] = useState<string>('');
  const [tokenShown, setTokenShown] = useState<boolean>(false);
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEndpoint(`${window.location.origin}/api/mcp`);
    }
    if (DEMO_MODE) { setEmail(DEMO_EMAIL); setToken(DEMO_TOKEN); return; }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ''));
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? ''));
  }, []);

  const copy = (value: string, key: string) => {
    if (!value) return;
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(''), 1400);
  };

  const maskedToken = token
    ? `${token.slice(0, 8)}…${token.slice(-6)}`
    : 'Sign in to reveal your token';

  const mcpEndpoint = endpoint;

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 44, padding: '0 12px', background: '#F6F6F7', border: '1px solid #D2D2D6',
    borderRadius: 2, font: "400 14px 'Helvetica Neue',Arial,sans-serif", color: '#0B0B0C',
  };
  const fieldLabel: React.CSSProperties = {
    display: 'block', font: "500 11px/1 'JetBrains Mono',monospace", letterSpacing: '.1em',
    textTransform: 'uppercase', color: '#6E6E73', margin: '0 0 8px',
  };
  const chip = (active: boolean): React.CSSProperties => ({
    padding: '9px 13px', borderRadius: 2, cursor: 'pointer', font: "500 12px/1 'Helvetica Neue',Arial,sans-serif",
    background: active ? 'var(--red, #D5001C)' : '#F6F6F7', color: active ? '#fff' : '#46464A',
    border: `1px solid ${active ? 'var(--red, #D5001C)' : '#DDDDE0'}`,
  });

  const monoLabel: React.CSSProperties = {
    font: "500 10px/1 'JetBrains Mono',monospace",
    letterSpacing: '.08em',
    textTransform: 'uppercase',
    color: '#9A9AA0',
  };

  return (
    <div style={{ padding: 28, maxWidth: 880 }}>
      {/* account */}
      <div style={{ background: '#fff', border: '1px solid #E3E3E5', borderRadius: 4, padding: 24, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.16em', color: '#9A9AA0' }}>ACCOUNT</div>
          <form action="/auth/signout" method="post" style={{ marginLeft: 'auto' }}>
            <button
              type="submit"
              style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.08em', color: 'var(--red, #D5001C)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              SIGN OUT
            </button>
          </form>
        </div>
        <div>
          <div style={monoLabel}>Email</div>
          <div style={{ marginTop: 7, font: "400 15px 'Helvetica Neue',Arial,sans-serif", color: '#0B0B0C' }}>{email || '—'}</div>
        </div>
      </div>

      {/* vehicle — editable */}
      <div style={{ background: '#fff', border: '1px solid #E3E3E5', borderRadius: 4, padding: 24, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.16em', color: '#9A9AA0' }}>VEHICLE</div>
          <button
            onClick={reset}
            style={{ marginLeft: 'auto', font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.08em', color: '#9A9AA0', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            RELOAD FROM SERVER
          </button>
        </div>

        {/* chassis / model — drives which 3D model renders */}
        <label style={fieldLabel}>Model (rendered in 3D)</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {MODEL_OPTIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => update({ body: m.id, model: DEFAULT_MODEL_NAME[m.id] })}
              style={chip(vehicle.body === m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={fieldLabel}>Model name</label>
            <input value={vehicle.model} onChange={(e) => update({ model: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={fieldLabel}>Model year</label>
            <input value={vehicle.year} onChange={(e) => update({ year: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={fieldLabel}>Licence plate</label>
            <input value={vehicle.plate} onChange={(e) => update({ plate: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <label style={fieldLabel}>Chassis VIN</label>
            <input value={vehicle.vin} onChange={(e) => update({ vin: e.target.value })} style={{ ...inputStyle, font: "500 14px 'JetBrains Mono',monospace", letterSpacing: '.04em' }} />
          </div>
          <div>
            <label style={fieldLabel}>Odometer (mi)</label>
            <input value={vehicle.mileage} onChange={(e) => update({ mileage: e.target.value.replace(/[^0-9]/g, '') })} style={{ ...inputStyle, fontFamily: "'JetBrains Mono',monospace" }} />
          </div>
        </div>

        <label style={fieldLabel}>Engine</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {ENGINES.map((e) => (
            <button key={e} onClick={() => update({ engine: e })} style={chip(vehicle.engine === e)}>{e}</button>
          ))}
        </div>

        <label style={fieldLabel}>Transmission</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {TRANS.map((t) => (
            <button key={t} onClick={() => update({ trans: t })} style={chip(vehicle.trans === t)}>{t}</button>
          ))}
        </div>

        <label style={fieldLabel}>Paint — {vehicle.colorName}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
          {COLORS.map((c) => (
            <button
              key={c.hex}
              title={c.name}
              onClick={() => update({ colorName: c.name, colorHex: c.hex })}
              style={{
                width: 30, height: 30, borderRadius: 4, cursor: 'pointer', padding: 0, background: c.hex,
                border: vehicle.colorHex === c.hex ? '2px solid var(--red, #D5001C)' : '1px solid #D2D2D6',
                boxShadow: vehicle.colorHex === c.hex ? '0 0 0 3px rgba(213,0,28,.15)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* MCP */}
      <div style={{ background: '#0B0B0C', borderRadius: 4, padding: 24, marginBottom: 18, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{ color: 'var(--red, #D5001C)', fontFamily: "'JetBrains Mono',monospace", fontSize: 18 }}>&lowast;</span>
          <div style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.16em', color: '#9A9AA0' }}>CLAUDE / MCP INTEGRATION</div>
          <span
            style={{
              marginLeft: 'auto',
              font: "600 9px/1 'JetBrains Mono',monospace",
              letterSpacing: '.12em',
              padding: '5px 9px',
              borderRadius: 2,
              color: mcpOn ? '#3CD37A' : '#A8A8AD',
              background: mcpOn ? 'rgba(60,211,122,.14)' : 'rgba(255,255,255,.08)',
            }}
          >
            {mcpOn ? 'CONNECTED' : 'OFFLINE'}
          </span>
        </div>
        <p style={{ margin: '6px 0 20px', font: "400 14px/1.6 'Helvetica Neue',Arial,sans-serif", color: '#A8A8AD', maxWidth: 560 }}>
          Expose your garage to Claude as an MCP server. Ask Claude in any chat to log a service from a photo, look up a torque spec,
          or diagnose a fault &mdash; it reads and writes here with your approval.
        </p>

        <div
          style={{
            background: '#141416',
            border: '1px solid #232327',
            borderRadius: 3,
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ font: "500 10px/1 'JetBrains Mono',monospace", color: '#76767B' }}>ENDPOINT</span>
          <span style={{ font: "500 13px/1 'JetBrains Mono',monospace", color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {mcpEndpoint}
          </span>
          <span
            onClick={() => copy(mcpEndpoint, 'endpoint')}
            style={{ font: "500 10px/1 'JetBrains Mono',monospace", color: 'var(--red, #D5001C)', cursor: 'pointer' }}
          >
            {copied === 'endpoint' ? 'COPIED' : 'COPY'}
          </span>
        </div>

        {/* access token — for testing with a Bearer header */}
        <div
          style={{
            background: '#141416',
            border: '1px solid #232327',
            borderRadius: 3,
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ font: "500 10px/1 'JetBrains Mono',monospace", color: '#76767B' }}>TOKEN</span>
          <span style={{ font: "500 13px/1 'JetBrains Mono',monospace", color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tokenShown && token ? token : maskedToken}
          </span>
          {token && (
            <span
              onClick={() => setTokenShown((v) => !v)}
              style={{ font: "500 10px/1 'JetBrains Mono',monospace", color: '#76767B', cursor: 'pointer' }}
            >
              {tokenShown ? 'HIDE' : 'SHOW'}
            </span>
          )}
          <span
            onClick={() => copy(token, 'token')}
            style={{ font: "500 10px/1 'JetBrains Mono',monospace", color: 'var(--red, #D5001C)', cursor: token ? 'pointer' : 'default', opacity: token ? 1 : 0.4 }}
          >
            {copied === 'token' ? 'COPIED' : 'COPY'}
          </span>
        </div>
        <p style={{ margin: '-6px 0 16px', font: "400 11px/1.5 'Helvetica Neue',Arial,sans-serif", color: '#76767B', maxWidth: 560 }}>
          This is your Supabase access token. It expires in ~1 hour — re-copy after it refreshes.
          Knowledge tools work without it; garage tools (your vehicles & service history) need it as a Bearer header.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {MCP_TOOLS.map((t) => (
            <div key={t.name} style={{ background: '#141416', border: '1px solid #232327', borderRadius: 3, padding: '13px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: mcpOn ? '#1E8E4E' : '#76767B' }} />
                <span style={{ font: "500 12px/1 'JetBrains Mono',monospace", color: '#fff' }}>{t.name}</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    font: "600 8px/1 'JetBrains Mono',monospace",
                    letterSpacing: '.1em',
                    padding: '3px 6px',
                    borderRadius: 2,
                    color: t.auth ? 'var(--red, #D5001C)' : '#3CD37A',
                    background: t.auth ? 'rgba(213,0,28,.12)' : 'rgba(60,211,122,.12)',
                  }}
                >
                  {t.auth ? 'AUTH' : 'OPEN'}
                </span>
              </div>
              <div style={{ marginTop: 7, font: "400 12px/1.45 'Helvetica Neue',Arial,sans-serif", color: '#8A8A8F' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* connect instructions */}
        <div
          style={{
            marginTop: 16,
            background: '#141416',
            border: '1px solid #232327',
            borderRadius: 3,
            padding: '14px 16px',
          }}
        >
          <div style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.12em', color: '#76767B', marginBottom: 10 }}>
            CONNECT FROM CLAUDE CODE
          </div>
          <pre
            style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              font: "500 11px/1.6 'JetBrains Mono',monospace",
              color: '#D8D8DC',
            }}
          >
            {`claude mcp add --transport http flatsix \\\n  ${mcpEndpoint} \\\n  --header "Authorization: Bearer ${tokenShown && token ? token : '<token>'}"`}
          </pre>
          <p style={{ margin: '10px 0 0', font: "400 11px/1.5 'Helvetica Neue',Arial,sans-serif", color: '#76767B' }}>
            Omit the header to use the open knowledge tools only. For Claude Desktop / claude.ai, add{' '}
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: '#A8A8AD' }}>{mcpEndpoint}</span> as a custom connector
            (the deployed HTTPS URL), or test locally with{' '}
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: '#A8A8AD' }}>npx @modelcontextprotocol/inspector</span>. See MCP_SETUP.md.
          </p>
        </div>

        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setMcpOn((v) => !v)}
            style={{
              height: 42,
              padding: '0 22px',
              border: 'none',
              borderRadius: 2,
              font: "600 11px/1 'Helvetica Neue',Arial,sans-serif",
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              background: mcpOn ? '#232327' : 'var(--red, #D5001C)',
              color: '#fff',
            }}
          >
            {mcpOn ? 'Disconnect' : 'Connect server'}
          </button>
          <span style={{ font: "400 12px/1.4 'Helvetica Neue',Arial,sans-serif", color: '#76767B' }}>
            {mcpOn ? 'Active in your Claude clients. Reads & writes require approval.' : 'Add the endpoint to Claude to enable garage tools.'}
          </span>
        </div>
      </div>

      {/* RAG */}
      <div style={{ background: '#fff', border: '1px solid #E3E3E5', borderRadius: 4, padding: 24 }}>
        <div style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: '.16em', color: '#9A9AA0', marginBottom: 6 }}>
          KNOWLEDGE BASE (RAG)
        </div>
        <p style={{ margin: '0 0 18px', font: "400 13px/1.55 'Helvetica Neue',Arial,sans-serif", color: '#6E6E73', maxWidth: 560 }}>
          Indexed sources Claude searches when answering questions about your car.
        </p>
        {RAG_SOURCES.map((r) => {
          const live = !!r.live;
          return (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderTop: '1px solid #F0F0F1' }}>
              <span style={{ font: "500 11px/1 'JetBrains Mono',monospace", color: '#6E6E73', flex: 1 }}>{r.name}</span>
              <span style={{ font: "500 10px/1 'JetBrains Mono',monospace", color: '#9A9AA0' }}>{r.chunks}</span>
              <span
                style={{
                  font: "600 9px/1 'JetBrains Mono',monospace",
                  letterSpacing: '.1em',
                  padding: '4px 7px',
                  borderRadius: 2,
                  color: live ? 'var(--red, #D5001C)' : '#1E8E4E',
                  background: live ? 'rgba(213,0,28,.1)' : 'rgba(30,142,78,.1)',
                }}
              >
                {r.statusLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
