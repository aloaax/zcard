export interface Project {
  id: string;
  title: string;
  titleEn?: string; // English Title
  description: string;
  descriptionEn?: string; // English Description
  thumbnailUrl: string;
  videoUrl?: string;
  pdfUrl?: string;
  linkUrl?: string; // External Link
  images: string[];
}

export interface Service {
  id: string;
  name: string;
  nameEn?: string; // English Name
  description?: string;
  descriptionEn?: string; // English Description
  icon?: string;
  pdfUrl?: string;
  linkUrl?: string; // External Link
  images?: string[];
}

export interface SocialLinks {
  website: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface ContactInfo {
  personalPhone: string;
  workPhone: string;
  email: string;
  companyPhone: string;
  location?: string;
  locationEn?: string; // English Location
}

export interface BusinessCardData {
  id: string;
  slug: string; // unique url identifier
  fullName: string;
  fullNameEn?: string; // English Name
  title: string;
  titleEn?: string; // English Title
  companyName: string;
  companyNameEn?: string; // English Company Name
  tagline: string;
  taglineEn?: string; // English Tagline
  profileImageUrl: string;
  companyLogoUrl: string;
  about: string;
  aboutEn?: string; // English About
  contact: ContactInfo;
  social: SocialLinks;
  services: Service[];
  projects: Project[];
}