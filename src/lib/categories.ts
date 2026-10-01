export interface CategoryInfo {
  slug: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  image: string;
  countKey: string;
  badgeBn?: string;
  badgeEn?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'wood',
    nameBn: 'কাঠ / লগ ও সাইজ কাঠ',
    nameEn: 'Wood / Logs & Sized Wood',
    descriptionBn: 'সরাসরি নিজস্ব স’মিল থেকে সংগৃহীত গোল গুঁড়ি (লগ), সঠিক মাপে চেরা তক্তা, বাটাম ও প্রিমিয়াম সাইজ কাঠ।',
    descriptionEn: 'Round logs, sawn timber, planks, and sized wood processed directly from our facility.',
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=900&auto=format&fit=crop&q=80',
    countKey: 'wood',
    badgeBn: '১০০% পাকা কাঠ',
    badgeEn: '100% Mature Timber'
  },
  {
    slug: 'door',
    nameBn: 'দরজা',
    nameEn: 'Door',
    descriptionBn: 'চিটাগাং সেগুন, গামারি ও সিজনড মেহগনি কাঠে তৈরি শৈল্পিক খোদাইকৃত ও আধুনিক ৩ডি সলিড কাঠের দরজা।',
    descriptionEn: 'Artistic hand-carved and 3D CNC solid wooden doors in Teak, Gamari, and Seasoned Mahogany.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80',
    countKey: 'door',
    badgeBn: 'ট্রিটমেন্ট কাঠ',
    badgeEn: 'Treated Wood'
  },
  {
    slug: 'furniture',
    nameBn: 'ফার্নিচার',
    nameEn: 'Furniture',
    descriptionBn: 'অভিজাত ড্রয়িং, ডাইনিং ও বেডরুমের জন্য দীর্ঘস্থায়ী ট্রিটমেন্ট কাঠে তৈরি আধুনিক ও রাজকীয় ফার্নিচার সামগ্রী।',
    descriptionEn: 'Durable treated wood luxury furniture for living rooms, bedrooms, and commercial interiors.',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&auto=format&fit=crop&q=80',
    countKey: 'furniture',
    badgeBn: 'প্রিমিয়াম কোয়ালিটি',
    badgeEn: 'Premium Quality'
  },
  {
    slug: 'dining-table',
    nameBn: 'ডাইনিং টেবিল',
    nameEn: 'Dining Table',
    descriptionBn: 'পারিবারিক খাবার ঘরের আভিজাত্য বাড়াতে সলিড কাঠ ও নান্দনিক ফিনিশের ৪, ৬ ও ৮ সিটের বিলাসবহুল ডাইনিং টেবিল।',
    descriptionEn: 'Handcrafted 4, 6, and 8-seater solid wood dining tables with regal polish and durable structure.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&auto=format&fit=crop&q=80',
    countKey: 'dining-table',
    badgeBn: 'হাতে খোদাইকৃত',
    badgeEn: 'Hand Carved'
  },
  {
    slug: 'bed',
    nameBn: 'বেড',
    nameEn: 'Bed',
    descriptionBn: 'কিং ও কুইন সাইজের সুদৃশ্য রাজকীয় খাট। দীর্ঘস্থায়ী সেগুন ও মেহগনি কাঠে তৈরি মজবুত বেড কালেকশন।',
    descriptionEn: 'King and Queen size luxury wooden beds built with seasoned timber for lifetime comfort.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80',
    countKey: 'bed',
    badgeBn: 'উইপোকা প্রতিরোধী',
    badgeEn: 'Termite Resistant'
  },
  {
    slug: 'tea-table',
    nameBn: 'টি টেবিল',
    nameEn: 'Tea Table',
    descriptionBn: 'ড্রয়িং রুমের শোভা বাড়াতে ক্লাসিক ও মডার্ন ডিজাইনের সলিড উডেন কফি টেবিল ও টি টেবিল সেট।',
    descriptionEn: 'Elegant solid wood coffee and tea tables crafted to complement your living space aesthetic.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=900&auto=format&fit=crop&q=80',
    countKey: 'tea-table',
    badgeBn: 'ল্যাকার ফিনিশ',
    badgeEn: 'Lacquer Finish'
  },
  {
    slug: 'sofa',
    nameBn: 'সোফা',
    nameEn: 'Sofa',
    descriptionBn: 'ভারী সলিড উডেন ফ্রেমের ৩+১+১ ও কর্নার সোফা সেট। আরামদায়ক কুশন ও দৃষ্টিনন্দন কাঠের খোদাই কাজ।',
    descriptionEn: 'Solid wooden frame living room sofa sets with comfort cushioning and fine woodwork.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80',
    countKey: 'sofa',
    badgeBn: 'মজবুত কাঠামো',
    badgeEn: 'Heavy Duty Frame'
  },
  {
    slug: 'custom-design',
    nameBn: 'কাস্টম ডিজাইন',
    nameEn: 'Custom Design',
    descriptionBn: 'আপনার নিজস্ব ছবি, ক্যাটালগ নকশা বা আর্কিটেকচারাল ড্রয়িং অনুযায়ী যেকোনো মাপ ও কাঠে তৈরি স্পেশাল অর্ডার।',
    descriptionEn: 'Custom woodwork made exactly according to your design photo, blueprint, and custom measurements.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&auto=format&fit=crop&q=80',
    countKey: 'custom-design',
    badgeBn: 'নিজের ডিজাইন দিন',
    badgeEn: 'Custom Order'
  }
];
