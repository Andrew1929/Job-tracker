import { JobDetailsContent } from "@/components/job-details/JobDetailsContent";

type JobDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;

  return <JobDetailsContent jobId={id} />;
}
