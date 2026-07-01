import { JobsHeader } from "@/components/jobs/JobsHeader";
import { JobsList } from "@/components/jobs/JobsList";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <JobsHeader />
      <JobsList />
    </div>
  );
}
