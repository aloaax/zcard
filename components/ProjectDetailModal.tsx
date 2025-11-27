import React from 'react';
import { X, Play, FileText, Download, Image as ImageIcon } from 'lucide-react';
import { Project } from '../types';

interface Props {
  project: Project | null;
  onClose: () => void;
  lang?: 'ar' | 'en';
}

const ProjectDetailModal: React.FC<Props> = ({ project, onClose, lang = 'ar' }) => {
  if (!project) return null;

  const isRTL = lang === 'ar';
  
  const getContent = (ar?: string, en?: string) => {
    if (lang === 'en' && en) return en;
    return ar || '';
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md p-4 overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl my-auto relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Image */}
        <div className="h-48 sm:h-64 w-full bg-gray-200 relative shrink-0">
          <img 
            src={project.thumbnailUrl} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-all`}
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h2 className="text-2xl font-bold text-white">{getContent(project.title, project.titleEn)}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-gray-600 leading-relaxed mb-6 text-lg">
            {getContent(project.description, project.descriptionEn)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {project.videoUrl && (
              <a 
                href={project.videoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl hover:bg-red-100 transition-all font-bold border border-red-200"
              >
                <Play size={20} fill="currentColor" />
                {lang === 'ar' ? 'مشاهدة الفيديو' : 'Watch Video'}
              </a>
            )}
            
            {(project.pdfUrl || true) && ( 
              // Always showing generic download for demo since URLs might be empty
              <button 
                className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 p-4 rounded-xl hover:bg-blue-100 transition-all font-bold border border-blue-200"
                onClick={() => alert(lang === 'ar' ? "سيتم تحميل ملف المشروع قريباً" : "Project file download coming soon")}
              >
                <FileText size={20} />
                <span>{lang === 'ar' ? 'تحميل الملف (PDF)' : 'Download PDF'}</span>
              </button>
            )}
          </div>

          <div>
            
            <div className="grid grid-cols-2 gap-3">
              {project.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`Project ${idx}`} 
                  className="rounded-xl w-full h-32 object-cover border border-gray-100 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
