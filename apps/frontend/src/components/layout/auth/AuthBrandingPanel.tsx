import { APP_NAME, APP_TAGLINE } from "@/constants/auth.constants";

export function AuthIllustration() {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-sm"
      role="img"
      aria-label="Person working at a desk with a laptop"
    >
      <rect x="40" y="200" width="320" height="8" rx="4" fill="#E2E8F0" />
      <rect x="120" y="208" width="24" height="80" rx="4" fill="#CBD5E1" />
      <rect x="256" y="208" width="24" height="80" rx="4" fill="#CBD5E1" />
      <rect x="100" y="160" width="200" height="48" rx="6" fill="#F1F5F9" />
      <rect x="108" y="168" width="184" height="32" rx="4" fill="#E2E8F0" />
      <rect x="160" y="120" width="80" height="40" rx="8" fill="#7C3AED" opacity="0.15" />
      <rect x="168" y="128" width="64" height="24" rx="4" fill="#7C3AED" opacity="0.3" />
      <circle cx="200" cy="80" r="28" fill="#DDD6FE" />
      <circle cx="200" cy="72" r="20" fill="#C4B5FD" />
      <rect x="176" y="108" width="48" height="56" rx="24" fill="#A78BFA" />
      <rect x="168" y="148" width="20" height="40" rx="10" fill="#A78BFA" />
      <rect x="212" y="148" width="20" height="40" rx="10" fill="#A78BFA" />
      <rect x="60" y="60" width="48" height="48" rx="12" fill="#EDE9FE" />
      <rect x="72" y="72" width="24" height="4" rx="2" fill="#A78BFA" />
      <rect x="72" y="82" width="16" height="4" rx="2" fill="#C4B5FD" />
      <rect x="292" y="80" width="56" height="56" rx="12" fill="#EDE9FE" />
      <circle cx="320" cy="100" r="12" fill="#7C3AED" opacity="0.4" />
      <rect x="308" y="116" width="24" height="4" rx="2" fill="#A78BFA" />
      <rect x="80" y="240" width="240" height="4" rx="2" fill="#E2E8F0" />
      <rect x="120" y="248" width="160" height="4" rx="2" fill="#E2E8F0" />
    </svg>
  );
}

export function AuthBrandingPanel() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <AuthIllustration />
      <div className="mt-10 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
          {APP_NAME}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {APP_TAGLINE.line1}
          <br />
          {APP_TAGLINE.line2}
        </p>
      </div>
    </div>
  );
}
