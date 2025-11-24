import React from 'react';
import { X, FileText, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Service } from '../types';

interface Props {
  service: Service | null;
  onClose: () => void;
  lang?: 'ar' | 'en';
}

const ServiceDetailModal: React.FC<Props> = ({ service, onClose, lang = 'ar' }) => {
  if (!service) return null;

  const isRTL = lang === 'ar';
  
  const getContent = (ar?: string, en?: string) => {
    if (lang === 'en' && en) return en;
    return ar || '';
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md p-4 overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl my-auto relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 relative">
            <button 
                onClick={onClose}
                className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all`}
            >
                <X size={24} />
            </button>
            <div className="flex items-center gap-4 mt-2">
                {service.icon && (
                    <div className="bg-white p-3 rounded-xl shadow-lg">
                        <img src={service.icon} alt="" className="w-12 h-12 object-contain" />
                    </div>
                )}
                <h2 className="text-2xl font-bold text-white">{getContent(service.name, service.nameEn)}</h2>
            </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-gray-50 flex-1">
          <p className="text-gray-700 leading-relaxed text-lg mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {getContent(service.description, service.descriptionEn)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {service.linkUrl && (
              <a 
                href={service.linkUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-purple-50 text-purple-600 p-4 rounded-xl hover:bg-purple-100 transition-all font-bold border border-purple-200"
              >
                <LinkIcon size={20} />
                <span>{lang === 'ar' ? 'زيارة الرابط' : 'Visit Link'}</span>
              </a>
            )}
            
            {service.pdfUrl && ( 
              <button 
                className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 p-4 rounded-xl hover:bg-blue-100 transition-all font-bold border border-blue-200"
                onClick={() => window.open(service.pdfUrl, '_blank')}
              >
                <FileText size={20} />
                <span>{lang === 'ar' ? 'تحميل الملف (PDF)' : 'Download PDF'}</span>
              </button>
            )}
          </div>

          {service.images && service.images.length > 0 && (
            <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 text-lg">
                <ImageIcon size={20} className="text-blue-600" />
                {lang === 'ar' ? 'معرض الصور' : 'Gallery'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                {service.images.map((img, idx) => (
                    <img 
                    key={idx} 
                    src={img} 
                    alt={`Service ${idx}`} 
                    className="rounded-xl w-full h-32 object-cover border border-gray-100 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(img, '_blank')}
                    />
                ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;