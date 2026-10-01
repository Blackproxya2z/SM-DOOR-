import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { SawmillShowcase } from "@/components/SawmillShowcase";
import type { Metadata } from "next";
import { Factory, ShieldCheck, Cpu, Flame, Droplets, CheckCircle, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "আমাদের স’মিল কমপ্লেক্স ও আধুনিক কারখানা | SM Door",
  description: "ভারী ব্যান্ড-স লোগ কাটিং, ১২-১৪% কিম্বন ড্রাইং সিজনিং চেম্বার, কেমিক্যাল ট্রিটমেন্ট ও থ্রি-ডি সিএনসি খোদাই ফ্যাক্টরি ট্যুর।",
};

export const revalidate = 0;

export default function FactoryPage() {
  const sawmillServices = db.getSawmillServices();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801819345678";
  const phone = siteSettings.phone1 || "+8801819345678";

  const processSteps = [
    {
      num: "০১",
      title: "গোল কাঠের গুঁড়ি নির্বাচন (Log Selection)",
      desc: "চট্টগ্রাম পার্বত্য অঞ্চল ও রাঙ্গামাটি থেকে সেরা গ্রেডের সেগুন, মেহগনি ও গামারি গোল কাঠের গুঁড়ি সরাসরি পর্যবেক্ষণ করে সংগ্রহ করা হয়।",
      icon: Factory,
    },
    {
      num: "০২",
      title: "হাই-স্পিড স’মিল কাটিং (Sawmill Slicing)",
      desc: "ভারী স্বয়ংক্রিয় ব্যান্ড-স ব্লেডের মাধ্যমে কাঠের প্রতিটি তক্তা ও বাটাম নিখুঁত ও সমান্তরাল মাপে চেরা হয়।",
      icon: Cpu,
    },
    {
      num: "০৩",
      title: "ভ্যাকুয়াম কেমিক্যাল ট্রিটমেন্ট (Chemical Treatment)",
      desc: "চাপ প্রয়োগ করে কাঠের রন্ধ্রে রন্ধ্রে উইপোকা ও ঘুণপোকা প্রতিরোধী পরিবেশবান্ধব বোরন-ফসফেট কেমিক্যাল প্রবেশ করানো হয়।",
      icon: Droplets,
    },
    {
      num: "০৪",
      title: "ফার্নেস কিম্বন সিজনিং (Kiln Drying)",
      desc: "১৮ থেকে ২৫ দিন নিয়ন্ত্রিত তাপমাত্রায় কাঠের স্বাভাবিক আর্দ্রতা ১২% - ১৪% এ নামিয়ে আনা হয়, যাতে কাঠ কখনো বাঁকা না হয়।",
      icon: Flame,
    },
    {
      num: "০৫",
      title: "কম্পিউটারাইজড ৩ডি সিএনসি খোদাই (3D CNC Carving)",
      desc: "ডিজিটাল সফটওয়্যারের নির্দেশনায় মাইক্রন-লেভেল নিখুঁত খোদাই এবং রাজকীয় নকশা ফুটিয়ে তোলা হয়।",
      icon: Cpu,
    },
    {
      num: "০৬",
      title: "হস্তশিল্প ফিনিশিং ও পলিশ (Artisan Finishing)",
      desc: "অভিজ্ঞ কারিগরদের হাতে স্যান্ডিং, পুটিং এবং গ্রাহকের পছন্দমত ম্যাট ল্যাকার বা হাই-গ্লস পিউ পলিশ প্রয়োগ।",
      icon: Award,
    },
    {
      num: "০৭",
      title: "কোয়ালিটি চেক ও প্যাকেজিং (Quality Control)",
      desc: "আর্দ্রতা মিটার দ্বারা ফাইনাল চেকিং এবং সুরক্ষামূলক ফোম ও প্লাস্টিক র‍্যাপার প্যাকেজিং করে ডেলিভারি।",
      icon: CheckCircle,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
            <Factory className="w-3.5 h-3.5" />
            ফ্যাক্টরি ও কারখানা
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif mb-4">
            এস এম ডোর স’মিল কমপ্লেক্স ও সিজনিং প্ল্যান্ট
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-wood-300">
            কাঠের কাঁচা গুঁড়ি থেকে শুরু করে আধুনিক ফার্নেস সিজনিং ও ডিজিটাল ৩ডি সিএনসি খোদাই — প্রতিটি ধাপ আমাদের নিজস্ব তত্ত্বাবধানে।
          </p>
        </div>
      </section>

      {/* 7-Step Manufacturing Process */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-wood-950 dark:text-white font-serif mb-3">
            ৭-ধাপের বৈজ্ঞানিক প্রস্তুত প্রণালী
          </h2>
          <p className="text-xs sm:text-sm text-wood-600 dark:text-wood-400">
            কেন আমাদের কাঠের দরজা ৫০ বছর পর্যন্ত অটুট থাকে তার পেছনের প্রযুক্তিগত ধাপসমূহ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-gold-600 dark:text-gold-400 font-mono">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-wood-950 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-wood-600 dark:text-wood-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Embedded Showcase Component */}
      <SawmillShowcase services={sawmillServices} />

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
