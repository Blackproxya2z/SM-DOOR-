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
    slug: 'door',
    nameBn: 'দরজা',
    nameEn: 'Doors',
    descriptionBn: 'চিটাগাং সেগুন, গামারি ও সিজনড মেহগনি কাঠে তৈরি শৈল্পিক খোদাইকৃত ও আধুনিক ৩ডি সলিড কাঠের দরজা।',
    descriptionEn: 'Artistic hand-carved and 3D CNC solid wooden doors in Teak, Gamari, and Seasoned Mahogany.',
    image: '/images/products/door/fe-door-001.webp',
    countKey: 'door',
    badgeBn: 'ট্রিটমেন্ট কাঠ',
    badgeEn: 'Treated Wood'
  },
  {
    slug: 'wood',
    nameBn: 'কাঠ / লগ ও সাইজ কাঠ',
    nameEn: 'Wood / Logs & Sized Wood',
    descriptionBn: 'সরাসরি নিজস্ব স’মিল থেকে সংগৃহীত গোল গুঁড়ি (লগ), সঠিক মাপে চেরা তক্তা, বাটাম ও প্রিমিয়াম সাইজ কাঠ।',
    descriptionEn: 'Round logs, sawn timber, planks, and sized wood processed directly from our facility.',
    image: '/images/products/wood/fe-wood-001.webp',
    countKey: 'wood',
    badgeBn: '১০০% পাকা কাঠ',
    badgeEn: '100% Mature Timber'
  },
  {
    slug: 'bed',
    nameBn: 'বেড / খাট',
    nameEn: 'Beds',
    descriptionBn: 'কিং ও কুইন সাইজের সুদৃশ্য রাজকীয় খাট। দীর্ঘস্থায়ী সেগুন ও মেহগনি কাঠে তৈরি মজবুত বেড কালেকশন।',
    descriptionEn: 'King and Queen size luxury wooden beds built with seasoned timber for lifetime comfort.',
    image: '/images/products/bed/fe-bed-001.webp',
    countKey: 'bed',
    badgeBn: 'উইপোকা প্রতিরোধী',
    badgeEn: 'Termite Resistant'
  },
  {
    slug: 'dining-table',
    nameBn: 'ডাইনিং টেবিল',
    nameEn: 'Dining Tables',
    descriptionBn: 'পারিবারিক খাবার ঘরের আভিজাত্য বাড়াতে সলিড কাঠ ও নান্দনিক ফিনিশের ৪, ৬ ও ৮ সিটের বিলাসবহুল ডাইনিং টেবিল।',
    descriptionEn: 'Handcrafted 4, 6, and 8-seater solid wood dining tables with regal polish and durable structure.',
    image: '/images/products/dining-table/fe-dining-001.webp',
    countKey: 'dining-table',
    badgeBn: 'হাতে খোদাইকৃত',
    badgeEn: 'Hand Carved'
  },
  {
    slug: 'sofa',
    nameBn: 'সোফা',
    nameEn: 'Sofas',
    descriptionBn: 'ভারী সলিড উডেন ফ্রেমের ৩+১+১ ও কর্নার সোফা সেট। আরামদায়ক কুশন ও দৃষ্টিনন্দন কাঠের খোদাই কাজ।',
    descriptionEn: 'Solid wooden frame living room sofa sets with comfort cushioning and fine woodwork.',
    image: '/images/products/sofa/fe-sofa-001.webp',
    countKey: 'sofa',
    badgeBn: 'মজবুত কাঠামো',
    badgeEn: 'Heavy Duty Frame'
  },
  {
    slug: 'tea-table',
    nameBn: 'টি টেবিল',
    nameEn: 'Tea Tables',
    descriptionBn: 'ড্রয়িং রুমের শোভা বাড়াতে ক্লাসিক ও মডার্ন ডিজাইনের সলিড উডেন কফি টেবিল ও টি টেবিল সেট।',
    descriptionEn: 'Elegant solid wood coffee and tea tables crafted to complement your living space aesthetic.',
    image: '/images/products/tea-table/fe-tea-001.webp',
    countKey: 'tea-table',
    badgeBn: 'ল্যাকার ফিনিশ',
    badgeEn: 'Lacquer Finish'
  },
  {
    slug: 'furniture',
    nameBn: 'ফার্নিচার',
    nameEn: 'Furniture',
    descriptionBn: 'অভিজাত ড্রয়িং, ডাইনিং ও বেডরুমের জন্য দীর্ঘস্থায়ী ট্রিটমেন্ট কাঠে তৈরি আধুনিক ও রাজকীয় ফার্নিচার সামগ্রী।',
    descriptionEn: 'Durable treated wood luxury furniture for living rooms, bedrooms, and commercial interiors.',
    image: '/images/products/furniture/fe-furn-001.webp',
    countKey: 'furniture',
    badgeBn: 'প্রিমিয়াম কোয়ালিটি',
    badgeEn: 'Premium Quality'
  },
  {
    slug: 'custom-design',
    nameBn: 'কাস্টম ডিজাইন',
    nameEn: 'Custom Design',
    descriptionBn: 'আপনার নিজস্ব ছবি, ক্যাটালগ নকশা বা আর্কিটেকচারাল ড্রয়িং অনুযায়ী যেকোনো মাপ ও কাঠে তৈরি স্পেশাল অর্ডার।',
    descriptionEn: 'Custom woodwork made exactly according to your design photo, blueprint, and custom measurements.',
    image: '/images/products/custom-design/fe-custom-001.webp',
    countKey: 'custom-design',
    badgeBn: 'নিজের ডিজাইন দিন',
    badgeEn: 'Custom Order'
  }
];
