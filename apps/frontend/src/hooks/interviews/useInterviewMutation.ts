import { interviewKeys } from "@/lib/query/query-keys";
import { createInterview, updateInterview, deleteInterview } from "@/services/interviews.service";
import { CreateInterviewInput, PaginatedInterviews, UpdateInterviewInput } from "@/types/interviews.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateInterview () {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: (input : CreateInterviewInput) => createInterview(input),
        onSuccess: (interview) => {
            queryClient.setQueryData(interviewKeys.detail(interview.id), interview);
            void queryClient.invalidateQueries({queryKey: interviewKeys.lists() });
        }    
    });
}

export function useUpdateInterview () {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: ({id, input} : {id: string, input : UpdateInterviewInput}) => updateInterview(id, input),
        onSuccess: (interview) => {
            queryClient.setQueryData(interviewKeys.detail(interview.id), interview);
            void queryClient.invalidateQueries({queryKey: interviewKeys.lists() });
        }    
    });
}

type InterviewListsSnapshot = [readonly unknown[], PaginatedInterviews | undefined][];

type DeleteContex = {
    previousLists : InterviewListsSnapshot;
}

export function useDeleteInterview () {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: (id : string) => deleteInterview(id),
        onMutate: async (id) : Promise<DeleteContex> => {
            await queryClient.cancelQueries({ queryKey : interviewKeys.lists() });

            const previousLists = queryClient.getQueriesData<PaginatedInterviews> ({ queryKey: interviewKeys.lists() });

            for (const [key, data] of previousLists) {
                if (!data) {
                    continue
                }

                queryClient.setQueryData<PaginatedInterviews> (key, {
                    ...data,
                    items: data.items.filter((interview) => interview.id !== id),
                    meta : {...data.meta, total: Math.max(0, data.meta.total - 1) },
                });
            }

            return {previousLists};
        },
        onError: (_error, _id, context) => {
            context?.previousLists.forEach(([key, data]) => {
            queryClient.setQueryData(key, data);
            });
        },
        onSettled: (_data, _error, id) => {
            queryClient.removeQueries({ queryKey: interviewKeys.detail(id) });
            void queryClient.invalidateQueries({ queryKey: interviewKeys.lists() });
        },
    });
}