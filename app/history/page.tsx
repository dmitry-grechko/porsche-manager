import AppShell from '@/components/shell/AppShell';
import NewRecordButton from '@/components/shell/NewRecordButton';
import ServiceHistory from '@/components/views/ServiceHistory';

export default function HistoryPage() {
  return (
    <AppShell headerActions={<NewRecordButton />}>
      <ServiceHistory />
    </AppShell>
  );
}
