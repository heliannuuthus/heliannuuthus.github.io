import GlassFooter from "@/components/layout/GlassFooter";
import GlassNavbar from "@/components/layout/GlassNavbar";
import SettingsWidget from "@/components/SettingsWidget";

export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <GlassNavbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <GlassFooter />
      <SettingsWidget />
    </div>
  );
}
