import { Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { JobAttachment } from "@/types/jobs.types";

type JobAttachmentsCardProps = {
  attachments: readonly JobAttachment[];
};

export function JobAttachmentsCard({ attachments }: JobAttachmentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-4">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <FileText
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate text-sm text-foreground">
                {attachment.name}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground"
              aria-label={`Download ${attachment.name}`}
            >
              <Download />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
