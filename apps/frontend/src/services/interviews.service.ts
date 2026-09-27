import { INTERVIEWS_API_PATHS } from "@/constants/interviews.constants";
import { apiRequest } from "@/lib/api/api-client";
import type {
    CreateInterviewInput, 
    Interview, 
    InterviewsQueryParams, 
    PaginatedInterviews, 
    UpdateInterviewInput 
} from "@/types/interviews.types";

export function getInterviews(
    params: InterviewsQueryParams,
    signal?: AbortSignal
) : Promise<PaginatedInterviews> {
    return apiRequest<PaginatedInterviews>(INTERVIEWS_API_PATHS.list, {
        query: {
            page: params.page,
            limit: params.limit,
            jobId: params.jobId,
            status: params.status,
            sortOrder: params.sortOrder,
        }, signal,
    });
}

export function getInterview(id: string, signal?: AbortSignal) :Promise<Interview> {
    return apiRequest<Interview>(INTERVIEWS_API_PATHS.byId(id), {signal} )
}

export function createInterview(input: CreateInterviewInput) : Promise<Interview> {
    return apiRequest<Interview>(INTERVIEWS_API_PATHS.list , {
        method: "POST",
        body: input
    });
}

export function updateInterview(id: string ,input: UpdateInterviewInput): Promise<Interview> {
    return apiRequest<Interview>(INTERVIEWS_API_PATHS.byId(id) , {
        method: "PATCH",
        body: input
    });
}

export function deleteInterview(id: string): Promise<void> {
    return apiRequest<void>(INTERVIEWS_API_PATHS.byId(id), {
        method: "DELETE"
    });
}