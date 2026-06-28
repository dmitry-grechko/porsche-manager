'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useVehicle } from '@/lib/vehicle-context';

const mono = "'JetBrains Mono',monospace";

const PAGE_META: Record<string, [string, string]> = {
  '/garage': ['INTERACTIVE CUTAWAY', 'Component Explorer'],
  '/history': ['MAINTENANCE', 'Service History'],
  '/history/new': ['MAINTENANCE', 'New Service Record'],
  '/plans': ['MAINTENANCE', 'Service Plans'],
  '/faults': ['DIAGNOSTICS', 'Fault Finding'],
  '/settings': ['CONFIGURATION', 'Settings & MCP'],
};

export default function AppShell({
  children,
  headerActions,
}: {
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { vehicle: VEHICLE } = useVehicle();
  const [kicker, title] = PAGE_META[pathname] ?? PAGE_META['/garage'];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ECECEE' }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 68, flexShrink: 0, background: '#fff', borderBottom: '1px solid #E0E0E2',
            display: 'flex', alignItems: 'center', padding: '0 28px', gap: 18, position: 'sticky', top: 0, zIndex: 20,
          }}
        >
          <div>
            <div style={{ font: `500 10px/1 ${mono}`, letterSpacing: '.16em', color: '#9A9AA0' }}>{kicker}</div>
            <div style={{ font: "400 19px/1.1 'Helvetica Neue',Arial,sans-serif", letterSpacing: '-.01em', color: '#0B0B0C', marginTop: 4 }}>{title}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {headerActions ?? (
              <div style={{ font: `500 11px/1 ${mono}`, letterSpacing: '.1em', color: '#9A9AA0' }}>VIN {VEHICLE.vin}</div>
            )}
          </div>
        </header>

        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{children}</div>
      </main>
    </div>
  );
}
