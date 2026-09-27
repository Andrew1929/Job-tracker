"use client"

import { interviewKeys } from "@/lib/query/query-keys";
import { getInterview } from "@/services/interviews.service";

import { useQuery } from "@tanstack/react-query";

export function useInterveiwQuery (id :string) {
    return useQuery({
        queryKey: interviewKeys.detail(id),
        queryFn: ({signal}) => getInterview(id, signal),
        enabled: id.length> 0,
    });
}