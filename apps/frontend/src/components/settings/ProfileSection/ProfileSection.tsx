"use client";

import { useState } from "react";

import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_PROFILE } from "@/constants/settings.constants";

import type { ProfileFormData } from "@/types/settings.types";

type ProfileSectionProps = {
  standalone?: boolean;
};

export function ProfileSection({ standalone = false }: ProfileSectionProps) {
  const [form, setForm] = useState<ProfileFormData>(DEFAULT_PROFILE);

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <section
      {...(standalone
        ? {}
        : {
            role: "tabpanel" as const,
            id: "settings-panel-profile",
            "aria-labelledby": "settings-tab-profile",
          })}
      className="space-y-8"
    >
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Profile Information
      </h2>

      <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <Avatar
            alt={form.fullName}
            fallback={form.fullName
              .split(" ")
              .map((part) => part[0])
              .join("")}
            size="lg"
          />
          <Button variant="outline" type="button" className="h-9 px-4">
            Change Photo
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
            />
          </div>
        </div>
      </div>

      <Button type="button">Save Changes</Button>
    </section>
  );
}
