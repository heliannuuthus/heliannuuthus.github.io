import "@ant-design/v5-patch-for-react-19";

import ThemeProvider from "@site/src/components/ThemeProvider";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
}
