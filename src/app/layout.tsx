import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Augusta Lights Texas | Generative AI Lighting Visualization Engine",
  description:
    "Mobile-first in-car architectural lighting visualization platform for Augusta Lights franchise operations. Two-stage photorealistic C9 and Omni permanent lighting rendering.",
  keywords: [
    "Augusta Lights",
    "Christmas Lighting Visualization",
    "Omni Permanent Lighting",
    "Texas Architectural Lighting",
    "Generative AI In-Home Consultation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased transition-colors font-sans selection:bg-amber-500 selection:text-slate-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          {children}

          {/* Traffic Tracking Pixel */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://demo-traffic.vercel.app/api/px?p=augusta-lights-ai"
            alt=""
            width="1"
            height="1"
            style={{ display: "none" }}
            aria-hidden="true"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
