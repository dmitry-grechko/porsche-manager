'use client';

import { VehicleProvider } from '@/lib/vehicle-context';
import { RecordsProvider } from '@/lib/records-context';
import { PlansProvider } from '@/lib/plans-context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <VehicleProvider>
      <RecordsProvider>
        <PlansProvider>{children}</PlansProvider>
      </RecordsProvider>
    </VehicleProvider>
  );
}
