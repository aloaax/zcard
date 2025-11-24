import { BusinessCardData } from '../types';

export const DEFAULT_CARD: BusinessCardData = {
  id: 'default_001',
  slug: 'salem-alsalem',
  fullName: 'سالم محمد ال سالم',
  fullNameEn: 'Salem Mohammed Al-Salem',
  title: 'المدير التنفيذي',
  titleEn: 'Chief Executive Officer',
  companyName: 'أوج تك',
  companyNameEn: 'Awj Tech',
  tagline: 'شريك ومؤسس لشركة أوج تك',
  taglineEn: 'Co-founder & Partner at Awj Tech',
  profileImageUrl: 'https://i.pravatar.cc/300?img=11', // Placeholder for Salem
  companyLogoUrl: 'https://picsum.photos/200/200?blur=2', // Placeholder for Logo
  about: 'رائد أعمال شغوف بالتقنية والابتكار، أسعى لتقديم حلول رقمية متكاملة تساهم في تطوير بيئة الأعمال من خلال شركة أوج تك.',
  aboutEn: 'A tech-savvy entrepreneur passionate about innovation, striving to provide integrated digital solutions that contribute to business ecosystem development through Awj Tech.',
  contact: {
    personalPhone: '0580100070',
    workPhone: '0580100070',
    email: 'salem.alsalem@awijtech.com',
    companyPhone: '920051099',
    location: 'الرياض، المملكة العربية السعودية',
    locationEn: 'Riyadh, Kingdom of Saudi Arabia'
  },
  social: {
    website: 'https://www.awijtech.com/',
  },
  services: [
    { 
      id: '1', 
      name: 'تطوير البرمجيات', 
      nameEn: 'Software Development',
      description: 'بناء تطبيقات ومواقع مخصصة.',
      descriptionEn: 'Building custom web and mobile applications.',
      icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
      images: [] 
    },
    { 
      id: '2', 
      name: 'التحول الرقمي', 
      nameEn: 'Digital Transformation',
      description: 'مساعدة الشركات في تبني التقنية.',
      descriptionEn: 'Helping businesses adopt technology efficiently.',
      icon: 'https://cdn-icons-png.flaticon.com/512/10842/10842408.png',
      images: []
    },
    { 
      id: '3', 
      name: 'استشارات تقنية', 
      nameEn: 'Tech Consultancy',
      description: 'تقديم المشورة للحلول التقنية المعقدة.',
      descriptionEn: 'Providing advice for complex technical solutions.',
      icon: 'https://cdn-icons-png.flaticon.com/512/1584/1584892.png',
      images: []
    },
    { 
      id: '4', 
      name: 'حلول السحابة', 
      nameEn: 'Cloud Solutions',
      description: 'إدارة واستضافة الخدمات السحابية.',
      descriptionEn: 'Managing and hosting cloud services.',
      icon: 'https://cdn-icons-png.flaticon.com/512/2316/2316021.png',
      images: []
    }
  ],
  projects: [
    {
      id: 'p1',
      title: 'نظام إدارة الموارد',
      titleEn: 'ERP System',
      description: 'نظام متكامل لإدارة موارد المؤسسات الكبيرة مع لوحات تحكم ذكية.',
      descriptionEn: 'Integrated Enterprise Resource Planning system with smart dashboards.',
      thumbnailUrl: 'https://picsum.photos/seed/p1/600/400',
      images: ['https://picsum.photos/seed/p1-1/800/600', 'https://picsum.photos/seed/p1-2/800/600']
    },
    {
      id: 'p2',
      title: 'تطبيق التوصيل الذكي',
      titleEn: 'Smart Delivery App',
      description: 'منصة توصيل تعتمد على الذكاء الاصطناعي لتحسين المسارات.',
      descriptionEn: 'AI-powered delivery platform for route optimization.',
      thumbnailUrl: 'https://picsum.photos/seed/p2/600/400',
      images: ['https://picsum.photos/seed/p2-1/800/600']
    },
    {
      id: 'p3',
      title: 'بوابة الدفع الإلكتروني',
      titleEn: 'Payment Gateway',
      description: 'حلول دفع آمنة وسريعة للمتاجر الإلكترونية.',
      descriptionEn: 'Secure and fast payment solutions for e-commerce.',
      thumbnailUrl: 'https://picsum.photos/seed/p3/600/400',
      images: ['https://picsum.photos/seed/p3-1/800/600']
    }
  ]
};