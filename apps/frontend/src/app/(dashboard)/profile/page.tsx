import { ProfileSection } from "@/components/settings/ProfileSection";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Profile
      </h1>
      <ProfileSection standalone />
    </div>
  );
}
