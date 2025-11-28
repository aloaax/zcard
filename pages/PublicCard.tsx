import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ChevronDown, Languages } from 'lucide-react';
import { cardService } from '../services/cardService';
import { BusinessCardData, Project } from '../types';
import { DEFAULT_CARD } from '../utils/defaultData';
import { downloadVCard } from '../utils/vcardGenerator';
import WhatsAppModal from '../components/WhatsAppModal';
import CallModal from '../components/CallModal';
import ProjectDetailModal from '../components/ProjectDetailModal';


// Translations for static UI elements
const TRANSLATIONS = {
  ar: {
    call: 'اتصال',
    whatsapp: 'واتساب',
    email: 'بريد',
    save: 'حفظ',
    share: 'مشاركة',
    poweredBy: 'Powered by Awj Tech',
    projectsGallery: 'Saftey Zone امتيازات  ',
    viewDetails: 'عرض التفاصيل',
    exploreProjects: 'تعرف على Saftey Zone',
    shareSuccess: 'تم نسخ الرابط!',
    loading: 'جاري التحميل...',
  },
  en: {
    call: 'Call',
    whatsapp: 'WhatsApp',
    email: 'Email',
    save: 'Save',
    share: 'Share',
    poweredBy: 'Powered by Awj Tech',
    projectsGallery: 'Saftey Zone',
    viewDetails: 'View Details',
    exploreProjects: 'Learn About Safety Zone',
    shareSuccess: 'Link copied!',
    loading: 'Loading...',
  }
};

const PublicCard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<BusinessCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProjects, setShowProjects] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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


  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 pb-10 font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto bg-white min-h-screen sm:min-h-0 sm:my-8 sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative">

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="absolute top-4 right-4 z-40 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold hover:bg-white/30 transition-all shadow-sm"
        >
          <Languages size={14} />
          {lang === 'ar' ? 'English' : 'عربي'}
        </button>

        {/* Top Header Background */}
        <div className="h-48 bg-black relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://planpos.com/wp-content/uploads/2025/11/fff.png"
              alt="Header Background"
              className="h-full w-full object opacity-100"
            />
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
            <h1 className="text-2xl font-bold text-gray-900">{getContent(data.fullName, data.fullNameEn)}</h1>
            <p className="text-blue-500 font-medium text-lg">{getContent(data.title, data.titleEn)}</p>
            <p className="text-gray-500 text-sm font-light px-8">{getContent(data.tagline, data.taglineEn)}</p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-5 gap-3 px-6 mt-8 mb-6">
          <ActionButton
            icon={<img src="/images/call.png" alt="Call" className="w-full h-full object-contain" />}
            onClick={() => setShowCallModal(true)}
            color="bg-transparent"
          />
          <ActionButton
            icon={<img src="/images/whatsapp.png" alt="WhatsApp" className="w-full h-full object-contain" />}
            onClick={() => setShowWhatsAppModal(true)}
            color="bg-transparent"
          />
          <ActionButton
            icon={<img src="/images/email.png" alt="Email" className="w-full h-full object-contain" />}
            label={t.email}
            onClick={() => window.open(`mailto:${data.contact.email}`)}
            color="bg-transparent"
          />
          <ActionButton
            icon={<img src="/images/save.png" alt="Save" className="w-full h-full object-contain" />}
            onClick={() => downloadVCard(data)}
            color="bg-transparent"
          />
          <ActionButton
            icon={<img src="/images/share.png" alt="Share" className="w-full h-full object-contain" />}
            onClick={handleShare}
            color="bg-transparent"
          />
        </div>


<br><br/>
        {/* Content Area */}
        <div className="px-6 pb-20 min-h-[300px]">
          <div className="space-y-6 animate-fadeIn">

            {/* Projects CTA - Only if has projects */}
            {hasProjects && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowProjects(!showProjects)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-5 rounded-2xl shadow-lg shadow-blue-200 transform transition hover:scale-[1.02] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Star fill="white" className="text-transparent" size={18} />
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <div className="font-bold text-l">{t.exploreProjects}</div>
                    </div>
                  </div>
                  <div className="bg-white text-blue-900 rounded-full p-1">
                    <ChevronDown className={`transform transition-transform duration-300 ${showProjects ? 'rotate-180' : ''}`} size={20} />
                  </div>
                </button>

                {/* Projects List (Accordion Content) */}
                {showProjects && (
                  <div className="grid grid-cols-1 gap-6 animate-fadeIn">
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
                )}
              </div>
            )}
          </div>
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

      <CallModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        personalNumber={data.contact.personalPhone}
        workNumber={data.contact.workPhone}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        lang={lang}
      />



    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, color: string }> = ({ icon, label, onClick, color }) => (
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
