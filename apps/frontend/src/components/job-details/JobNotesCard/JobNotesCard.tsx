import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type JobNotesCardProps = {
  notes: readonly string[];
};

export function JobNotesCard({ notes }: JobNotesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {notes.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
            {notes.map((note, index) => (
              <li key={index} className="text-sm text-foreground">
                {note}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
