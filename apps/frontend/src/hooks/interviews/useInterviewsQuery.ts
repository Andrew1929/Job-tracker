"use client"

import { interviewKeys } from "@/lib/query/query-keys";
import { getInterviews } from "@/services/interviews.service";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { InterviewsQueryParams } from "@/types/interviews.types";

export function useInterviewsQuery (params: InterviewsQueryParams) {
    return useQuery ({
        queryKey: interviewKeys.list(params),
        queryFn: ({signal}) => getInterviews(params, signal),
        placeholderData: keepPreviousData,
    });
}