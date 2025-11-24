import React from 'react';
import { X, MessageCircle, User, Briefcase } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  personalNumber: string;
  workNumber: string;
}

const WhatsAppModal: React.FC<Props> = ({ isOpen, onClose, personalNumber, workNumber }) => {
  if (!isOpen) return null;

  const openWhatsApp = (number: string) => {
    const cleanNum = number.replace(/[^0-9]/g, '');
    // Add Saudi country code if missing
    const finalNum = cleanNum.startsWith('966') ? cleanNum : `966${cleanNum.startsWith('0') ? cleanNum.substring(1) : cleanNum}`;
    window.open(`https://wa.me/${finalNum}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl transform transition-all scale-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">اختر نوع التواصل</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <button 
            onClick={() => openWhatsApp(personalNumber)}
            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-green-100 hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">تواصل شخصي</div>
                <div className="text-xs text-gray-500">{personalNumber}</div>
              </div>
            </div>
            <MessageCircle className="text-green-500" size={20} />
          </button>

          <button 
            onClick={() => openWhatsApp(workNumber)}
            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Briefcase size={24} />
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">تواصل أعمال</div>
                <div className="text-xs text-gray-500">{workNumber}</div>
              </div>
            </div>
            <MessageCircle className="text-blue-500" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;
