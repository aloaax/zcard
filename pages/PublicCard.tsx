import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Mail, Share2, Download, MapPin, Briefcase, Globe, Star, ChevronDown, CheckCircle, Languages, Linkedin, Twitter, Instagram } from 'lucide-react';
import { cardService } from '../services/cardService';
import { BusinessCardData, Project, Service } from '../types';
import { DEFAULT_CARD } from '../utils/defaultData';
import { downloadVCard } from '../utils/vcardGenerator';
import WhatsAppModal from '../components/WhatsAppModal';
import ProjectDetailModal from '../components/ProjectDetailModal';
import ServiceDetailModal from '../components/ServiceDetailModal';

const TRANSLATIONS = {
  ar: {
    call: 'اتصال',
    whatsapp: 'واتساب',
    email: 'بريد',
    save: 'حفظ',
    share: 'مشاركة',
    infoTab: 'المعلومات',
    projectsTab: 'المشاريع',
    aboutMe: 'نبذة عني',
    myServices: 'خدماتي',
    companyInfo: 'بيانات الشركة',
    poweredBy: 'Powered by Awj Tech',
    adminPanel: '[ لوحة التحكم ]',
    projectsGallery: 'معرض المشاريع',
    viewDetails: 'عرض التفاصيل',
    exploreProjects: 'تعرف على مشاريعنا',
    exploreSub: 'استكشف معرض أعمال أوج تك',
    shareSuccess: 'تم نسخ الرابط!',
    loading: 'جاري التحميل...',
  },
  en: {
    call: 'Call',
    whatsapp: 'WhatsApp',
    email: 'Email',
    save: 'Save',
    share: 'Share',
    infoTab: 'Info',
    projectsTab: 'Projects',
    aboutMe: 'About Me',
    myServices: 'My Services',
    companyInfo: 'Company Info',
    poweredBy: 'Powered by Awj Tech',
    adminPanel: '[ Admin Panel ]',
    projectsGallery: 'Projects Gallery',
    viewDetails: 'View Details',
    exploreProjects: 'Explore Our Projects',
    exploreSub: 'Discover Awj Tech portfolio',
    shareSuccess: 'Link copied!',
    loading: 'Loading...',
  }
};

