import type { Metadata } from "next";

import "../_app/globals.css";

export const metadata: Metadata = {
  title: "Dog Fetcher",
  description: "Search for the perfect dog to adopt!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
