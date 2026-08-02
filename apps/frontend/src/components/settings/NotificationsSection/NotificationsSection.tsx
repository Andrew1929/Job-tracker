"use client";

import { useState } from "react";

import { ErrorState } from "@/components/shared/ErrorState";
import { SelectField } from "@/components/shared/SelectField";
import { Skeleton } from "@/components/shared/Skeleton";
import { Switch } from "@/components/shared/Switch";
import { Button } from "@/components/ui/button";
import { NOTIFICATION_TIMEZONE_OPTIONS } from "@/constants/notifications.constants";
import {
  useNotificationPreferencesQuery,
  useUpdateNotificationPreferences,
} from "@/hooks/notifications";
import { getApiErrorMessage } from "@/lib/api/error-message";
import type { NotificationPreferences } from "@/types/notifications.types";

type PreferenceToggleConfig = {
  key: keyof Pick<
    NotificationPreferences,
    | "nextActionRemindersEnabled"
    | "interviewRemindersEnabled"
    | "interviewFollowUpsEnabled"
    | "staleApplicationRemindersEnabled"
  >;
  id: string;
  label: string;
  description: string;
};

const TOGGLES: PreferenceToggleConfig[] = [
  {
    key: "nextActionRemindersEnabled",
    id: "next-action-reminders",
    label: "Next-action reminders",
    description:
      "Remind you before a scheduled next action on a job application.",
  },
  {
    key: "interviewRemindersEnabled",
    id: "interview-reminders",
    label: "Interview reminders",
    description: "Remind you 24 hours and 2 hours before an upcoming interview.",
  },
  {
    key: "interviewFollowUpsEnabled",
    id: "interview-follow-ups",
    label: "Interview follow-ups",
    description:
      "Prompt you to add notes and feedback after a completed interview.",
  },
  {
    key: "staleApplicationRemindersEnabled",
    id: "stale-application-reminders",
    label: "Stale application reminders",
    description:
      "Notify you when an applied job has had no meaningful activity for a week.",
  },
];

type FormState = {
  nextActionRemindersEnabled: boolean;
  interviewRemindersEnabled: boolean;
  interviewFollowUpsEnabled: boolean;
  staleApplicationRemindersEnabled: boolean;
  timezone: string;
};

function toFormState(preferences: NotificationPreferences): FormState {
  return {
    nextActionRemindersEnabled: preferences.nextActionRemindersEnabled,
    interviewRemindersEnabled: preferences.interviewRemindersEnabled,
    interviewFollowUpsEnabled: preferences.interviewFollowUpsEnabled,
    staleApplicationRemindersEnabled:
      preferences.staleApplicationRemindersEnabled,
    timezone: preferences.timezone,
  };
}

export function NotificationsSection() {
  const query = useNotificationPreferencesQuery();
  const updateMutation = useUpdateNotificationPreferences();
  const [draft, setDraft] = useState<FormState | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = draft ?? (query.data ? toFormState(query.data) : null);

  const updateForm = (patch: Partial<FormState>) => {
    setDraft((current) => {
      const base = current ?? (query.data ? toFormState(query.data) : null);
      return base ? { ...base, ...patch } : current;
    });
  };

  const handleSave = () => {
    if (!form) {
      return;
    }

    setSaveError(null);
    updateMutation.mutate(form, {
      onSuccess: () => {
        setDraft(null);
      },
      onError: (error) => {
        setSaveError(getApiErrorMessage(error));
      },
    });
  };

  if (query.isLoading) {
    return (
      <section
        role="tabpanel"
        id="settings-panel-notifications"
        aria-labelledby="settings-tab-notifications"
        className="space-y-4"
        aria-busy="true"
      >
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Notifications
        </h2>
        <Skeleton className="h-40 rounded-lg" />
      </section>
    );
  }

  if (query.isError || !form) {
    return (
      <section
        role="tabpanel"
        id="settings-panel-notifications"
        aria-labelledby="settings-tab-notifications"
      >
        <ErrorState
          message={getApiErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
          isRetrying={query.isFetching}
        />
      </section>
    );
  }

  return (
    <section
      role="tabpanel"
      id="settings-panel-notifications"
      aria-labelledby="settings-tab-notifications"
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Notifications
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose which in-app reminders you receive and the timezone used for
          delivery windows.
        </p>
      </div>

      <div className="space-y-4">
        {TOGGLES.map((toggle) => (
          <div
            key={toggle.id}
            className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
          >
            <div className="space-y-1">
              <label
                htmlFor={toggle.id}
                className="text-sm font-medium text-foreground"
              >
                {toggle.label}
              </label>
              <p className="text-xs text-muted-foreground">
                {toggle.description}
              </p>
            </div>
            <Switch
              id={toggle.id}
              label={toggle.label}
              checked={form[toggle.key]}
              onCheckedChange={(enabled) =>
                updateForm({ [toggle.key]: enabled })
              }
            />
          </div>
        ))}
      </div>

      <SelectField
        id="notification-timezone"
        label="Timezone"
        value={form.timezone}
        options={NOTIFICATION_TIMEZONE_OPTIONS}
        onChange={(timezone) => updateForm({ timezone })}
      />

      {saveError ? (
        <p className="text-sm text-destructive" role="alert">
          {saveError}
        </p>
      ) : null}

      {updateMutation.isSuccess && !updateMutation.isPending && !draft ? (
        <p className="text-sm text-muted-foreground" role="status">
          Preferences saved.
        </p>
      ) : null}

      <Button
        type="button"
        onClick={handleSave}
        disabled={updateMutation.isPending}
        aria-busy={updateMutation.isPending}
      >
        {updateMutation.isPending ? "Saving…" : "Save notification preferences"}
      </Button>
    </section>
  );
}
