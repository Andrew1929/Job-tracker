import { InterviewsSummaryCounts } from "@/components/interviews/InterviewsSummary";
import type { Interview } from "@/types/interviews.types";

export function calculateInterviewSummary ( interviewsData : Interview[]) : InterviewsSummaryCounts {
    const timeNow = new Date(Date.now()).getTime();

    const upcoming = interviewsData.filter((interview) => new Date(interview.scheduledAt).getTime() > timeNow && interview.status === "SCHEDULED" ).length;
    const thisWeek = interviewsData.filter((interview) => 
        timeNow  < new Date(interview.scheduledAt).getTime() && 
        new Date(interview.scheduledAt).getTime()  < timeNow + (86400000 * 7) &&
        interview.status === "SCHEDULED" ).length;
    const completed = interviewsData.filter((interview) => interview.status === "COMPLETED").length;
    const awaitingResult = interviewsData.filter((interview) => interview.status === "COMPLETED" && interview.result === "PENDING" ).length;

    return ({
        upcoming : upcoming, 
        thisWeek : thisWeek, 
        completed: completed, 
        awaitingResult: awaitingResult
    });
};