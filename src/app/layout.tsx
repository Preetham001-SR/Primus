import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_ORIGIN || "https://www.primuslife.in"),
  title: "Primus Olympia Bangalore | Senior Living & Multigenerational Community",
  description:
    "Experience Ageing Right at Primus Olympia on Kanakapura Road, Bangalore. Schedule a complimentary guided site visit with optional doorstep chauffeur pickup and trial dining.",
  keywords: [
    "Primus Life",
    "Primus Olympia",
    "Senior Living Bangalore",
    "Luxury Retirement Homes Bangalore",
    "Elder Friendly Apartments Kanakapura Road",
    "Primus Senior Living"
  ],
  openGraph: {
    title: "Primus Olympia Bangalore | Experience Ageing Right",
    description:
      "What good is living long if you don't live well? Discover Primus Olympia's luxury elder-friendly residences with 24x7 healthcare and 5-star hospitality.",
    url: "https://www.primuslife.in/bangalore/olympia/",
    siteName: "Primus Senior Living",
    images: [
      {
        url: "/images/primus_olympia_hero.jpg",
        width: 1200,
        height: 675,
        alt: "Primus Olympia Luxury Senior Community in Bangalore"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  icons: {
    icon: "https://www.primuslife.in/wp-content/uploads/2026/02/favicon.webp"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
