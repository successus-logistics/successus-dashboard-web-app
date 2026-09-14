import { MetricCards } from "./_components/metric-cards";
import { PerformanceOverview } from "./_components/performance-overview";
import { SubscriberOverview } from "./_components/subscriber-overview";

export default function Page() {
  // 1. Create a table for general upcoming event/deadlines etc.
  // 2. Deadlines should be
  //    a. documents(driving licence, passports, dbs, etc.)
  //    b. driver and vehicle insurance
  // 3. metric cards should contain both the above
  // 4. expiring soons
  // 5. onboarding
  // 6. approvals needed
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <MetricCards />
      <PerformanceOverview />
      <SubscriberOverview />
    </div>
  );
}
