'use client';

import { useEffect, useState } from 'react';
import type { AdminOverview } from '@/lib/admin';

const mono = "'JetBrains Mono',monospace";
const RED = 'var(--red, #D5001C)';

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminPanel() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/overview')
      .then(async (r) => {
        if (r.status === 403) throw new Error('You are not authorised to view this page.');
        if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.error || `Request failed (${r.status})`);
        return r.json() as Promise<AdminOverview>;
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const monoLabel: React.CSSProperties = {
    font: `500 10px/1 ${mono}`, letterSpacing: '.12em', color: '#9A9AA0',
  };

  const stats = data
    ? [
        { k: 'TOTAL USERS', v: data.totalUsers, color: '#0B0B0C' },
        { k: 'WITH A CAR', v: data.usersWithCar, color: RED },
        { k: 'TOTAL VEHICLES', v: data.totalVehicles, color: '#0B0B0C' },
      ]
    : [];

  return (
    <div className="padView" style={{ padding: 28, maxWidth: 980 }}>
      {data?.demo && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(213,0,28,.08)', border: '1px solid rgba(213,0,28,.25)', borderRadius: 4, font: `500 11px/1.4 ${mono}`, letterSpacing: '.04em', color: '#9A2230' }}>
          DEMO DATA — placeholder users. Connect Supabase + set SUPABASE_SERVICE_ROLE_KEY to see real sign-ups.
        </div>
      )}

      {loading && <div style={{ color: '#9A9AA0', font: "400 14px 'Helvetica Neue',Arial,sans-serif" }}>Loading usage…</div>}

      {error && (
        <div style={{ background: '#fff', border: '1px solid #E3E3E5', borderRadius: 4, padding: 24, color: '#9A2230', font: "400 14px/1.5 'Helvetica Neue',Arial,sans-serif" }}>
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="statCardsSm" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
            {stats.map((s) => (
              <div key={s.k} style={{ background: '#fff', border: '1px solid #E3E3E5', borderRadius: 4, padding: 18 }}>
                <div style={monoLabel}>{s.k}</div>
                <div style={{ marginTop: 10, font: "400 30px/1 'Helvetica Neue',Arial,sans-serif", color: s.color }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
            <div style={{ font: `500 11px/1 ${mono}`, letterSpacing: '.16em', color: '#6E6E73' }}>USERS</div>
            <div style={{ font: "400 13px/1 'Helvetica Neue',Arial,sans-serif", color: '#9A9AA0' }}>{data.users.length} accounts</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E3E3E5', borderRadius: 4, overflow: 'hidden' }}>
            {/* header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 1.2fr', gap: 14, padding: '12px 20px', borderBottom: '1px solid #EEEEF0', ...monoLabel }}>
              <div>EMAIL</div><div>JOINED</div><div>CAR?</div><div>VEHICLES</div>
            </div>
            {data.users.length === 0 && (
              <div style={{ padding: '24px 20px', color: '#9A9AA0', font: "400 14px 'Helvetica Neue',Arial,sans-serif" }}>No users yet.</div>
            )}
            {data.users.map((u) => (
              <div key={u.email} className="recrow" style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 1.2fr', gap: 14, padding: '14px 20px', borderBottom: '1px solid #F0F0F1', alignItems: 'center' }}>
                <div style={{ font: "400 14px 'Helvetica Neue',Arial,sans-serif", color: '#0B0B0C', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                <div style={{ font: `500 12px/1 ${mono}`, color: '#6E6E73' }}>{fmtDate(u.joined)}</div>
                <div>
                  <span style={{
                    font: `600 9px/1 ${mono}`, letterSpacing: '.1em', padding: '4px 7px', borderRadius: 2,
                    background: u.vehicleCount > 0 ? 'rgba(30,142,78,.1)' : '#EEEEF0',
                    color: u.vehicleCount > 0 ? '#1E8E4E' : '#9A9AA0',
                  }}>{u.vehicleCount > 0 ? `YES · ${u.vehicleCount}` : 'NO'}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {u.vehicles.length === 0
                    ? <span style={{ font: "400 13px 'Helvetica Neue',Arial,sans-serif", color: '#B4B4B8' }}>—</span>
                    : u.vehicles.map((v, i) => (
                      <span key={i} style={{ font: `500 11px/1 ${mono}`, color: '#6E6E73', background: '#F4F4F5', border: '1px solid #EAEAEC', borderRadius: 2, padding: '5px 8px' }}>{v}</span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
