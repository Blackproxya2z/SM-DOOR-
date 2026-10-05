import type { Metadata, Viewport } from "next";
import { Tiro_Bangla, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { QuoteProvider } from "@/context/QuoteContext";
import { RealtimeSyncProvider } from "@/context/RealtimeSyncContext";
import { getSiteUrl } from "@/lib/site";

const tiroBangla = Tiro_Bangla({
  subsets: ["bengali"],
  weight: ["400"],
  display: "swap",
  variable: "--font-tiro-bangla",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#FAF8F5",
  viewportFit: "cover",
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    title: "মেসার্স ফারহান এন্টারপ্রাইজ / এস এম ডোর — খাঁটি কাঠ ও স’মিল কমপ্লেক্স",
    description: "যশোরের ঝিকরগাছায় নিজস্ব স’মিল ও সিজনিং প্ল্যান্ট। ১০০% সিজনড ও কেমিক্যাল ট্রিটেড চিটাগাং সেগুন, মেহগনি ও গামারি কাঠের দরজা ও চৌকাঠ।",
    url: siteUrl,
    siteName: "মেসার্স ফারহান এন্টারপ্রাইজ",
    images: [
      {
        url: "/images/hero/hero-farhan-signboard.webp",
        width: 1200,
        height: 630,
        alt: "মেসার্স ফারহান এন্টারপ্রাইজ অফিস ও কারখানা সাইনবোর্ড",
      },
      {
        url: "/images/hero/hero-sawmill-yard.webp",
        width: 1200,
        height: 630,
        alt: "মেসার্স ফারহান এন্টারপ্রাইজ সুবিশাল স’মিল ইয়ার্ড",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "মেসার্স ফারহান এন্টারপ্রাইজ / এস এম ডোর",
    description: "খাঁটি কাঠ, স’মিল কমপ্লেক্স ও আধুনিক দরজার কারখানা — যশোর, বাংলাদেশ।",
    images: ["/images/hero/hero-farhan-signboard.webp"],
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
    "url": siteUrl,
    "telephone": "+8801710820987",
    "founder": {
      "@type": "Person",
      "name": "Md. Abdus Salam Khan",
      "alternateName": "মোঃ আব্দুছ ছালাম খাঁন",
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
    <html lang="bn" className={`scroll-smooth ${tiroBangla.variable} ${hindSiliguri.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-[#FAF8F5] text-[#2B1A12] selection:bg-[#C59B27]/20 selection:text-[#2B1A12]">
        <LanguageProvider>
          <QuoteProvider>
            <RealtimeSyncProvider>
              {children}
            </RealtimeSyncProvider>
          </QuoteProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
