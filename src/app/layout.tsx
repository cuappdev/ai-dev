import Providers from "./Providers";
import type { Metadata } from "next";
import "@/globals.css";

export const metadata: Metadata = {
  title: "AI Dev",
  description: "Cornell AppDev's internal AI tool and platform enabling AI features and interactions with a finetuned organizational model.",
  authors: [{name: "Aayush Agnihotri", url: "https://www.cornellappdev.com/"}],
  keywords: ["Cornell AppDev", "AI Dev", "AI", "Machine Learning", "Deep Learning", "Artificial Intelligence"],
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
