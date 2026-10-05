import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলী (Terms & Conditions) | SM Door",
  description: "এস এম ডোর-এর কাঠের পণ্য অর্ডার, ওয়ারেন্টি ও ডেলিভারি সংক্রান্ত নিয়ম ও শর্তাবলী।",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12] pb-16 md:pb-0 overflow-x-hidden">
      <Header />

      <section className="bg-white text-[#2B1A12] py-14 px-4 text-center border-b border-[#E8DED4]">
        <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-tiro-bangla)] mb-2">
          ব্যবহারের শর্তাবলী (Terms & Conditions)
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">
          মেসার্স ফারহান এন্টারপ্রাইজ | অফিসিয়াল বিক্রয় ও গ্যারান্টি নীতি
        </p>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 flex-1 text-sm text-[#2B1A12] space-y-6 leading-relaxed font-[family-name:var(--font-hind-siliguri)]">
        <div className="p-8 rounded-3xl bg-white border border-[#E8DED4] shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-2">১. অর্ডার ও মূল্য নির্ধারণ</h2>
            <p className="text-[#7A6A5F]">
              ওয়েবসাইটে প্রদর্শিত দরজার মূল্য ও কাঠের রেট তাৎক্ষণিক আনুমানিক দর। বিশেষ পরিমাপ, কাটিং ও ল্যাকার/পিউ পলিশের পার্থক্যের কারণে চূড়ান্ত কোটেশনে সামান্য পরিবর্তন হতে পারে যা অর্ডারের পূর্বে গ্রাহককে জানানো হবে।
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-2">২. সিজনিং ও ওয়ারেন্টি নীতি</h2>
            <p className="text-[#7A6A5F]">
              আমাদের সকল সলিড কাঠ নিজস্ব স্টিম ফার্নেস কিম্বন সিজনিং চেম্বারে শুকানো হয়। সেগুন ও মেহগনি কাঠের ক্ষেত্রে ঘুণপোকা আক্রমণ বা কাঠ অস্বাভাবিক বাঁকা হওয়ার বিরুদ্ধে ১০ বছরের অফিসিয়াল রিপ্লেসমেন্ট প্রযোজ্য। তবে অসাবধানতাবশত পানিতে নিমজ্জিত রাখা বা আগুনে ক্ষতিগ্রস্ত হওয়া ওয়ারেন্টির আওতাভুক্ত নয়।
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-2">৩. ডেলিভারি ও পরিবহন</h2>
            <p className="text-[#7A6A5F]">
              যশোর ও খুলনা অঞ্চল ছাড়াও সারাদেশের যেকোনো জেলায় কুরিয়ার বা পিকআপ ভ্যানে ডেলিভারি দেওয়া হয়। ডেলিভারি চলাকালীন পণ্য অক্ষত রাখার জন্য সর্বোচ্চ ফোম ও প্লাস্টিক প্যাকেজিং নিশ্চিত করা হয়।
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-2">৪. পেমেন্ট শর্ত</h2>
            <p className="text-[#7A6A5F]">
              কাস্টম অর্ডার কনফার্মেশনের জন্য মোট মূল্যের নির্ধারিত অংশ অ্যাডভান্স এবং অবশিষ্ট অর্থ ডেলিভারির সময় বা ট্রান্সপোর্টে বুকিংয়ের পূর্বে পরিশোধযোগ্য।
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
