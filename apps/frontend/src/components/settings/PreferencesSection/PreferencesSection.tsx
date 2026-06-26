"use client";

import { useState } from "react";

import { SelectField } from "@/components/shared/SelectField";
import { Switch } from "@/components/shared/Switch";
import { Button } from "@/components/ui/button";
import {
  DATE_FORMAT_OPTIONS,
  DEFAULT_PREFERENCE_TOGGLES,
  DEFAULT_VIEW_OPTIONS,
  JOBS_PER_PAGE_OPTIONS,
  TIME_FORMAT_OPTIONS,
  TIMEZONE_OPTIONS,
} from "@/constants/settings.constants";

import type { PreferenceToggle } from "@/types/settings.types";

export function PreferencesSection() {
  const [defaultView, setDefaultView] = useState(DEFAULT_VIEW_OPTIONS[0].value);
  const [jobsPerPage, setJobsPerPage] = useState(JOBS_PER_PAGE_OPTIONS[0].value);
  const [dateFormat, setDateFormat] = useState(DATE_FORMAT_OPTIONS[0].value);
  const [timeFormat, setTimeFormat] = useState(TIME_FORMAT_OPTIONS[0].value);
  const [timezone, setTimezone] = useState(TIMEZONE_OPTIONS[0].value);
  const [toggles, setToggles] = useState<PreferenceToggle[]>(
    DEFAULT_PREFERENCE_TOGGLES,
  );

  const handleToggleChange = (id: string, enabled: boolean) => {
    setToggles((current) =>
      current.map((toggle) =>
        toggle.id === id ? { ...toggle, enabled } : toggle,
      ),
    );
  };

  return (
    <section
      role="tabpanel"
      id="settings-panel-preferences"
      aria-labelledby="settings-tab-preferences"
      className="space-y-8"
    >
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Preferences
      </h2>

      <div className="grid gap-10 xl:grid-cols-2">
        <div className="space-y-5">
          <SelectField
            id="defaultView"
            label="Default View"
            value={defaultView}
            options={DEFAULT_VIEW_OPTIONS}
            onChange={setDefaultView}
          />
          <SelectField
            id="jobsPerPage"
            label="Jobs per page"
            value={jobsPerPage}
            options={JOBS_PER_PAGE_OPTIONS}
            onChange={setJobsPerPage}
          />
          <SelectField
            id="dateFormat"
            label="Date Format"
            value={dateFormat}
            options={DATE_FORMAT_OPTIONS}
            onChange={setDateFormat}
          />
          <SelectField
            id="timeFormat"
            label="Time Format"
            value={timeFormat}
            options={TIME_FORMAT_OPTIONS}
            onChange={setTimeFormat}
          />
          <SelectField
            id="timezone"
            label="Timezone"
            value={timezone}
            options={TIMEZONE_OPTIONS}
            onChange={setTimezone}
          />
        </div>

        <div className="space-y-5">
          {toggles.map((toggle) => (
            <div
              key={toggle.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
            >
              <label
                htmlFor={toggle.id}
                className="text-sm font-medium text-foreground"
              >
                {toggle.label}
              </label>
              <Switch
                id={toggle.id}
                label={toggle.label}
                checked={toggle.enabled}
                onCheckedChange={(enabled) =>
                  handleToggleChange(toggle.id, enabled)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Button type="button">Save Preferences</Button>
    </section>
  );
}
