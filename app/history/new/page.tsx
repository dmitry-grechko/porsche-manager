import { Suspense } from 'react';
import AppShell from '@/components/shell/AppShell';
import NewServiceRecord from '@/components/views/NewServiceRecord';

export default function NewServiceRecordPage() {
  return (
    <AppShell>
      {/* NewServiceRecord uses useSearchParams() (?fromPlan=), which requires a
          Suspense boundary or static prerender of this route bails. */}
      <Suspense fallback={null}>
        <NewServiceRecord />
      </Suspense>
    </AppShell>
  );
}
