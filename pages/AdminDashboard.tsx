import React, { useEffect, useState } from 'react';
import { cardService } from '../services/cardService';
import { BusinessCardData, Project, Service } from '../types';
import { 
  Edit2, Plus, Save, Trash2, ArrowRight, User, Phone, 
  Globe, Briefcase, Layers, LayoutGrid, Image as ImageIcon,
  ChevronDown, ChevronUp, Loader2, CheckCircle, LogOut,
  FileText, Link as LinkIcon, Cloud, CloudOff, Code, Download, Copy
} from 'lucide-react';
import { DEFAULT_CARD } from '../utils/defaultData';
import { auth, db } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [cards, setCards] = useState<BusinessCardData[]>([]);
  const [editingCard, setEditingCard] = useState<BusinessCardData | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'services' | 'projects' | 'dev'>('general');
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  // Check if we are connected to Firebase
  const isOnline = !!db;

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    const data = await cardService.getAllCards();
    setCards(data);
    setLoading(false);
  };

  const handleLogout = async () => {
      if (auth) {
          await signOut(auth);
      }
      navigate('/login');
  };

  const createNewCard = () => {
    const newId = Date.now().toString();
    const newCard: BusinessCardData = {
      ...DEFAULT_CARD,
      id: newId,
      slug: `user-${newId.slice(-4)}`,
      fullName: 'اسم جديد',
      fullNameEn: 'New Name',
      title: 'المسمى الوظيفي',
      titleEn: 'Job Title',
      projects: [],
      services: []
    };
    setEditingCard(newCard);
    setActiveTab('general');
  };

  const handleEdit = (card: BusinessCardData) => {
    setEditingCard({ ...card });
    setActiveTab('general');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه البطاقة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setLoading(true);
      try {
        await cardService.deleteCard(id);
        await loadCards();
      } catch (e) {
        alert("فشل الحذف. يرجى التحقق من صلاحيات Firebase (Firestore Rules) أو الاتصال بالإنترنت.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (editingCard) {
      setLoading(true);
      try {
        await cardService.saveCard(editingCard);
        // Wait a moment for visual feedback
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        
        // Reload lists
        await loadCards();
      } catch (e) {
        alert("فشل الحفظ. يرجى التحقق من صلاحيات Firebase (Firestore Rules) أو الاتصال بالإنترنت.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Field Updaters ---

  const updateField = (field: keyof BusinessCardData, value: any) => {
    if (!editingCard) return;
    setEditingCard({ ...editingCard, [field]: value });
  };

  const updateContact = (field: keyof BusinessCardData['contact'], value: string) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      contact: { ...editingCard.contact, [field]: value }
    });
  };

  const updateSocial = (field: keyof BusinessCardData['social'], value: string) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      social: { ...editingCard.social, [field]: value }
    });
  };

  // --- Service Management ---

  const addService = () => {
    if (!editingCard) return;
    const newId = Date.now().toString();
    const newService: Service = { id: newId, name: 'خدمة جديدة', nameEn: 'New Service', icon: '', images: [] };
    setEditingCard({
      ...editingCard,
      services: [...editingCard.services, newService]
    });
    setExpandedServices(prev => new Set(prev).add(newId));
  };

  const removeService = (id: string) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      services: editingCard.services.filter(s => s.id !== id)
    });
  };

  const updateService = (id: string, field: keyof Service, value: any) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      services: editingCard.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const toggleServiceExpand = (id: string) => {
    setExpandedServices(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });
  };

  // --- Project Management ---

  const addProject = () => {
    if (!editingCard) return;
    const newId = Date.now().toString();
    const newProject: Project = {
      id: newId,
      title: 'مشروع جديد',
      titleEn: 'New Project',
      description: '',
      descriptionEn: '',
      thumbnailUrl: 'https://via.placeholder.com/600x400',
      images: []
    };
    setEditingCard({
      ...editingCard,
      projects: [...editingCard.projects, newProject]
    });
    toggleProjectExpand(newId, true);
  };

  const removeProject = (id: string) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      projects: editingCard.projects.filter(p => p.id !== id)
    });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      projects: editingCard.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const toggleProjectExpand = (id: string, forceState?: boolean) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      const shouldExpand = forceState !== undefined ? forceState : !next.has(id);
      if (shouldExpand) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  // --- Developer Tools Helper ---
  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الكود!');
  };

  const PACKAGE_JSON_CONTENT = `{
  "name": "awj-digital-card",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "firebase": "^10.8.0",
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
}`;

  const VITE_CONFIG_CONTENT = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});`;

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col" dir="rtl">
        {/* Top Navbar */}
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <LayoutGrid size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none">لوحة التحكم</h1>
                        <p className="text-xs text-gray-400">Awj Tech Admin</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Connection Status Indicator */}
                    <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${isOnline ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {isOnline ? <Cloud size={14} /> : <CloudOff size={14} />}
                        {isOnline ? 'متصل بالسحابة' : 'وضع غير متصل'}
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition"
                    >
                        <span className="hidden md:inline text-sm font-bold">تسجيل خروج</span>
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>

        {/* Content Body */}
        <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
            
            {loading && !editingCard && cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 gap-4 text-gray-500">
                    <Loader2 size={40} className="animate-spin text-blue-600" />
                    <p>جاري تحميل النظام...</p>
                </div>
            ) : editingCard ? (
                // --- EDIT MODE (Sidebar Layout) ---
                <div className="flex flex-col lg:flex-row gap-6 h-full items-start">
                    
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-64 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24 shrink-0">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-700 text-sm">أقسام البطاقة</h3>
                        </div>
                        <div className="flex flex-col">
                            {[
                                { id: 'general', label: 'البيانات الأساسية', icon: User },
                                { id: 'contact', label: 'معلومات الاتصال', icon: Phone },
                                { id: 'social', label: 'الروابط الاجتماعية', icon: Globe },
                                { id: 'services', label: 'إدارة الخدمات', icon: Briefcase },
                                { id: 'projects', label: 'إدارة المشاريع', icon: Layers },
                                { id: 'dev', label: 'أدوات المطور', icon: Code },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all border-r-4 ${
                                        activeTab === tab.id 
                                            ? 'border-blue-600 text-blue-600 bg-blue-50' 
                                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {activeTab !== 'dev' && (
                            <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50 flex flex-col gap-2">
                                <button 
                                    onClick={handleSave} 
                                    disabled={loading}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition text-white font-bold flex justify-center items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    حفظ التعديلات
                                </button>
                                <button 
                                    onClick={() => setEditingCard(null)} 
                                    className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition text-gray-600 font-bold"
                                >
                                    رجوع للقائمة
                                </button>
                            </div>
                        )}
                        {activeTab === 'dev' && (
                            <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50">
                                 <button 
                                    onClick={() => setEditingCard(null)} 
                                    className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition text-gray-600 font-bold"
                                >
                                    رجوع للقائمة
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Main Form Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[600px] w-full">
                         {/* 1. General Info */}
                        {activeTab === 'general' && (
                        <div className="grid grid-cols-1 gap-6 animate-fadeIn">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-2">البيانات الأساسية</h2>
                            <BilingualInput 
                                label="الاسم الكامل" 
                                arValue={editingCard.fullName} 
                                enValue={editingCard.fullNameEn || ''}
                                onChangeAr={(v) => updateField('fullName', v)}
                                onChangeEn={(v) => updateField('fullNameEn', v)}
                            />
                            
                            <BilingualInput 
                                label="المسمى الوظيفي" 
                                arValue={editingCard.title} 
                                enValue={editingCard.titleEn || ''}
                                onChangeAr={(v) => updateField('title', v)}
                                onChangeEn={(v) => updateField('titleEn', v)}
                            />

                            <BilingualInput 
                                label="اسم الشركة" 
                                arValue={editingCard.companyName} 
                                enValue={editingCard.companyNameEn || ''}
                                onChangeAr={(v) => updateField('companyName', v)}
                                onChangeEn={(v) => updateField('companyNameEn', v)}
                            />
                            
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <label className="block text-sm font-bold text-blue-800 mb-2">رابط البطاقة الفريد (URL)</label>
                                <div className="flex items-center gap-2 bg-white rounded-lg border border-blue-200 p-2">
                                    <span className="text-gray-400 text-sm pl-2" dir="ltr">{window.location.origin}/#/</span>
                                    <input 
                                        type="text" 
                                        className="flex-1 outline-none text-blue-600 font-bold"
                                        value={editingCard.slug} 
                                        onChange={(e) => updateField('slug', e.target.value)} 
                                        dir="ltr"
                                    />
                                </div>
                                <p className="text-xs text-blue-400 mt-2">هذا الرابط هو الذي سيستخدمه العملاء للوصول للبطاقة.</p>
                            </div>
                            
                            <div className="col-span-full">
                                <BilingualInput 
                                    label="وصف مختصر (Tagline)" 
                                    arValue={editingCard.tagline} 
                                    enValue={editingCard.taglineEn || ''}
                                    onChangeAr={(v) => updateField('tagline', v)}
                                    onChangeEn={(v) => updateField('taglineEn', v)}
                                />
                            </div>
                            
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <InputGroup label="صورة الملف الشخصي (URL)" value={editingCard.profileImageUrl} onChange={(v) => updateField('profileImageUrl', v)} dir="ltr" />
                                </div>
                                {editingCard.profileImageUrl && (
                                    <div className="w-12 h-12 mb-1 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                    <img src={editingCard.profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <InputGroup label="شعار الشركة (URL)" value={editingCard.companyLogoUrl} onChange={(v) => updateField('companyLogoUrl', v)} dir="ltr" />
                                </div>
                                {editingCard.companyLogoUrl && (
                                    <div className="w-12 h-12 mb-1 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white p-1">
                                    <img src={editingCard.companyLogoUrl} alt="Preview" className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </div>

                            <div className="col-span-full space-y-4">
                                <label className="block text-sm font-bold text-gray-700">نبذة تفصيلية (About)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <textarea 
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition h-32 resize-none"
                                    value={editingCard.about}
                                    onChange={(e) => updateField('about', e.target.value)}
                                    placeholder="عربي"
                                    />
                                    <textarea 
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition h-32 resize-none"
                                    value={editingCard.aboutEn || ''}
                                    onChange={(e) => updateField('aboutEn', e.target.value)}
                                    placeholder="English"
                                    dir="ltr"
                                    />
                                </div>
                            </div>
                        </div>
                        )}

                        {/* 2. Contact Info */}
                        {activeTab === 'contact' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                             <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-2 col-span-full">معلومات الاتصال</h2>
                            <InputGroup label="رقم الجوال الشخصي" value={editingCard.contact.personalPhone} onChange={(v) => updateContact('personalPhone', v)} dir="ltr" />
                            <InputGroup label="رقم جوال العمل" value={editingCard.contact.workPhone} onChange={(v) => updateContact('workPhone', v)} dir="ltr" />
                            <InputGroup label="هاتف الشركة الموحد" value={editingCard.contact.companyPhone} onChange={(v) => updateContact('companyPhone', v)} dir="ltr" />
                            <InputGroup label="البريد الإلكتروني" value={editingCard.contact.email} onChange={(v) => updateContact('email', v)} dir="ltr" />
                            <div className="col-span-full">
                                <BilingualInput 
                                    label="العنوان / الموقع" 
                                    arValue={editingCard.contact.location || ''} 
                                    enValue={editingCard.contact.locationEn || ''}
                                    onChangeAr={(v) => updateContact('location', v)}
                                    onChangeEn={(v) => updateContact('locationEn', v)}
                                />
                            </div>
                        </div>
                        )}

                        {/* 3. Social Links */}
                        {activeTab === 'social' && (
                        <div className="grid grid-cols-1 gap-6 animate-fadeIn max-w-2xl">
                             <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-2">الروابط الاجتماعية</h2>
                            <InputGroup label="الموقع الإلكتروني" value={editingCard.social.website} onChange={(v) => updateSocial('website', v)} dir="ltr" />
                            <InputGroup label="LinkedIn" value={editingCard.social.linkedin || ''} onChange={(v) => updateSocial('linkedin', v)} dir="ltr" />
                            <InputGroup label="Twitter / X" value={editingCard.social.twitter || ''} onChange={(v) => updateSocial('twitter', v)} dir="ltr" />
                            <InputGroup label="Instagram" value={editingCard.social.instagram || ''} onChange={(v) => updateSocial('instagram', v)} dir="ltr" />
                        </div>
                        )}

                        {/* 4. Services */}
                        {activeTab === 'services' && (
                        <div className="animate-fadeIn">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">إدارة الخدمات</h2>
                                <button onClick={addService} className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition font-bold">
                                    <Plus size={16} /> إضافة خدمة جديدة
                                </button>
                            </div>
                            <div className="space-y-4">
                                {editingCard.services.map((service, index) => {
                                     const isExpanded = expandedServices.has(service.id);
                                     return (
                                        <div key={service.id} className="bg-white p-0 rounded-2xl border border-gray-200 shadow-sm transition-all overflow-hidden">
                                            {/* Header */}
                                            <div 
                                                className="flex justify-between items-center p-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition"
                                                onClick={() => toggleServiceExpand(service.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-8 h-8 font-bold text-gray-500 bg-white border border-gray-200 rounded-lg text-sm">{index + 1}</span>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{service.name}</h4>
                                                        <p className="text-xs text-gray-400">{service.nameEn}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={(e) => {e.stopPropagation(); removeService(service.id);}}
                                                        className="text-red-400 hover:text-red-600 p-2 rounded-lg transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    {isExpanded ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                                                </div>
                                            </div>

                                            {/* Body */}
                                            {isExpanded && (
                                                <div className="p-6 border-t border-gray-100">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="col-span-full md:col-span-1">
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block">اسم الخدمة (عربي)</label>
                                                            <input 
                                                            type="text" 
                                                            value={service.name}
                                                            onChange={(e) => updateService(service.id, 'name', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                        <div className="col-span-full md:col-span-1">
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Service Name (English)</label>
                                                            <input 
                                                            type="text" 
                                                            value={service.nameEn || ''}
                                                            onChange={(e) => updateService(service.id, 'nameEn', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-left"
                                                            dir="ltr"
                                                            />
                                                        </div>
                                                        
                                                        <div className="col-span-full md:col-span-1">
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block">وصف (عربي)</label>
                                                            <textarea 
                                                            value={service.description || ''}
                                                            onChange={(e) => updateService(service.id, 'description', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 h-24 resize-none"
                                                            />
                                                        </div>
                                                        <div className="col-span-full md:col-span-1">
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Description (English)</label>
                                                            <textarea 
                                                            value={service.descriptionEn || ''}
                                                            onChange={(e) => updateService(service.id, 'descriptionEn', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 h-24 resize-none"
                                                            dir="ltr"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-xl">
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block flex items-center gap-1"><FileText size={12}/> رابط ملف PDF (اختياري)</label>
                                                            <input 
                                                                type="text" 
                                                                value={service.pdfUrl || ''}
                                                                onChange={(e) => updateService(service.id, 'pdfUrl', e.target.value)}
                                                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-left"
                                                                dir="ltr"
                                                                placeholder="https://example.com/file.pdf"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block flex items-center gap-1"><LinkIcon size={12}/> رابط خارجي (اختياري)</label>
                                                            <input 
                                                                type="text" 
                                                                value={service.linkUrl || ''}
                                                                onChange={(e) => updateService(service.id, 'linkUrl', e.target.value)}
                                                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-left"
                                                                dir="ltr"
                                                                placeholder="https://example.com"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-4 items-center mb-4">
                                                        <div className="flex-1">
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block">رابط الأيقونة (Image URL)</label>
                                                            <input 
                                                                type="text" 
                                                                value={service.icon || ''}
                                                                onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                                                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-left"
                                                                dir="ltr"
                                                            />
                                                        </div>
                                                        {service.icon && <img src={service.icon} className="w-10 h-10 object-contain rounded bg-gray-50 border p-1" alt="" />}
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 mb-1">صور إضافية للمعرض (مفصولة بفاصلة)</label>
                                                        <input 
                                                            type="text" 
                                                            value={(service.images || []).join(', ')}
                                                            onChange={(e) => updateService(service.id, 'images', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                                            className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm text-left"
                                                            placeholder="url1, url2, url3"
                                                            dir="ltr"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                     );
                                })}
                                {editingCard.services.length === 0 && (
                                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                    <Briefcase size={32} className="mx-auto mb-2 opacity-50"/>
                                    <p>لا توجد خدمات مضافة حالياً. هذه القائمة لن تظهر في البطاقة.</p>
                                </div>
                                )}
                            </div>
                        </div>
                        )}

                        {/* 5. Projects */}
                        {activeTab === 'projects' && (
                        <div className="animate-fadeIn space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">معرض المشاريع</h2>
                                <button onClick={addProject} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-bold">
                                    <Plus size={16} /> مشروع جديد
                                </button>
                            </div>

                            {editingCard.projects.map((project, index) => {
                            const isExpanded = expandedProjects.has(project.id);
                            return (
                                <div key={project.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                {/* Project Header / Collapsed View */}
                                <div 
                                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => toggleProjectExpand(project.id)}
                                >
                                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                    <img src={project.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{project.title || '(مشروع جديد)'}</h4>
                                    <p className="text-xs text-gray-500 truncate">{project.titleEn}</p>
                                    </div>
                                    <button 
                                    onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
                                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition mr-2"
                                    >
                                    <Trash2 size={18} />
                                    </button>
                                    <div className="text-gray-400">
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                                
                                {/* Expanded Edit View */}
                                {isExpanded && (
                                    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        {/* Project Thumbnail Preview */}
                                        <div className="md:col-span-3">
                                        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group">
                                            <img src={project.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ImageIcon className="text-white" />
                                            </div>
                                        </div>
                                        </div>

                                        {/* Project Details Fields */}
                                        <div className="md:col-span-9 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">عنوان المشروع (عربي)</label>
                                            <input 
                                                type="text" 
                                                value={project.title}
                                                onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm"
                                            />
                                            </div>
                                            <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Project Title (English)</label>
                                            <input 
                                                type="text" 
                                                value={project.titleEn || ''}
                                                onChange={(e) => updateProject(project.id, 'titleEn', e.target.value)}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm text-left"
                                                dir="ltr"
                                            />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">وصف المشروع (عربي)</label>
                                            <textarea 
                                                value={project.description}
                                                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm h-24 resize-none"
                                            />
                                            </div>
                                            <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Description (English)</label>
                                            <textarea 
                                                value={project.descriptionEn || ''}
                                                onChange={(e) => updateProject(project.id, 'descriptionEn', e.target.value)}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm h-24 resize-none"
                                                dir="ltr"
                                            />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">رابط الصورة المصغرة</label>
                                            <input 
                                            type="text" 
                                            value={project.thumbnailUrl}
                                            onChange={(e) => updateProject(project.id, 'thumbnailUrl', e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm text-left"
                                            dir="ltr"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-xl">
                                            <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">رابط الفيديو (اختياري)</label>
                                            <input 
                                                type="text" 
                                                value={project.videoUrl || ''}
                                                onChange={(e) => updateProject(project.id, 'videoUrl', e.target.value)}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm text-left"
                                                dir="ltr"
                                            />
                                            </div>
                                            <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">رابط ملف PDF (اختياري)</label>
                                            <input 
                                                type="text" 
                                                value={project.pdfUrl || ''}
                                                onChange={(e) => updateProject(project.id, 'pdfUrl', e.target.value)}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm text-left"
                                                dir="ltr"
                                            />
                                            </div>
                                            <div className="col-span-full">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">رابط خارجي (Link URL)</label>
                                            <input 
                                                type="text" 
                                                value={project.linkUrl || ''}
                                                onChange={(e) => updateProject(project.id, 'linkUrl', e.target.value)}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm text-left"
                                                dir="ltr"
                                            />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">صور إضافية (مفصولة بفاصلة)</label>
                                            <input 
                                                type="text" 
                                                value={project.images.join(', ')}
                                                onChange={(e) => updateProject(project.id, 'images', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm text-left"
                                                placeholder="url1, url2, url3"
                                                dir="ltr"
                                            />
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                )}
                                </div>
                            );
                            })}
                            {editingCard.projects.length === 0 && (
                            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                <Layers size={32} className="mx-auto mb-2 opacity-50"/>
                                <p>لا توجد مشاريع مضافة. لن يظهر قسم المشاريع في البطاقة.</p>
                            </div>
                            )}
                        </div>
                        )}

                        {/* 6. Developer Tools */}
                        {activeTab === 'dev' && (
                        <div className="animate-fadeIn space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-2">أدوات المطور</h2>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm mb-4">
                                <strong>تنبيه:</strong> هذه الملفات ضرورية فقط إذا كنت تريد رفع المشروع على GitHub أو Hostinger. لست بحاجة لتعديلها إذا كنت تستخدم لوحة التحكم فقط.
                            </div>

                            {/* Package.json */}
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                                    <div className="font-bold text-gray-700 font-mono text-sm">package.json</div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => copyToClipboard(PACKAGE_JSON_CONTENT)}
                                            className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50"
                                        >
                                            <Copy size={12}/> نسخ
                                        </button>
                                        <button 
                                            onClick={() => downloadFile('package.json', PACKAGE_JSON_CONTENT)}
                                            className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                        >
                                            <Download size={12}/> تحميل
                                        </button>
                                    </div>
                                </div>
                                <div className="p-0 overflow-x-auto" dir="ltr">
                                    <pre className="text-xs text-gray-600 font-mono p-4">{PACKAGE_JSON_CONTENT}</pre>
                                </div>
                            </div>

                            {/* Vite Config */}
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                                    <div className="font-bold text-gray-700 font-mono text-sm">vite.config.ts</div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => copyToClipboard(VITE_CONFIG_CONTENT)}
                                            className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50"
                                        >
                                            <Copy size={12}/> نسخ
                                        </button>
                                        <button 
                                            onClick={() => downloadFile('vite.config.ts', VITE_CONFIG_CONTENT)}
                                            className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                        >
                                            <Download size={12}/> تحميل
                                        </button>
                                    </div>
                                </div>
                                <div className="p-0 overflow-x-auto" dir="ltr">
                                    <pre className="text-xs text-gray-600 font-mono p-4">{VITE_CONFIG_CONTENT}</pre>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            ) : (
                // --- LIST VIEW (Grid of Cards) ---
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">البطاقات المحفوظة</h2>
                        <button 
                            onClick={createNewCard}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2 font-bold disabled:opacity-50"
                        >
                            <Plus size={20} />
                            إنشاء بطاقة جديدة
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map(card => (
                        <div key={card.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="h-28 bg-gradient-to-r from-gray-900 to-gray-800 relative">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur px-2 py-1 rounded text-white text-xs">
                                {card.slug}
                            </div>
                            </div>
                            
                            <div className="px-6 relative">
                            <div className="absolute -top-10 right-6">
                                <img 
                                src={card.profileImageUrl} 
                                alt={card.fullName} 
                                className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover bg-white" 
                                />
                            </div>
                            <div className="pt-12 pb-6">
                                <h3 className="font-bold text-xl text-gray-900 mb-1">{card.fullName}</h3>
                                <p className="text-sm text-blue-600 font-medium mb-4">{card.title}</p>
                                
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-6">
                                <span className="bg-gray-100 px-2 py-1 rounded-md">{card.services.length} خدمات</span>
                                <span className="bg-gray-100 px-2 py-1 rounded-md">{card.projects.length} مشاريع</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
                                <button 
                                    onClick={() => handleEdit(card)} 
                                    className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-2.5 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition font-bold text-sm"
                                >
                                    <Edit2 size={16} /> تعديل
                                </button>
                                <button 
                                    onClick={() => handleDelete(card.id)} 
                                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl hover:bg-red-100 transition font-bold text-sm"
                                >
                                    <Trash2 size={16} /> حذف
                                </button>
                                </div>
                                <a 
                                href={`/#/${card.slug}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition text-sm font-bold"
                                >
                                عرض البطاقة <ArrowRight size={16} />
                                </a>
                            </div>
                            </div>
                        </div>
                        ))}
                        
                        {cards.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">
                            <LayoutGrid size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">لا توجد بطاقات محفوظة</p>
                            <button onClick={createNewCard} className="text-blue-600 font-bold hover:underline mt-2">أضف أول بطاقة</button>
                        </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-[100] transition-all duration-300 ease-in-out animate-fadeIn">
                    <CheckCircle size={20} className="text-green-400" />
                    <span className="font-bold">تم حفظ البطاقة بنجاح</span>
                </div>
            )}
        </div>
    </div>
  );
};

// Helper Component for Inputs
const InputGroup: React.FC<{
  label: string, 
  value: string, 
  onChange: (val: string) => void,
  dir?: 'rtl' | 'ltr'
}> = ({ label, value, onChange, dir = 'rtl' }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    <input 
      type="text" 
      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      dir={dir}
    />
  </div>
);

// Helper for Bilingual Input Pairs
const BilingualInput: React.FC<{
  label: string, 
  arValue: string, 
  enValue: string, 
  onChangeAr: (val: string) => void,
  onChangeEn: (val: string) => void
}> = ({ label, arValue, enValue, onChangeAr, onChangeEn }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label} (عربي)</label>
      <input 
        type="text" 
        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
        value={arValue}
        onChange={(e) => onChangeAr(e.target.value)}
      />
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">English</label>
      <input 
        type="text" 
        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm text-left"
        value={enValue}
        onChange={(e) => onChangeEn(e.target.value)}
        dir="ltr"
      />
    </div>
  </div>
);

export default AdminDashboard;