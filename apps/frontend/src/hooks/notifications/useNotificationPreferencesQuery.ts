"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationKeys } from "@/lib/query/query-keys";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/services/notifications.service";
import type { UpdateNotificationPreferencesInput } from "@/types/notifications.types";

export function useNotificationPreferencesQuery() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: ({ signal }) => getNotificationPreferences(signal),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateNotificationPreferencesInput) =>
      updateNotificationPreferences(input),
    onSuccess: (preferences) => {
      queryClient.setQueryData(notificationKeys.preferences(), preferences);
    },
  });
}
