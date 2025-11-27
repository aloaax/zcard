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

// Translations for static UI elements
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

  // Helper to get translated content from data
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
      } catch (err) {
        console.error("Share failed", err);
      }
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
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 pb-10 font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto bg-white min-h-screen sm:min-h-0 sm:my-8 sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative">
        
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="absolute top-4 left-4 z-40 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold hover:bg-white/30 transition-all shadow-sm"
        >
          <Languages size={14} />
          {lang === 'ar' ? 'English' : 'عربي'}
        </button>

        {/* Top Header Background */}
        <div className="h-48 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          {/* Company Logo Overlay */}
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

        {/* Profile Section */}
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
          
          <div className="mt-4 space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">{getContent(data.fullName, data.fullNameEn)}</h1>
            <p className="text-blue-600 font-medium text-lg">{getContent(data.title, data.titleEn)}</p>
            <p className="text-gray-500 text-sm font-light px-8">{getContent(data.tagline, data.taglineEn)}</p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-5 gap-3 px-6 mt-8 mb-6">
          <ActionButton 
            icon={<Phone size={20} />} 
            label={t.call} 
            onClick={() => window.open(`tel:${data.contact.personalPhone}`)}
            color="bg-gray-100 text-gray-700 hover:bg-gray-200"
          />
          <ActionButton 
            icon={<span className="font-bold text-xl">WA</span>} 
            label={t.whatsapp} 
            onClick={() => setShowWhatsAppModal(true)}
            color="bg-green-50 text-green-600 hover:bg-green-100"
          />
          <ActionButton 
            icon={<Mail size={20} />} 
            label={t.email} 
            onClick={() => window.open(`mailto:${data.contact.email}`)}
            color="bg-red-50 text-red-600 hover:bg-red-100"
          />
          <ActionButton 
            icon={<Download size={20} />} 
            label={t.save} 
            onClick={() => downloadVCard(data)}
            color="bg-blue-50 text-blue-600 hover:bg-blue-100"
          />
          <ActionButton 
            icon={<Share2 size={20} />} 
            label={t.share} 
            onClick={handleShare}
            color="bg-purple-50 text-purple-600 hover:bg-purple-100"
          />
        </div>

        {/* Navigation Tabs - Only show if there are projects */}
        {hasProjects && (
          <div className="flex border-b border-gray-100 mb-6 sticky top-0 bg-white/95 backdrop-blur z-30">
            <button 
              className={`flex-1 py-4 font-bold text-center transition-colors relative ${activeTab === 'info' ? 'text-blue-800' : 'text-gray-400'}`}
              onClick={() => setActiveTab('info')}
            >
              {t.infoTab}
              {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-800 rounded-t-full mx-8"></div>}
            </button>
            <button 
              className={`flex-1 py-4 font-bold text-center transition-colors relative ${activeTab === 'projects' ? 'text-blue-800' : 'text-gray-400'}`}
              onClick={() => setActiveTab('projects')}
            >
              {t.projectsTab}
              {activeTab === 'projects' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-800 rounded-t-full mx-8"></div>}
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="px-6 pb-20 min-h-[300px]">
          {activeTab === 'info' ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Projects CTA - Only if has projects */}
              {hasProjects && (
                <button 
                  onClick={() => setActiveTab('projects')}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white p-5 rounded-2xl shadow-lg shadow-blue-200 transform transition hover:scale-[1.02] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Star fill="white" className="text-transparent" size={20} />
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <div className="font-bold text-lg">{t.exploreProjects}</div>
                      <div className="text-blue-200 text-xs">{t.exploreSub}</div>
                    </div>
                  </div>
                  <div className="bg-white text-blue-900 rounded-full p-1">
                    <ChevronDown className={`transform ${isRTL ? 'rotate-90' : '-rotate-90'}`} size={20}/>
                  </div>
                </button>
              )}

              {/* About Section */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-600"/>
                  {t.aboutMe}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {getContent(data.about, data.aboutEn)}
                </p>
              </div>

              {/* Services Section - Hide if empty */}
              {hasServices && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={18} className="text-blue-600"/>
                    {t.myServices}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {data.services.map((service) => (
                      <div 
                        key={service.id} 
                        onClick={() => setSelectedService(service)}
                        className="bg-gray-50 rounded-xl p-3 text-center text-sm font-medium text-gray-700 flex flex-col items-center gap-2 hover:bg-blue-50 cursor-pointer transition-all hover:shadow-md"
                      >
                        {service.icon && <img src={service.icon} alt="" className="w-8 h-8 object-contain" />}
                        <span>{getContent(service.name, service.nameEn)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info */}
              <div className="bg-gray-900 text-gray-300 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
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
                  <a href={data.social.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-blue-400 hover:text-blue-300">
                    <Globe size={16} />
                    <span className="truncate" dir="ltr">{data.social.website}</span>
                  </a>
                </div>

                {/* Social Media Links - Linked to Admin Dashboard */}
                {(data.social.linkedin || data.social.twitter || data.social.instagram) && (
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="flex justify-center gap-4">
                      {data.social.linkedin && (
                        <a 
                          href={data.social.linkedin} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-gray-800 p-3 rounded-full text-gray-400 hover:bg-[#0077b5] hover:text-white transition-all transform hover:-translate-y-1"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                      {data.social.twitter && (
                        <a 
                          href={data.social.twitter} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-gray-800 p-3 rounded-full text-gray-400 hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"
                          aria-label="Twitter"
                        >
                          <Twitter size={20} />
                        </a>
                      )}
                      {data.social.instagram && (
                        <a 
                          href={data.social.instagram} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-gray-800 p-3 rounded-full text-gray-400 hover:bg-gradient-to-tr from-[#fd5949] to-[#d6249f] hover:text-white transition-all transform hover:-translate-y-1"
                          aria-label="Instagram"
                        >
                          <Instagram size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.projectsGallery}</h2>
              <div className="grid grid-cols-1 gap-6">
                {data.projects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 cursor-pointer group hover:shadow-xl transition-all"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={project.thumbnailUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-medium border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                          {t.viewDetails}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{getContent(project.title, project.titleEn)}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{getContent(project.description, project.descriptionEn)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Branding */}
        <div className="text-center py-6 text-gray-400 text-xs bg-gray-50 border-t border-gray-100">
          <p>{t.poweredBy}</p>
        </div>

      </div>

      <WhatsAppModal 
        isOpen={showWhatsAppModal} 
        onClose={() => setShowWhatsAppModal(false)}
        personalNumber={data.contact.personalPhone}
        workNumber={data.contact.workPhone}
      />

      <ProjectDetailModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        lang={lang}
      />

      <ServiceDetailModal 
        service={selectedService}
        onClose={() => setSelectedService(null)}
        lang={lang}
      />

    </div>
  );
};

const ActionButton: React.FC<{icon: React.ReactNode, label: string, onClick: () => void, color: string}> = ({ icon, label, onClick, color }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 group"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${color} group-hover:shadow-md group-hover:-translate-y-1`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold text-gray-600">{label}</span>
  </button>
);

export default PublicCard;
