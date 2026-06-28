'use client';

import Link from 'next/link';

export default function NewRecordButton() {
  return (
    <Link
      href="/history/new"
      style={{
        height: 40, padding: '0 18px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 2,
        font: "600 11px/1 'Helvetica Neue',Arial,sans-serif", letterSpacing: '.1em', textTransform: 'uppercase',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
      }}
    >
      + New record
    </Link>
  );
}
