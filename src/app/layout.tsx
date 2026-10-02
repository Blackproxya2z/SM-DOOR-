import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { QuoteProvider } from "@/context/QuoteContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0c0a09",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "মেসার্স ফারহান এন্টারপ্রাইজ / এস এম ডোর — প্রিমিয়াম কাঠের দরজা, চেরা কাঠ ও স’মিল",
  description: "বাদে নাভারন, ঝিকরগাছা, যশোরের ঐতিহ্যবাহী মেসার্স ফারহান এন্টারপ্রাইজ ও এস এম ডোর। খাঁটি চিটাগাং সেগুন, সিজনড মেহগনি ও গামারি কাঠের সলিড দরজা, চৌকাঠ ও চেরা কাঠ। লাইভ সিএফটি ক্যালকুলেটর ও কাস্টম ডিজাইন অর্ডার।",
  keywords: [
    "SM Door",
    "এস এম ডোর",
    "Farhan Enterprise",
    "মেসার্স ফারহান এন্টারপ্রাইজ",
    "Wooden Doors Bangladesh",
    "সেগুন কাঠের দরজা",
    "মেহগনি কাঠের দরজা",
    "চৌকাঠ",
    "যশোর স’মিল",
    "CFT Calculator",
    "স’মিল কাঠ"
  ],
  authors: [{ name: "M/S Farhan Enterprise" }],
  openGraph: {
    title: "মেসার্স ফারহান এন্টারপ্রাইজ / এস এম ডোর — Premium Wooden Doors & Sawmill",
    description: "১০০% সিজনড ও কেমিক্যাল ট্রিটেড চিটাগাং সেগুন, মেহগনি ও গামারি কাঠের দরজা ও চৌকাঠ।",
    url: "https://smdoorbd.com",
    siteName: "SM Door",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
        width: 1200,
        height: 630,
        alt: "SM Door Premium Wooden Doors",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD) for LocalBusiness SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "name": "M/S Farhan Enterprise / SM Door (মেসার্স ফারহান এন্টারপ্রাইজ)",
    "description": "Premium Wooden Doors, Sawn Timber & Sawmill Complex in Bade Nabaran, Jhikargachha, Jashore, Bangladesh",
    "url": "https://smdoorbd.com",
    "telephone": "+8801710820987",
    "founder": {
      "@type": "Person",
      "name": "Md. Abdur Rauf Khan",
      "alternateName": "মোঃ আব্দুর রউফ খাঁন",
      "jobTitle": "Proprietor"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bade Nabaran, West Side of Akij Collegiate School",
      "addressLocality": "Jhikargachha",
      "addressRegion": "Jashore",
      "addressCountry": "BD"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.3359,
      "longitude": 91.7538
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    },
    "priceRange": "৳৳"
  };

  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-gold-500 selection:text-wood-950">
        <LanguageProvider>
          <QuoteProvider>
            {children}
          </QuoteProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
