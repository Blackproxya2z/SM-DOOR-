import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy) | SM Door",
  description: "এস এম ডোর গ্রাহকদের তথ্যের সুরক্ষা ও গোপনীয়তা বজায় রাখতে প্রতিশ্রুতিবদ্ধ।",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12] pb-16 md:pb-0 overflow-x-hidden">
      <Header />

      <section className="bg-white text-[#2B1A12] py-14 px-4 text-center border-b border-[#E8DED4]">
        <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-tiro-bangla)] mb-2">
          গোপনীয়তা নীতি (Privacy Policy)
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">
          মেসার্স ফারহান এন্টারপ্রাইজ | সর্বশেষ আপডেট: অক্টোবর ২০২৬
        </p>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 flex-1 text-sm text-[#2B1A12] space-y-6 leading-relaxed font-[family-name:var(--font-hind-siliguri)]">
        <div className="p-8 rounded-3xl bg-white border border-[#E8DED4] shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-2">১. তথ্য সংগ্রহ</h2>
            <p className="text-[#7A6A5F]">
              মেসার্স ফারহান এন্টারপ্রাইজ (M/S Farhan Enterprise) ওয়েবসাইটে কোটেশন ও কাস্টম অর্ডার গ্রহণের জন্য গ্রাহকের নাম, মোবাইল নম্বর, জেলা এবং দরজার পরিমাপ সংগ্রহ করে থাকে। আমরা কোনো অযাচিত তৃতীয় পক্ষের সাথে গ্রাহকের ব্যক্তিগত তথ্য শেয়ার করি না।
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-2">২. তথ্যের ব্যবহার</h2>
            <p className="text-[#7A6A5F]">
              সংগৃহীত তথ্য কেবল পণ্যের কোটেশন তৈরি, ফোনে যোগাযোগ, হোয়াটসঅ্যাপ মেসেজ আদান-প্রদান এবং অর্ডারকৃত পণ্য সঠিক ঠিকানায় ডেলিভারির জন্য ব্যবহার করা হয়।
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-2">৩. আপলোডকৃত ছবি ও ডিজাইন</h2>
            <p className="text-[#7A6A5F]">
              কাস্টম অর্ডার ফর্মে গ্রাহকের আপলোডকৃত ছবি কেবল সেই নির্দিষ্ট গ্রাহকের দরজার ডিজাইন মূল্যায়নের জন্য সংরক্ষিত থাকে। গ্রাহকের সম্মতি ছাড়া এই ছবিগুলো বাণিজ্যিক উদ্দেশ্যে প্রকাশ করা হয় না।
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-2">৪. যোগাযোগ</h2>
            <p className="text-[#7A6A5F]">
              যেকোনো গোপনীয়তা সংক্রান্ত প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করতে পারেন: info@smdoorbd.com অথবা ফোন করুন: +880 1710-820987।
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BottomNav />
      <FloatingActions />
    </main>
  );
}
