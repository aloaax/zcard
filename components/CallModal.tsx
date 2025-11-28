import React from 'react';
import { X, Phone, User, Briefcase } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    personalNumber: string;
    workNumber: string;
}

const CallModal: React.FC<Props> = ({ isOpen, onClose, personalNumber, workNumber }) => {
    if (!isOpen) return null;

    const makeCall = (number: string) => {
        window.open(`tel:${number}`, '_self');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl transform transition-all scale-100">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">اختر رقم الاتصال</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <button
                        onClick={() => makeCall(personalNumber)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-green-100 hover:border-green-500 hover:bg-green-50 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <User size={24} />
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-800">رقم شخصي</div>
                                <div className="text-xs text-gray-500">{personalNumber}</div>
                            </div>
                        </div>
                        <Phone className="text-green-500" size={20} />
                    </button>

                    <button
                        onClick={() => makeCall(workNumber)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Briefcase size={24} />
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-800">رقم الشركة</div>
                                <div className="text-xs text-gray-500">{workNumber}</div>
                            </div>
                        </div>
                        <Phone className="text-blue-500" size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallModal;
