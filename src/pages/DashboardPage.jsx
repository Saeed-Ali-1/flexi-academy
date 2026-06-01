import LiveRoomUtilities from '../components/dashboard/LiveRoomUtilities.jsx';
import ProfileHub from '../components/dashboard/ProfileHub.jsx';
import NextUpCards from '../components/dashboard/NextUpCards.jsx';
import UpcomingEvents from '../components/library/UpcomingEvents.jsx';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="flex flex-col gap-6">
        <LiveRoomUtilities />
        <ProfileHub />
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <NextUpCards />
          </div>
          <aside className="xl:sticky xl:top-24 xl:self-start">
            <UpcomingEvents />
          </aside>
        </div>
      </div>
    </div>
  );
}
