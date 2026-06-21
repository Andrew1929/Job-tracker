import { AuthBrandingPanel } from "./AuthBrandingPanel";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside
        className="hidden flex-1 items-center justify-center bg-muted/40 px-8 py-12 lg:flex lg:px-16"
        aria-hidden="false"
      >
        <div className="max-w-md">
          <AuthBrandingPanel />
        </div>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="mb-8 w-full max-w-md lg:hidden">
          <AuthBrandingPanel />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
