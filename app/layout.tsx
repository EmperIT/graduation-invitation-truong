import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Great_Vibes, Baloo_2, Patrick_Hand, Dancing_Script, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const greatVibes = Great_Vibes({
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  variable: "--font-great-vibes",
});

const bubbleCute = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bubble-cute",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  variable: "--font-patrick-hand",
});

const dancingScript = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-dancing-script",
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Thư mời dự lễ tốt nghiệp",
  description: "Trân trọng kính mời bạn đến dự lễ tốt nghiệp của mình",
  icons: {
    icon: [
      { url: "/graduation-cap-icon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/graduation-cap-icon.png",
    apple: "/graduation-cap-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${cormorant.variable} ${greatVibes.variable} ${bubbleCute.variable} ${patrickHand.variable} ${dancingScript.variable} ${montserrat.variable}`}
    >
      <body className="font-sans antialiased text-foreground bg-background app-full-height">
        {children}
      </body>
    </html>
  );
}