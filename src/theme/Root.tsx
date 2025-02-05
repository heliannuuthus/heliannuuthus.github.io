import ThemeProvider from "../components/ThemeProvider";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
}