const PublicCard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<BusinessCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'projects'>('info');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    const loadData = async () => {
      if (!slug || slug === DEFAULT_CARD.slug) {
        setData(DEFAULT_CARD);
      } else {
        const card = await cardService.getCardBySlug(slug);
        setData(card || DEFAULT_CARD);
      }
      setLoading(false);
    };
    loadData();
  }, [slug]);

  const getContent = (ar?: string, en?: string) => {
    if (lang === 'en' && en) return en;
    return ar || '';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getContent(data?.fullName, data?.fullNameEn),
          text: getContent(data?.tagline, data?.taglineEn),
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t.shareSuccess);
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const hasProjects = data.projects && data.projects.length > 0;
  const hasServices = data.services && data.services.length > 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 pb-10 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto bg-white min-h-screen sm:my-8 sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative">

        <button 
          onClick={toggleLanguage}
          className="absolute top-4 left-4 z-40 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold"
        >
          <Languages size={14} />
          {lang === 'ar' ? 'English' : 'عربي'}
        </button>

        <div className="h-48 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'}`}>
            {data.companyLogoUrl && (
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                <span className="text-white font-bold tracking-wider">
                  {getContent(data.companyName, data.companyNameEn).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 relative -mt-20 text-center">
          <div className="relative inline-block">
            <div className="w-40 h-40 rounded-full p-1.5 bg-white shadow-xl mx-auto">
              <img 
                src={data.profileImageUrl} 
                alt={data.fullName} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className={`absolute bottom-4 ${isRTL ? 'right-2' : 'left-2'} bg-green-500 w-6 h-6 rounded-full border-4 border-white`}></div>
          </div>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">{getContent(data.fullName, data.fullNameEn)}</h1>
            <p className="text-blue-600 font-medium text-lg">{getContent(data.title, data.titleEn)}</p>
            <p className="text-gray-500 text-sm px-8">{getContent(data.tagline, data.taglineEn)}</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 px-6 mt-8 mb-6">
          <ActionButton icon={<Phone size={20} />} label={t.call} onClick={() => window.open(`tel:${data.contact.personalPhone}`)} />
          <ActionButton icon={<span className="font-bold text-xl">WA</span>} label={t.whatsapp} onClick={() => setShowWhatsAppModal(true)} />
          <ActionButton icon={<Mail size={20} />} label={t.email} onClick={() => window.open(`mailto:${data.contact.email}`)} />
          <ActionButton icon={<Download size={20} />} label={t.save} onClick={() => downloadVCard(data)} />
          <ActionButton icon={<Share2 size={20} />} label={t.share} onClick={handleShare} />
        </div>

        {hasProjects && (
          <div className="flex border-b border-gray-100 mb-6 sticky top-0 bg-white/95 backdrop-blur z-30">
            <button className={`flex-1 py-4 font-bold ${activeTab === 'info' ? 'text-blue-800' : 'text-gray-400'}`} onClick={() => setActiveTab('info')}>
              {t.infoTab}
            </button>
            <button className={`flex-1 py-4 font-bold ${activeTab === 'projects' ? 'text-blue-800' : 'text-gray-400'}`} onClick={() => setActiveTab('projects')}>
              {t.projectsTab}
            </button>
          </div>
        )}

        <div className="px-6 pb-20 min-h-[300px]">
          {activeTab === 'info' ? (
            <div className="space-y-6">
              {hasProjects && (
                <button 
                  onClick={() => setActiveTab('projects')}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full"><Star fill="white" size={20} /></div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <div className="font-bold text-lg">{t.exploreProjects}</div>
                      <div className="text-blue-200 text-xs">{t.exploreSub}</div>
                    </div>
                  </div>
                  <ChevronDown className={isRTL ? 'rotate-90' : '-rotate-90'} size={20} />
                </button>
              )}

           

              <div className="bg-gray-900 text-gray-300 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">{t.companyInfo}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone size={16} />
                    <span dir="ltr">{data.contact.companyPhone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} />
                    <span>{getContent(data.contact.location, data.contact.locationEn)}</span>
                  </div>
                  <a href={data.social.website} target="_blank" className="flex items-center gap-3 text-blue-400">
                    <Globe size={16} />
                    <span dir="ltr">{data.social.website}</span>
                  </a>
                </div>

                {(data.social.linkedin || data.social.twitter || data.social.instagram) && (
                  <div className="mt-6 pt-6 border-t border-gray-800 flex justify-center gap-4">
                    {data.social.linkedin && (
                      <a href={data.social.linkedin} target="_blank" className="bg-gray-800 p-3 rounded-full text-gray-400 hover:bg-[#0077b5] hover:text-white">
                        <Linkedin size={20}/>
                      </a>
                    )}
                    {data.social.twitter && (
                      <a href={data.social.twitter} target="_blank" className="bg-gray-800 p-3 rounded-full text-gray-400 hover:bg-black hover:text-white">
                        <Twitter size={20}/>
                      </a>
                    )}
                    {data.social.instagram && (
                      <a href={data.social.instagram} target="_blank" className="bg-gray-800 p-3 rounded-full text-gray-400 hover:bg-gradient-to-tr from-[#fd5949] to-[#d6249f] hover:text-white">
                        <Instagram size={20}/>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.projectsGallery}</h2>
              <div className="grid grid-cols-1 gap-6">
                {data.projects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white border border-gray-100 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition p-4"
                  >
                    <img src={project.image} className="w-full h-48 object-cover rounded-lg mb-3" />
                    <h3 className="text-lg font-bold text-gray-800">{getContent(project.title, project.titleEn)}</h3>
                    <p className="text-gray-600 text-sm">{getContent(project.subtitle, project.subtitleEn)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center py-6 text-xs text-gray-400">
          {t.poweredBy} <a href="https://awj.sa" target="_blank" className="underline">Awj Tech</a>
        </div>
      </div>

      {showWhatsAppModal && (
        <WhatsAppModal 
          onClose={() => setShowWhatsAppModal(false)}
          phone={data.contact.personalPhone}
        />
      )}

      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          lang={lang}
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {selectedService && (
        <ServiceDetailModal 
          service={selectedService} 
          lang={lang}
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
};

const ActionButton = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-gray-100 text-gray-700 py-3 rounded-xl flex flex-col items-center hover:bg-gray-200"
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default PublicCard;
