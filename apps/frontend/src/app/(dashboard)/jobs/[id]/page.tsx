import { notFound } from "next/navigation";

import { JobDetailsContent } from "@/components/job-details/JobDetailsContent";
import { findMockJobDetails } from "@/constants/jobs.constants";

type JobDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const job = findMockJobDetails(id);

  if (!job) {
    notFound();
  }

  return <JobDetailsContent job={job} />;
}
