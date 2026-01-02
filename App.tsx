import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit,
  UserPlus, 
  FileText, 
  PieChart, 
  CheckCircle,
  Menu,
  X,
  Sparkles,
  School,
  BookOpen,
  Clock,
  Save,
  Upload,
  User as UserIcon,
  Download,
  Printer,
  TrendingUp,
  BarChart3,
  FileDown,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Key,
  Lock,
  UserCheck,
  GraduationCap,
  Database,
  RefreshCw,
  HardDrive,
  Layers,
  BookMarked,
  Activity,
  Eye,
  ClipboardList,
  ShieldAlert,
  Search,
  History,
  FileWarning,
  LayoutDashboard,
  FileBarChart,
  Gavel,
  VenetianMask,
  UserRound,
  LibraryBig
} from 'lucide-react';
import { PieChart as RPieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { db } from './services/db';
import { generateAttendanceInsight } from './services/ai';
import { AppState, AttendanceStatus, AttendanceRecord, Student, Teacher, Subject, StudentClass, Admin, ViolationCriterion, ViolationRecord, ViolationStaff } from './types';

// --- HELPERS ---
const getTodayDateString = () => new Date().toISOString().split('T')[0];
const getIndonesianDay = (dateStr: string) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[new Date(dateStr).getDay()];
};
const determinePeriod = () => {
  const hour = new Date().getHours();
  if (hour < 7) return 0;
  if (hour === 7) return 1;
  if (hour === 8) return 2;
  if (hour === 9) return 3;
  if (hour === 10) return 4;
  if (hour === 11) return 5;
  if (hour === 12) return 6;
  if (hour === 13) return 7;
  if (hour >= 14) return 8;
  return 1;
};

const formatTimestamp = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return "-";
  }
};

const getMonthName = (monthStr: string) => {
  if (!monthStr) return "";
  const [year, month] = monthStr.split('-');
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
};

// --- COMPONENTS ---

const Card = ({ children, className = '', id }: { children?: React.ReactNode; className?: string; id?: string }) => (
  <div id={id} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: any) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: any = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200",
    info: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200",
    warning: "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-100"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const DigitalClock = ({ className = "" }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className={`flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-mono font-bold ${className}`}>
      <Clock size={18} />
      {time.toLocaleTimeString('id-ID')}
    </div>
  );
};

// --- PAGES ---

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
    <div className="max-w-4xl w-full text-center space-y-12">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-1.5 rounded-full text-[11px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 shadow-sm animate-fade-in">
          <Sparkles size={14} /> Smart Education Portal
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
          SIPRESENSI <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SMAN 1 KWANYAR</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
          Masa depan pendidikan dimulai dengan disiplin digital. <br className="hidden md:block"/>
          Platform cerdas untuk mencatat kehadiran dan ketertiban.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <button onClick={() => onNavigate('attendance')} className="group p-8 bg-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-200 hover:scale-[1.02] transition-all duration-300 text-center flex flex-col items-center gap-4">
          <div className="p-4 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform"><CheckCircle size={32} /></div>
          <div><h3 className="text-xl font-black uppercase tracking-tight">Presensi</h3><p className="text-xs text-blue-100 font-medium opacity-80">Input Kehadiran</p></div>
        </button>
        <button onClick={() => onNavigate('violation')} className="group p-8 bg-white text-slate-900 rounded-[2rem] shadow-xl border border-slate-100 hover:scale-[1.02] transition-all duration-300 text-center flex flex-col items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:animate-bounce transition-transform"><ShieldAlert size={32} /></div>
          <div><h3 className="text-xl font-black uppercase tracking-tight">Pelanggaran</h3><p className="text-xs text-slate-400 font-medium">Ketertiban Siswa</p></div>
        </button>
        <button onClick={() => onNavigate('login')} className="group p-8 bg-white text-slate-900 rounded-[2rem] shadow-xl border border-slate-100 hover:scale-[1.02] transition-all duration-300 text-center flex flex-col items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:-rotate-12 transition-transform"><Lock size={32} /></div>
          <div><h3 className="text-xl font-black uppercase tracking-tight">Dashboard</h3><p className="text-xs text-slate-400 font-medium">Panel Admin</p></div>
        </button>
      </div>
      <div className="pt-8 opacity-40 text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Official Management System © 2024</div>
    </div>
  </div>
);

const ViolationPage = ({ onBack }: { onBack: () => void }) => {
  const [data, setData] = useState<AppState>(db.get());
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'input' | 'reports' | 'history' | 'criteria'>('dashboard');
  
  // Auth state for this page
  const [vUsername, setVUsername] = useState('');
  const [vPassword, setVPassword] = useState('');
  const [vError, setVError] = useState('');

  const stats = useMemo(() => {
    const total = data.violationRecords.length;
    const counts = { Ringan: 0, Sedang: 0, Berat: 0 };
    data.violationRecords.forEach(rec => {
      const crit = data.violationCriteria.find(c => c.id === rec.criterionId);
      if (crit) counts[crit.category]++;
    });
    return { total, ...counts };
  }, [data]);

  const chartData = [
    { name: 'Ringan', value: stats.Ringan, color: '#3b82f6' },
    { name: 'Sedang', value: stats.Sedang, color: '#f59e0b' },
    { name: 'Berat', value: stats.Berat, color: '#ef4444' },
  ];

  const [reportType, setReportType] = useState<'harian' | 'bulanan'>('harian');
  const [filterDate, setFilterDate] = useState(getTodayDateString());
  const [filterMonth, setFilterMonth] = useState(getTodayDateString().substring(0, 7));
  const [filterClassId, setFilterClassId] = useState('');

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCriterionId, setSelectedCriterionId] = useState('');
  const [violationNote, setViolationNote] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [vDate, setVDate] = useState(getTodayDateString());

  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(null);
  const [critForm, setCritForm] = useState({ name: '', category: 'Ringan' as any, points: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = () => setData(db.get());

  const filteredStudents = useMemo(() => data.students.filter(s => s.classId === selectedClassId), [data.students, selectedClassId]);
  const sortedRecords = useMemo(() => [...data.violationRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [data.violationRecords]);

  const filteredReportRecords = useMemo(() => {
    return data.violationRecords.filter(rec => {
      const matchesDate = reportType === 'harian' ? rec.date === filterDate : rec.date.startsWith(filterMonth);
      const student = data.students.find(s => s.id === rec.studentId);
      const matchesClass = !filterClassId || student?.classId === filterClassId;
      return matchesDate && matchesClass;
    });
  }, [data.violationRecords, reportType, filterDate, filterMonth, filterClassId, data.students]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = data.violationStaffs.find(s => s.username === vUsername && s.password === vPassword);
    const admin = data.admins.find(a => a.username === vUsername && a.password === vPassword);
    
    if (staff || admin) {
      setIsAuthorized(true);
      setVError('');
    } else {
      setVError('Username atau password salah.');
    }
  };

  const handleViolationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCriterionId || !reportedBy) { alert("Harap lengkapi semua data wajib."); return; }
    db.addViolationRecord({ studentId: selectedStudentId, criterionId: selectedCriterionId, date: vDate, note: violationNote, reportedBy: reportedBy });
    alert("Pelanggaran berhasil dicatat!");
    setViolationNote(''); setSelectedStudentId(''); refreshData(); setActiveTab('history');
  };

  const handleCriterionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCriterionId) {
      db.updateViolationCriterion(editingCriterionId, critForm as any);
      setEditingCriterionId(null);
    } else {
      db.addViolationCriterion(critForm as any);
    }
    setCritForm({ name: '', category: 'Ringan', points: 0 }); refreshData();
  };

  const startEditCriterion = (vc: ViolationCriterion) => { setEditingCriterionId(vc.id); setCritForm({ name: vc.name, category: vc.category, points: vc.points }); };
  const cancelEditCriterion = () => { setEditingCriterionId(null); setCritForm({ name: '', category: 'Ringan', points: 0 }); };
  const handleDeleteCriterion = (id: string) => { if (confirm("Hapus kriteria ini? Seluruh catatan riwayat dengan kriteria ini akan kehilangan referensinya.")) { db.deleteViolationCriterion(id); refreshData(); } };
  const handleDeleteRecord = (id: string) => { if (confirm("Hapus catatan riwayat ini?")) { db.deleteViolationRecord(id); refreshData(); } };
  
  const handlePrintReport = () => window.print();

  const handleExportViolationExcel = () => {
    let csv = "No,Tanggal,Nama Siswa,NIS,Kelas,Kategori,Jenis Pelanggaran,Poin,Pelapor,Keterangan\n";
    filteredReportRecords.forEach((rec, idx) => {
      const student = data.students.find(s => s.id === rec.studentId);
      const cls = data.classes.find(c => c.id === student?.classId);
      const crit = data.violationCriteria.find(c => c.id === rec.criterionId);
      csv += `${idx + 1},${rec.date},"${student?.name || '-'}",${student?.nis || '-'},"${cls?.name || '-'}",${crit?.category || '-'},"${crit?.name || '-'}",${crit?.points || 0},"${rec.reportedBy || '-'}","${rec.note || '-'}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_Pelanggaran_${reportType}_${reportType === 'harian' ? filterDate : filterMonth}.csv`);
    link.click();
  };

  const handleExportViolationWord = () => {
    const content = document.getElementById('printable-violation-report')?.innerHTML;
    if (!content) return;
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Laporan Ketertiban</title>
      <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 5px; text-align: left; font-size: 10pt; }
        .text-center { text-align: center; }
        .uppercase { text-transform: uppercase; }
        .underline { text-decoration: underline; }
      </style>
      </head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_Pelanggaran_${reportType}_${reportType === 'harian' ? filterDate : filterMonth}.doc`;
    link.click();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-10 border-0 shadow-2xl animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-4 shadow-inner">
              <ShieldAlert size={40} />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 uppercase tracking-widest">Login Ketertiban</h2>
            <p className="text-gray-400 text-xs font-bold mt-1 uppercase text-center">Akses Manajemen Pelanggaran</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Username Staff</label>
              <input type="text" required className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-orange-500 font-bold transition-all" value={vUsername} onChange={e => setVUsername(e.target.value)} placeholder="Username" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <input type="password" required className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-orange-500 font-bold transition-all" value={vPassword} onChange={e => setVPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {vError && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2.5 rounded-lg border border-red-100 uppercase tracking-wider">{vError}</p>}
            <div className="flex flex-col gap-3">
              <Button type="submit" variant="warning" className="w-full py-3.5 uppercase tracking-widest shadow-lg shadow-orange-100">Buka Manajemen</Button>
              <Button variant="secondary" onClick={onBack} className="w-full uppercase tracking-widest">Kembali ke Beranda</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10 no-print">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <ShieldAlert className="text-orange-600" /> 
             <div><h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">MANAJEMEN KETERTIBAN</h1><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SMAN 1 KWANYAR</p></div>
          </div>
          <button onClick={() => setIsAuthorized(false)} className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors uppercase tracking-wider">Logout</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8 no-print">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'input', label: 'Input Pelanggaran', icon: FileWarning },
            { id: 'reports', label: 'Laporan', icon: FileBarChart },
            { id: 'history', label: 'Riwayat', icon: History },
            { id: 'criteria', label: 'Kriteria & Poin', icon: ClipboardList }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-400 hover:bg-gray-100'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-orange-600 text-white border-0"><p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Pelanggaran</p><h3 className="text-4xl font-black mt-2">{stats.total}</h3></Card>
                <Card className="border-l-4 border-l-blue-500"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kategori Ringan</p><h3 className="text-3xl font-black text-blue-600 mt-2">{stats.Ringan}</h3></Card>
                <Card className="border-l-4 border-l-yellow-500"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kategori Sedang</p><h3 className="text-3xl font-black text-yellow-600 mt-2">{stats.Sedang}</h3></Card>
                <Card className="border-l-4 border-l-red-500"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kategori Berat</p><h3 className="text-3xl font-black text-red-600 mt-2">{stats.Berat}</h3></Card>
             </div>
             <div className="grid md:grid-cols-2 gap-8">
               <Card>
                 <h3 className="text-lg font-bold uppercase tracking-tight mb-6">Persentase Jenis Pelanggaran</h3>
                 <div className="h-64"><ResponsiveContainer width="100%" height="100%"><RPieChart><Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip /><Legend verticalAlign="bottom" height={36}/></RPieChart></ResponsiveContainer></div>
               </Card>
               <Card>
                  <h3 className="text-lg font-bold uppercase tracking-tight mb-6">Entri Pelanggaran Terakhir</h3>
                  <div className="space-y-4">
                    {sortedRecords.slice(0, 5).map(rec => {
                      const student = data.students.find(s => s.id === rec.studentId);
                      const crit = data.violationCriteria.find(c => c.id === rec.criterionId);
                      return (
                        <div key={rec.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                          <div><p className="font-bold text-gray-900">{student?.name}</p><p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{crit?.name}</p></div>
                          <p className="text-[10px] font-black text-gray-400 uppercase">{rec.date}</p>
                        </div>
                      );
                    })}
                    {data.violationRecords.length === 0 && <p className="text-center py-10 text-gray-300 italic">Belum ada aktivitas tercatat.</p>}
                  </div>
               </Card>
             </div>
          </div>
        )}

        {activeTab === 'input' && (
          <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
            <Card>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-6">Catat Pelanggaran Baru</h3>
              <form onSubmit={handleViolationSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Pilih Kelas</label>
                    <select required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-orange-500" value={selectedClassId} onChange={e => { setSelectedClassId(e.target.value); setSelectedStudentId(''); }}>
                      <option value="">-- Pilih Kelas --</option>
                      {data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nama Siswa</label>
                    <select required disabled={!selectedClassId} className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold disabled:opacity-50 outline-none focus:border-orange-500" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
                      <option value="">-- Pilih Siswa --</option>
                      {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Jenis Pelanggaran</label>
                  <select required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-orange-500" value={selectedCriterionId} onChange={e => setSelectedCriterionId(e.target.value)}>
                    <option value="">-- Pilih Kriteria --</option>
                    {data.violationCriteria.map(v => <option key={v.id} value={v.id}>[{v.category}] {v.name} ({v.points} Poin)</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tanggal Kejadian</label>
                    <input type="date" required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-orange-500" value={vDate} onChange={e => setVDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Dilaporkan Oleh</label>
                    <input required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-orange-500" value={reportedBy} onChange={e => setReportedBy(e.target.value)} placeholder="Nama Guru / Petugas" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Keterangan Tambahan</label>
                  <textarea className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-medium outline-none focus:border-orange-500 min-h-[100px]" value={violationNote} onChange={e => setViolationNote(e.target.value)} placeholder="Detail kronologi pelanggaran..."></textarea>
                </div>
                <Button type="submit" variant="warning" className="w-full py-4 text-sm font-black uppercase tracking-[0.2em] shadow-xl">SIMPAN CATATAN</Button>
              </form>
            </Card>
            <div className="space-y-6">
              <Card className="bg-orange-50 border-orange-100">
                <div className="flex items-center gap-3 text-orange-700 mb-4"><ShieldAlert size={24} /><h3 className="text-lg font-bold uppercase tracking-tight">Info Kedisiplinan</h3></div>
                <p className="text-sm font-medium text-orange-800 leading-relaxed">Pencatatan pelanggaran bersifat kumulatif. Siswa dengan poin tertentu akan mendapatkan pembinaan khusus sesuai dengan tata tertib sekolah.</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-white p-3 rounded-xl border border-orange-200 text-center"><p className="text-[9px] font-black text-gray-400 uppercase">Ringan</p><p className="text-xs font-bold text-orange-600">2 - 10 Poin</p></div>
                  <div className="bg-white p-3 rounded-xl border border-orange-200 text-center"><p className="text-[9px] font-black text-gray-400 uppercase">Sedang</p><p className="text-xs font-bold text-orange-600">11 - 30 Poin</p></div>
                  <div className="bg-white p-3 rounded-xl border border-orange-200 text-center"><p className="text-[9px] font-black text-gray-400 uppercase">Berat</p><p className="text-xs font-bold text-orange-600">&gt; 30 Poin</p></div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
             <Card className="no-print">
               <div className="flex flex-wrap gap-4 items-end">
                 <div className="w-full md:w-auto">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Jenis Laporan</label>
                    <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl border">
                      <button onClick={() => setReportType('harian')} className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${reportType === 'harian' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>Harian</button>
                      <button onClick={() => setReportType('bulanan')} className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${reportType === 'bulanan' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>Bulanan</button>
                    </div>
                 </div>
                 <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Pilih Kelas (Opsional)</label>
                    <select className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none" value={filterClassId} onChange={e => setFilterClassId(e.target.value)}>
                      <option value="">Semua Kelas</option>
                      {data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div className="w-full md:w-48">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{reportType === 'harian' ? 'Pilih Tanggal' : 'Pilih Bulan'}</label>
                    {reportType === 'harian' ? <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none" /> : <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none" />}
                 </div>
                 <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Button onClick={handlePrintReport} className="uppercase tracking-widest text-[10px] px-4 h-[48px]"><Printer size={16} /> PDF</Button>
                    <Button onClick={handleExportViolationWord} variant="info" className="uppercase tracking-widest text-[10px] px-4 h-[48px]"><FileDown size={16} /> Word</Button>
                    <Button onClick={handleExportViolationExcel} variant="success" className="uppercase tracking-widest text-[10px] px-4 h-[48px]"><FileText size={16} /> Excel</Button>
                 </div>
               </div>
             </Card>
             <Card id="printable-violation-report" className="print:shadow-none print:border-0 min-h-[600px]">
               <div className="text-center mb-10 border-b-2 border-gray-200 pb-6"><h2 className="text-2xl font-black uppercase tracking-tight">LAPORAN KETERTIBAN SISWA</h2><p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">SMAN 1 KWANYAR</p><div className="mt-4 flex justify-center gap-6 text-[10px] font-black uppercase text-gray-600"><span>Periode: {reportType === 'harian' ? filterDate : getMonthName(filterMonth)}</span><span>Kelas: {filterClassId ? data.classes.find(c => c.id === filterClassId)?.name : 'Semua Kelas'}</span></div></div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm border-collapse border border-gray-300">
                   <thead className="bg-gray-50 border-b text-[10px] font-black uppercase tracking-widest text-gray-400"><tr><th className="p-4 w-12 text-center border">No</th><th className="p-4 border">Tanggal</th><th className="p-4 border">Nama Siswa / Kelas</th><th className="p-4 border">Jenis Pelanggaran</th><th className="p-4 text-center border">Poin</th><th className="p-4 border">Keterangan</th></tr></thead>
                   <tbody className="divide-y font-bold">
                     {filteredReportRecords.map((rec, idx) => {
                       const student = data.students.find(s => s.id === rec.studentId);
                       const cls = data.classes.find(c => c.id === student?.classId);
                       const crit = data.violationCriteria.find(c => c.id === rec.criterionId);
                       return (<tr key={rec.id} className="hover:bg-gray-50/50"><td className="p-4 text-center text-gray-400 border">{idx + 1}</td><td className="p-4 font-mono text-[11px] text-gray-500 whitespace-nowrap border">{rec.date}</td><td className="p-4 border"><p className="text-gray-900">{student?.name}</p><p className="text-[10px] text-orange-600 uppercase tracking-widest">{cls?.name}</p></td><td className="p-4 border"><p className="text-gray-900">{crit?.name}</p><span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-tighter ${crit?.category === 'Berat' ? 'bg-red-100 text-red-600' : crit?.category === 'Sedang' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{crit?.category}</span></td><td className="p-4 text-center text-red-600 border">{crit?.points}</td><td className="p-4 text-xs font-medium text-gray-500 italic max-w-[200px] truncate border">{rec.note || '-'}</td></tr>);
                     })}
                     {filteredReportRecords.length === 0 && (<tr><td colSpan={6} className="p-20 text-center text-gray-300 italic">Tidak ada data pelanggaran ditemukan untuk kriteria filter ini.</td></tr>)}
                   </tbody>
                 </table>
               </div>
               <div className="mt-12 flex justify-end print:block hidden"><div className="text-center w-64 border-t border-gray-200 pt-4"><p className="text-xs font-bold uppercase">Kepala Sekolah,</p><div className="h-20"></div><p className="text-xs font-black uppercase underline">{data.headmaster.name}</p><p className="text-[10px] font-bold text-gray-400">NIP. {data.headmaster.nip}</p></div></div>
             </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <Card className="animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
               <h3 className="text-lg font-bold uppercase tracking-tight">Seluruh Riwayat Pelanggaran</h3>
               <div className="relative w-full md:w-64"><Search size={16} className="absolute left-3 top-3 text-gray-400" /><input className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-xl font-bold text-xs" placeholder="Cari nama siswa..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-[10px]"><tr><th className="p-4">Tanggal</th><th className="p-4">Siswa</th><th className="p-4">Pelanggaran</th><th className="p-4 text-center">Poin</th><th className="p-4">Pelapor</th><th className="p-4 text-right">Aksi</th></tr></thead>
                 <tbody className="divide-y font-bold">
                   {sortedRecords.filter(r => { const s = data.students.find(st => st.id === r.studentId); return s?.name.toLowerCase().includes(searchQuery.toLowerCase()); }).map(rec => {
                     const student = data.students.find(s => s.id === rec.studentId);
                     const cls = data.classes.find(c => c.id === student?.classId);
                     const crit = data.violationCriteria.find(c => c.id === rec.criterionId);
                     return (<tr key={rec.id} className="hover:bg-gray-50 transition-colors"><td className="p-4 text-gray-400 font-mono text-xs">{rec.date}</td><td className="p-4"><p className="text-gray-900">{student?.name}</p><p className="text-[10px] text-gray-400 uppercase tracking-widest">{cls?.name}</p></td><td className="p-4"><span className={`text-[10px] px-2 py-0.5 rounded-full mr-2 ${crit?.category === 'Berat' ? 'bg-red-100 text-red-600' : crit?.category === 'Sedang' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{crit?.category}</span>{crit?.name}</td><td className="p-4 text-center text-orange-600">{crit?.points}</td><td className="p-4 text-gray-500 text-xs">{rec.reportedBy}</td><td className="p-4 text-right"><button onClick={() => handleDeleteRecord(rec.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"><Trash2 size={16} /></button></td></tr>);
                   })}
                   {data.violationRecords.length === 0 && (<tr><td colSpan={6} className="p-20 text-center text-gray-300 italic">Belum ada data riwayat pelanggaran.</td></tr>)}
                 </tbody>
               </table>
             </div>
          </Card>
        )}

        {activeTab === 'criteria' && (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
             <Card className="lg:col-span-1">
                <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold uppercase tracking-tight">{editingCriterionId ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}</h3>{editingCriterionId && <button onClick={cancelEditCriterion} className="text-gray-400 hover:text-red-500"><X size={18}/></button>}</div>
                <form className="space-y-4" onSubmit={handleCriterionSubmit}>
                  <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nama Kriteria</label><input required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-orange-500" placeholder="Misal: Tidak memakai atribut upacara" value={critForm.name} onChange={e => setCritForm({...critForm, name: e.target.value})} /></div>
                  <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Kategori</label><select required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-orange-500" value={critForm.category} onChange={e => setCritForm({...critForm, category: e.target.value as any})}>
                      <option value="Ringan">Ringan</option><option value="Sedang">Sedang</option><option value="Berat">Berat</option>
                    </select></div>
                  <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Poin Pelanggaran</label><input type="number" required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-orange-500" placeholder="0" value={critForm.points} onChange={e => setCritForm({...critForm, points: parseInt(e.target.value) || 0})} /></div>
                  <div className="flex flex-col gap-2"><Button type="submit" className="w-full uppercase tracking-widest shadow-lg">{editingCriterionId ? 'Update Kriteria' : 'Tambah Kriteria'}</Button>{editingCriterionId && <Button onClick={cancelEditCriterion} variant="secondary" className="w-full uppercase tracking-widest">Batal</Button>}</div>
                </form>
             </Card>
             <Card className="lg:col-span-2">
                <h3 className="text-lg font-bold uppercase tracking-tight mb-6">Daftar Kriteria & Bobot Poin</h3>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-[10px]"><tr><th className="p-4">Kriteria Pelanggaran</th><th className="p-4">Kategori</th><th className="p-4 text-center">Poin</th><th className="p-4 text-right">Aksi</th></tr></thead>
                      <tbody className="divide-y font-bold">
                        {data.violationCriteria.map(vc => (
                          <tr key={vc.id} className={`hover:bg-gray-50 transition-colors ${editingCriterionId === vc.id ? 'bg-orange-50' : ''}`}><td className="p-4 text-gray-900">{vc.name}</td><td className="p-4"><span className={`text-[10px] px-2 py-0.5 rounded-full ${vc.category === 'Berat' ? 'bg-red-100 text-red-600' : vc.category === 'Sedang' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{vc.category}</span></td><td className="p-4 text-center text-orange-600">{vc.points}</td><td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => startEditCriterion(vc)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all"><Edit size={16} /></button><button onClick={() => handleDeleteCriterion(vc.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"><Trash2 size={16} /></button></div></td></tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </Card>
          </div>
        )}
      </main>
    </div>
  );
};

const AttendancePage = ({ onBack, loggedInTeacherId }: { onBack: () => void, loggedInTeacherId?: string }) => {
  const [data, setData] = useState<AppState>(db.get());
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(loggedInTeacherId || '');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [journalNote, setJournalNote] = useState('');
  const [period, setPeriod] = useState(determinePeriod());
  
  const date = getTodayDateString();
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const currentTeacher = useMemo(() => data.teachers.find(t => t.id === selectedTeacher), [data.teachers, selectedTeacher]);
  const filteredClasses = useMemo(() => {
    if (!selectedGrade) return [];
    let classes = data.classes.filter(c => c.name.startsWith(selectedGrade));
    if (loggedInTeacherId && currentTeacher?.classIds) classes = classes.filter(c => currentTeacher.classIds.includes(c.id));
    return classes;
  }, [data.classes, selectedGrade, loggedInTeacherId, currentTeacher]);

  const filteredTeachers = useMemo(() => {
    if (!selectedClass) return [];
    return data.teachers.filter(t => t.classIds && t.classIds.includes(selectedClass));
  }, [data.teachers, selectedClass]);

  const filteredStudents = useMemo(() => data.students.filter(s => s.classId === selectedClass), [data.students, selectedClass]);
  const teacherSubjects = useMemo(() => {
    if (!selectedTeacher) return [];
    const teacher = data.teachers.find(t => t.id === selectedTeacher);
    if (!teacher) return [];
    return data.subjects.filter(s => teacher.subjectIds.includes(s.id));
  }, [selectedTeacher, data.teachers, data.subjects]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => { setAttendanceMap(prev => ({ ...prev, [studentId]: status })); };
  const setAll = (status: AttendanceStatus) => { const newMap: Record<string, AttendanceStatus> = {}; filteredStudents.forEach(s => newMap[s.id] = status); setAttendanceMap(newMap); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedTeacher || !selectedSubject) { alert("Mohon lengkapi data Guru, Mapel, dan Kelas."); return; }
    try {
      const record: AttendanceRecord = { id: crypto.randomUUID(), date, day: getIndonesianDay(date), timestamp: new Date().toISOString(), period, teacherId: selectedTeacher, subjectId: selectedSubject, classId: selectedClass, journalNote: journalNote, details: filteredStudents.map(s => ({ studentId: s.id, status: attendanceMap[s.id] || AttendanceStatus.ALPA })) };
      db.submitAttendance(record); setSubmissionStatus('success');
      setTimeout(() => { setSubmissionStatus('idle'); onBack(); }, 3000);
    } catch (err) { console.error(err); setSubmissionStatus('error'); }
  };

  if (submissionStatus === 'success') {
    return (<div className="min-h-screen flex items-center justify-center bg-green-50"><div className="text-center p-8"><div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"><CheckCircle size={40} className="text-green-600" /></div><h2 className="text-3xl font-bold text-green-900 mb-2">Presensi Berhasil Disimpan!</h2><p className="text-green-700 font-medium">Terima kasih telah mengisi jurnal dan presensi.</p></div></div>);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10 no-print">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><Calendar className="text-blue-600" /> <div><h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Presensi SMAN 1 KWANYAR</h1><p className="text-xs text-gray-500 font-bold uppercase">{getIndonesianDay(date)}, {date}</p></div></div>
          <div className="flex items-center gap-4"><DigitalClock className="hidden sm:flex" /><button onClick={onBack} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider">Keluar</button></div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Jenjang</label><select required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-blue-500" value={selectedGrade} onChange={e => { setSelectedGrade(e.target.value); setSelectedClass(''); if (!loggedInTeacherId) setSelectedTeacher(''); }}><option value="">-- Pilih Jenjang --</option><option value="X">Kelas X</option><option value="XI">Kelas XI</option><option value="XII">Kelas XII</option></select></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kelas</label><select required disabled={!selectedGrade} className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold disabled:opacity-50 outline-none focus:border-blue-500" value={selectedClass} onChange={e => { setSelectedClass(e.target.value); if (!loggedInTeacherId) { setSelectedTeacher(''); setSelectedSubject(''); } setAttendanceMap({}); }}><option value="">{selectedGrade ? '-- Pilih Kelas --' : '-- Pilih Jenjang Dulu --'}</option>{filteredClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              {!loggedInTeacherId ? (<div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Guru Pengajar</label><select required disabled={!selectedClass} className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold disabled:opacity-50 outline-none focus:border-blue-500" value={selectedTeacher} onChange={e => { setSelectedTeacher(e.target.value); setSelectedSubject(''); }}><option value="">{selectedClass ? '-- Pilih Guru --' : '-- Pilih Kelas Dulu --'}</option>{filteredTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>) : (<div className="bg-blue-50 p-3 rounded-xl border border-blue-100"><label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Guru Pengajar (Otomatis)</label><p className="font-bold text-blue-700">{currentTeacher?.name}</p></div>)}
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mata Pelajaran</label><select required disabled={!selectedTeacher} className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold disabled:opacity-50 outline-none focus:border-blue-500" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}><option value="">{selectedTeacher ? '-- Pilih Mapel --' : '-- Pilih Guru Dulu --'}</option>{teacherSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Jam Ke-</label><input type="number" min="1" max="12" required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-white font-bold outline-none focus:border-blue-500" value={period} onChange={e => setPeriod(Number(e.target.value))} /></div>
            </div>
          </Card>
          {selectedClass && (
            <div className="space-y-6">
              <Card><div className="flex items-center gap-2 mb-3"><BookOpen className="text-orange-500" size={20} /><h3 className="text-lg font-bold text-gray-800">Jurnal Kelas</h3></div><textarea required className="w-full p-4 border-2 border-gray-100 rounded-xl bg-gray-50 h-32 focus:border-blue-500 outline-none font-medium text-gray-700" placeholder="Tuliskan ringkasan materi pembelajaran..." value={journalNote} onChange={e => setJournalNote(e.target.value)}></textarea></Card>
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2"><h3 className="text-lg font-bold text-gray-800">Daftar Siswa ({filteredStudents.length})</h3><button type="button" onClick={() => setAll(AttendanceStatus.HADIR)} className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all uppercase tracking-wider">Tandai Semua Hadir</button></div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {filteredStudents.length === 0 ? (<div className="p-8 text-center text-gray-400 font-bold italic">Belum ada data siswa untuk kelas yang dipilih.</div>) : (filteredStudents.map((student, idx) => (
                    <div key={student.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold text-gray-500">{idx + 1}</span><div><p className="font-bold text-gray-900 leading-tight">{student.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{student.nis} | {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p></div></div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { s: AttendanceStatus.HADIR, l: 'HADIR' }, { s: AttendanceStatus.IZIN, l: 'IZIN' }, { s: AttendanceStatus.SAKIT, l: 'SAKIT' }, { s: AttendanceStatus.DISPENSASI, l: 'DISPEN' }, { s: AttendanceStatus.ALPA, l: 'ALPHA' }
                        ].map(({ s, l }) => {
                           const isSelected = attendanceMap[student.id] === s;
                           let colorClass = "bg-white text-gray-600 border-gray-200 hover:bg-gray-100";
                           if (isSelected) {
                              if (s === AttendanceStatus.HADIR) colorClass = "bg-green-600 text-white border-green-600 shadow-md";
                              else if (s === AttendanceStatus.SAKIT) colorClass = "bg-yellow-500 text-white border-yellow-500 shadow-md";
                              else if (s === AttendanceStatus.IZIN) colorClass = "bg-blue-500 text-white border-blue-500 shadow-md";
                              else if (s === AttendanceStatus.DISPENSASI) colorClass = "bg-purple-500 text-white border-purple-500 shadow-md";
                              else colorClass = "bg-red-500 text-white border-red-500 shadow-md";
                           }
                           return (<button key={s} type="button" onClick={() => handleStatusChange(student.id, s)} className={`px-4 py-2 text-xs sm:text-sm rounded-xl border-2 transition-all font-black flex items-center justify-center ${colorClass}`}>{l}</button>);
                        })}
                      </div>
                    </div>
                  )))}
                </div>
                <div className="sticky bottom-6 flex justify-end"><Button type="submit" variant="success" className="py-4 px-10 text-lg shadow-xl uppercase tracking-widest"><Save size={24} /> SIMPAN DATA</Button></div>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

const UnifiedLogin = ({ onLogin, onBack }: { onLogin: (type: 'admin' | 'teacher', id: string) => void, onBack: () => void }) => {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); const data = db.get();
    const admin = data.admins.find(a => a.username === username && a.password === pass);
    if (admin) { onLogin('admin', admin.id); return; }
    const teacher = data.teachers.find(t => t.username === username && t.password === pass);
    if (teacher) { onLogin('teacher', teacher.id); return; }
    setErr('Username atau Password salah!');
  };
  return (<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4"><Card className="w-full max-w-md p-10 border-0 shadow-2xl"><div className="flex flex-col items-center mb-8"><div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-inner"><ShieldCheck size={40} /></div><h2 className="text-2xl font-bold text-center text-gray-800 uppercase tracking-widest">Portal Login</h2><p className="text-gray-400 text-xs font-bold mt-1 uppercase text-center">Akses Admin & Guru Pengajar</p></div><form onSubmit={handleLogin} className="space-y-6"><div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label><input type="text" required className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold transition-all" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" /></div><div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label><input type="password" required className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold transition-all" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" /></div>{err && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2.5 rounded-lg border border-red-100 uppercase tracking-wider">{err}</p>}<div className="flex flex-col gap-3"><Button type="submit" className="w-full py-3.5 uppercase tracking-widest shadow-lg">Masuk Dashboard</Button><Button variant="secondary" onClick={onBack} className="w-full uppercase tracking-widest">Batal</Button></div></form></Card></div>);
};

const DataManagement = ({ data, onRefresh }: { data: AppState, onRefresh: () => void }) => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'student' | 'class' | 'subject'>('teacher');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const teacherImportRef = useRef<HTMLInputElement>(null);
  const studentImportRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const itemsPerPage = 20;

  const currentItems = useMemo(() => {
    let baseData: any[] = [];
    if (activeTab === 'teacher') baseData = data.teachers;
    else if (activeTab === 'student') baseData = data.students;
    else if (activeTab === 'class') baseData = data.classes;
    else if (activeTab === 'subject') baseData = data.subjects;
    const start = (currentPage - 1) * itemsPerPage;
    return baseData.slice(start, start + itemsPerPage);
  }, [activeTab, data, currentPage]);

  const totalPages = useMemo(() => {
    let count = 0;
    if (activeTab === 'teacher') count = data.teachers.length;
    else if (activeTab === 'student') count = data.students.length;
    else if (activeTab === 'class') count = data.classes.length;
    else if (activeTab === 'subject') count = data.subjects.length;
    return Math.ceil(count / itemsPerPage);
  }, [activeTab, data]);

  const toggleSelect = (id: string) => { setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]); };
  const toggleSelectAll = () => { if (selectedIds.length === currentItems.length) { setSelectedIds([]); } else { setSelectedIds(currentItems.map(item => item.id)); } };
  const handleBulkDelete = () => { if (!confirm(`Hapus ${selectedIds.length} data terpilih secara massal?`)) return; selectedIds.forEach(id => { if (activeTab === 'teacher') db.deleteTeacher(id); else if (activeTab === 'student') db.deleteStudent(id); else if (activeTab === 'class') db.deleteClass(id); else if (activeTab === 'subject') db.deleteSubject(id); }); setSelectedIds([]); onRefresh(); };
  const downloadTeacherTemplate = () => { const csvContent = "Nama,NIP,Username,Password\nBudi Santoso S.Pd,19800101,budi_80,pass123\nSiti Aminah M.Pd,19850202,siti_85,pass456"; const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.setAttribute("download", "Template_Impor_Guru_SMAN1Kwanyar.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link); };
  const downloadStudentTemplate = () => { const csvContent = "Nama,NIS,Nama Kelas,L/P\nAchmad Fikri,1001,X MIPA 1,L\nDewi Sartika,1002,X MIPA 1,P"; const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.setAttribute("download", "Template_Impor_Siswa_SMAN1Kwanyar.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link); };
  
  const handleImportTeachers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = (event) => { try { const text = event.target?.result as string; const lines = text.split('\n').filter(l => l.trim() !== ''); const newTeachers = lines.slice(1).map(line => { const [name, nip, username, password] = line.split(',').map(s => s.trim()); return { name, nip, username, password, classIds: [], subjectIds: [] }; }); db.bulkAddTeachers(newTeachers); onRefresh(); alert(`Berhasil mengimpor ${newTeachers.length} data guru.`); } catch (err) { alert("Gagal memproses file."); } };
    reader.readAsText(file); e.target.value = '';
  };

  const handleImportStudents = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = (event) => { try { const text = event.target?.result as string; const lines = text.split('\n').filter(l => l.trim() !== ''); const newStudents: any[] = []; lines.slice(1).forEach(line => { const [name, nis, className, gender] = line.split(',').map(s => s.trim()); const cls = data.classes.find(c => c.name.toLowerCase() === className.toLowerCase()); if (cls) { newStudents.push({ name, nis, classId: cls.id, gender: (gender?.toUpperCase() === 'P' ? 'P' : 'L') }); } }); db.bulkAddStudents(newStudents); onRefresh(); alert(`Berhasil mengimpor ${newStudents.length} data siswa.`); } catch (err) { alert("Gagal memproses file."); } };
    reader.readAsText(file); e.target.value = '';
  };

  const handleDelete = (type: string, id: string) => { if (!confirm(`Hapus ${type} ini?`)) return; if (type === 'teacher') db.deleteTeacher(id); else if (type === 'student') db.deleteStudent(id); else if (type === 'class') db.deleteClass(id); else if (type === 'subject') db.deleteSubject(id); onRefresh(); };
  const openAdd = () => { setEditingId(null); if (activeTab === 'teacher') setFormData({ name: '', nip: '', username: '', password: '', classIds: [], subjectIds: [] }); else if (activeTab === 'student') setFormData({ name: '', nis: '', classId: '', gender: 'L' }); else setFormData({ name: '' }); setShowModal(true); };
  const openEdit = (item: any) => { setEditingId(item.id); setFormData({ ...item }); setShowModal(true); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (activeTab === 'teacher') { editingId ? db.updateTeacher(editingId, formData) : db.addTeacher(formData); } else if (activeTab === 'student') { editingId ? db.updateStudent(editingId, formData) : db.addStudent(formData); } else if (activeTab === 'class') { editingId ? db.updateClass(editingId, formData) : db.addClass(formData); } else if (activeTab === 'subject') { editingId ? db.updateSubject(editingId, formData) : db.addSubject(formData); } setShowModal(false); onRefresh(); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2">
        <div className="flex gap-4">{[{ id: 'teacher', label: 'Guru', icon: GraduationCap }, { id: 'student', label: 'Siswa', icon: Users }, { id: 'class', label: 'Kelas', icon: Layers }, { id: 'subject', label: 'Mapel', icon: BookMarked }].map(tab => (<button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setCurrentPage(1); setSelectedIds([]); }} className={`pb-2 px-2 flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}><tab.icon size={14} /> {tab.label}</button>))}</div>
        <div className="flex flex-wrap gap-2">{activeTab === 'teacher' && (<><Button onClick={downloadTeacherTemplate} variant="secondary" className="text-xs uppercase tracking-wider"><FileDown size={16} /> Template</Button><input type="file" ref={teacherImportRef} onChange={handleImportTeachers} accept=".csv" className="hidden" /><Button onClick={() => teacherImportRef.current?.click()} variant="success" className="text-xs uppercase tracking-wider"><Upload size={16} /> Import Guru</Button></>)}{activeTab === 'student' && (<><Button onClick={downloadStudentTemplate} variant="secondary" className="text-xs uppercase tracking-wider"><FileDown size={16} /> Template</Button><input type="file" ref={studentImportRef} onChange={handleImportStudents} accept=".csv" className="hidden" /><Button onClick={() => studentImportRef.current?.click()} variant="success" className="text-xs uppercase tracking-wider"><Upload size={16} /> Import Siswa</Button></>)}{selectedIds.length > 0 && (<Button onClick={handleBulkDelete} variant="danger" className="text-xs uppercase tracking-wider"><Trash2 size={16} /> Hapus ({selectedIds.length})</Button>)}<Button onClick={openAdd} variant="primary" className="text-xs uppercase tracking-wider"><Plus size={16} /> Tambah {activeTab === 'teacher' ? 'Guru' : activeTab === 'student' ? 'Siswa' : activeTab === 'class' ? 'Kelas' : 'Mapel'}</Button></div>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[9px]"><tr><th className="p-4 w-10"><input type="checkbox" checked={selectedIds.length === currentItems.length && currentItems.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300" /></th><th className="p-4">Identitas</th>{activeTab === 'teacher' && <th className="p-4">NIP / Akun</th>}{activeTab === 'student' && <th className="p-4">NIS / Kelas</th>}<th className="p-4 text-right">Aksi</th></tr></thead><tbody className="divide-y font-bold">{currentItems.map(item => (<tr key={item.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50/50' : ''}`}><td className="p-4"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded border-gray-300" /></td><td className="p-4 text-gray-900">{item.name}{activeTab === 'student' && <span className="text-[10px] text-gray-400 ml-2 font-bold uppercase">{item.gender}</span>}</td>{activeTab === 'teacher' && (<td className="p-4"><p className="text-gray-400 text-xs font-mono">{item.nip || '-'}</p>{item.username && <p className="text-[9px] text-blue-500 uppercase tracking-widest mt-0.5">Akun: @{item.username}</p>}</td>)}{activeTab === 'student' && <td className="p-4 text-gray-400 text-xs font-mono">{item.nis} | {data.classes.find(c => c.id === item.classId)?.name}</td>}<td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16}/></button><button onClick={() => handleDelete(activeTab, item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16}/></button></div></td></tr>))}{currentItems.length === 0 && (<tr><td colSpan={5} className="p-10 text-center text-gray-400 italic">Belum ada data.</td></tr>)}</tbody></table></div>
        {totalPages > 1 && (<div className="p-4 bg-gray-50 flex items-center justify-between border-t"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Halaman {currentPage} dari {totalPages}</span><div className="flex gap-1"><button disabled={currentPage === 1} onClick={() => { setCurrentPage(prev => prev - 1); setSelectedIds([]); }} className="p-2 hover:bg-white rounded-lg disabled:opacity-30 border transition-all shadow-sm"><ChevronLeft size={16} /></button><button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(prev => prev + 1); setSelectedIds([]); }} className="p-2 hover:bg-white rounded-lg disabled:opacity-30 border transition-all shadow-sm"><ChevronRight size={16} /></button></div></div>)}
      </Card>
      {showModal && (<div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"><Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"><h3 className="text-xl font-bold mb-6 tracking-tight uppercase">{editingId ? 'Edit' : 'Tambah'} {activeTab.toUpperCase()}</h3><form onSubmit={handleSubmit} className="space-y-6"><div className="grid md:grid-cols-2 gap-6"><div className="space-y-4"><h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-1">Data Personal</h4><div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama {activeTab}</label><input required className="w-full p-3 border rounded-xl font-bold bg-gray-50 outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>{activeTab === 'teacher' && (<div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">NIP</label><input className="w-full p-3 border rounded-xl font-bold bg-gray-50 outline-none focus:border-blue-500" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} /></div>)}{activeTab === 'student' && (<><div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">NIS</label><input required className="w-full p-3 border rounded-xl font-bold bg-gray-50" value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} /></div><div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kelas</label><select required className="w-full p-3 border rounded-xl font-bold bg-gray-50" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})}><option value="">-- Pilih Kelas --</option>{data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div></>)}</div><div className="space-y-4">{activeTab === 'teacher' ? (<> <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-1">Akses Portal Guru</h4> <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Username Login</label><input className="w-full p-3 border rounded-xl font-bold bg-white outline-none focus:border-blue-500" value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="username login" /></div> <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label><input className="w-full p-3 border rounded-xl font-bold bg-white outline-none focus:border-blue-500" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} /></div> </>) : activeTab === 'student' ? (<> <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-1">Detail</h4> <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Gender</label><select className="w-full p-3 border rounded-xl font-bold bg-gray-50" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div> </>) : (<p className="text-gray-400 italic text-xs">Tidak ada data tambahan.</p>)}</div></div>{activeTab === 'teacher' && (<div className="grid grid-cols-2 gap-4 pt-4 border-t"><div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kelas Diajar</label><div className="max-h-32 overflow-y-auto space-y-1">{data.classes.map(c => (<label key={c.id} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={formData.classIds?.includes(c.id)} onChange={e => { const ids = formData.classIds || []; setFormData({...formData, classIds: e.target.checked ? [...ids, c.id] : ids.filter((id: string) => id !== c.id)}); }} /> {c.name}</label>))}</div></div><div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mapel Diampu</label><div className="max-h-32 overflow-y-auto space-y-1">{data.subjects.map(s => (<label key={s.id} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={formData.subjectIds?.includes(s.id)} onChange={e => { const ids = formData.subjectIds || []; setFormData({...formData, subjectIds: e.target.checked ? [...ids, s.id] : ids.filter((id: string) => id !== s.id)}); }} /> {s.name}</label>))}</div></div></div>)}<div className="pt-4 flex justify-end gap-3 border-t"><Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button><Button type="submit">Simpan</Button></div></form></Card></div>)}
    </div>
  );
};

const AdminSettings = ({ currentAdmin, admins, teachers, violationStaffs, onRefresh }: { currentAdmin: Admin, admins: Admin[], teachers: Teacher[], violationStaffs: ViolationStaff[], onRefresh: () => void }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'teacher' | 'violation'>('admin');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const openAdd = () => { 
    setFormData(activeTab === 'admin' ? { username: '', password: '', name: '' } : activeTab === 'teacher' ? { id: '', username: '', password: '' } : { username: '', password: '', name: '' }); 
    setEditingId(null); 
    setShowModal(true); 
  };
  const openEdit = (item: any) => { 
    setFormData({ ...item }); 
    setEditingId(item.id); 
    setShowModal(true); 
  };
  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (activeTab === 'admin') { 
      editingId ? db.updateAdmin(editingId, formData) : db.addAdmin(formData); 
    } else if (activeTab === 'teacher') { 
      db.updateTeacher(formData.id, { username: formData.username, password: formData.password }); 
    } else {
      editingId ? db.updateViolationStaff(editingId, formData) : db.addViolationStaff(formData);
    }
    onRefresh(); setShowModal(false); 
  };
  const handleDelete = (id: string) => { 
    if (activeTab === 'admin' && id === currentAdmin.id) return alert("Akun aktif."); 
    if (confirm("Hapus akun ini?")) { 
      try { 
        if (activeTab === 'admin') db.deleteAdmin(id); 
        else if (activeTab === 'teacher') db.updateTeacher(id, { username: '', password: '' }); 
        else db.deleteViolationStaff(id);
        onRefresh(); 
      } catch (err: any) { alert(err.message); } 
    } 
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl overflow-hidden relative"><div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={120} /></div><div className="flex items-center gap-6 relative z-10"><div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 backdrop-blur-sm"><UserIcon size={40} /></div><div><h3 className="text-2xl font-bold tracking-tight">{currentAdmin.name}</h3><p className="text-blue-100 font-medium tracking-wide">Administrator | @{currentAdmin.username}</p><div className="mt-3 flex gap-2"><button onClick={() => openEdit(currentAdmin)} className="text-[10px] bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest transition-all flex items-center gap-2"><Key size={14}/> Profil</button></div></div></div></Card>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('admin')} className={`pb-2 px-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'admin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>Admin</button>
            <button onClick={() => setActiveTab('teacher')} className={`pb-2 px-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'teacher' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>Guru</button>
            <button onClick={() => setActiveTab('violation')} className={`pb-2 px-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'violation' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>Akun Ketertiban</button>
          </div>
          <Button onClick={openAdd} variant="primary" className="text-xs uppercase tracking-wider"><Plus size={16}/> Baru</Button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[9px]"><tr><th className="p-4">User</th><th className="p-4">Username</th><th className="p-4 text-right">Aksi</th></tr></thead>
            <tbody className="divide-y font-bold">
              {activeTab === 'admin' && admins.map(a => (<tr key={a.id} className="hover:bg-gray-50"><td className="p-4 flex items-center gap-3">{a.name}</td><td className="p-4 text-gray-400 font-mono">@{a.username}</td><td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => openEdit(a)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16}/></button><button onClick={() => handleDelete(a.id)} disabled={a.id === currentAdmin.id} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16}/></button></div></td></tr>))}
              {activeTab === 'teacher' && teachers.filter(t => t.username).map(t => (<tr key={t.id} className="hover:bg-gray-50"><td className="p-4">{t.name}</td><td className="p-4 text-gray-400 font-mono">@{t.username}</td><td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => openEdit(t)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16}/></button><button onClick={() => handleDelete(t.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16}/></button></div></td></tr>))}
              {activeTab === 'violation' && violationStaffs.map(vs => (<tr key={vs.id} className="hover:bg-gray-50"><td className="p-4">{vs.name}</td><td className="p-4 text-gray-400 font-mono">@{vs.username}</td><td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => openEdit(vs)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16}/></button><button onClick={() => handleDelete(vs.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16}/></button></div></td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Tambah'} User</h3><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'teacher' ? (
                <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Pilih Guru</label><select required disabled={!!editingId} className="w-full p-3 border rounded-xl font-bold bg-gray-50" value={formData.id || ''} onChange={e => { const t = teachers.find(t => t.id === e.target.value); setFormData({...formData, id: t?.id, name: t?.name}); }}><option value="">-- Pilih --</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
              ) : (
                <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Nama Lengkap</label><input required className="w-full p-3 border rounded-xl font-bold bg-gray-50" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              )}
              <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Username Login</label><input required className="w-full p-3 border rounded-xl font-bold bg-gray-50" value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} /></div>
              <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Password</label><input required className="w-full p-3 border rounded-xl font-bold bg-gray-50 font-mono" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
              <div className="pt-6 flex justify-end gap-3"><Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button><Button type="submit">Simpan</Button></div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

const ReportsComponent = ({ data }: { data: AppState }) => {
  const [reportType, setReportType] = useState<'harian' | 'bulanan'>('harian');
  const [filterDate, setFilterDate] = useState(getTodayDateString());
  const [filterMonth, setFilterMonth] = useState(getTodayDateString().substring(0, 7));
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  
  const reportStudents = useMemo(() => selectedClassId ? data.students.filter(s => s.classId === selectedClassId) : [], [data.students, selectedClassId]);
  const reportRecords = useMemo(() => { let res = data.records.filter(r => (reportType === 'harian' ? r.date === filterDate : r.date.startsWith(filterMonth)) && r.classId === selectedClassId); if (reportType === 'harian' && selectedPeriod !== 'all') res = res.filter(r => r.period === parseInt(selectedPeriod)); return res; }, [data.records, filterDate, filterMonth, selectedClassId, reportType, selectedPeriod]);

  const getDailyStudentStatusDetails = (studentId: string) => {
    const records = reportRecords.filter(r => r.details.some(d => d.studentId === studentId));
    if (records.length === 0) return { status: "-", period: "-", time: "-", raw: [] };
    const statusMap: any = { [AttendanceStatus.HADIR]: 'H', [AttendanceStatus.IZIN]: 'I', [AttendanceStatus.SAKIT]: 'S', [AttendanceStatus.DISPENSASI]: 'D', [AttendanceStatus.ALPA]: 'A' };
    const rawStatuses = records.map(r => r.details.find(d => d.studentId === studentId)!.status);
    const statuses = Array.from(new Set(rawStatuses.map(s => statusMap[s]))).join(", ");
    const periods = records.map(r => r.period).sort((a,b) => a-b).join(", ");
    const times = records.map(r => formatTimestamp(r.timestamp)).join(", ");
    return { status: statuses, period: periods, time: times, raw: rawStatuses };
  };

  const monthlySummary = useMemo(() => reportStudents.map(student => {
    const studentDetails = reportRecords.flatMap(r => r.details.filter(d => d.studentId === student.id));
    const counts = { H: 0, S: 0, I: 0, D: 0, A: 0 };
    studentDetails.forEach(d => { if (d.status === AttendanceStatus.HADIR) counts.H++; else if (d.status === AttendanceStatus.SAKIT) counts.S++; else if (d.status === AttendanceStatus.IZIN) counts.I++; else if (d.status === AttendanceStatus.DISPENSASI) counts.D++; else counts.A++; });
    return { id: student.id, name: student.name, nis: student.nis, gender: student.gender, ...counts };
  }), [reportStudents, reportRecords]);

  // Aggregate Totals for Summary Table
  const totals = useMemo(() => {
    const summary = { H: 0, S: 0, I: 0, D: 0, A: 0 };
    if (reportType === 'harian') {
        reportStudents.forEach(s => {
            const d = getDailyStudentStatusDetails(s.id);
            d.raw.forEach(st => {
                if (st === AttendanceStatus.HADIR) summary.H++;
                else if (st === AttendanceStatus.SAKIT) summary.S++;
                else if (st === AttendanceStatus.IZIN) summary.I++;
                else if (st === AttendanceStatus.DISPENSASI) summary.D++;
                else summary.A++;
            });
        });
    } else {
        monthlySummary.forEach(s => {
            summary.H += s.H; summary.S += s.S; summary.I += s.I; summary.D += s.D; summary.A += s.A;
        });
    }
    return summary;
  }, [reportType, reportStudents, monthlySummary, reportRecords]);

  const handleExportAttendanceExcel = () => {
    if (!selectedClassId) return alert("Pilih kelas.");
    let csv = "No,NIS,Nama,L/P,";
    if (reportType === 'harian') csv += "Ket,Jam,Waktu\n";
    else csv += "H,S,I,D,A\n";

    if (reportType === 'harian') {
      reportStudents.forEach((s, idx) => {
        const d = getDailyStudentStatusDetails(s.id);
        csv += `${idx + 1},${s.nis},"${s.name}",${s.gender},"${d.status}","${d.period}","${d.time}"\n`;
      });
    } else {
      monthlySummary.forEach((s, idx) => {
        csv += `${idx + 1},${s.nis},"${s.name}",${s.gender},${s.H},${s.S},${s.I},${s.D},${s.A}\n`;
      });
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Presensi_${reportType}_${selectedClassId}.csv`;
    link.click();
  };

  const handleExportAttendanceWord = () => {
    const content = document.getElementById('report-printable-area')?.innerHTML;
    if (!content) return;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 5px; text-align: left; }</style></head><body>`;
    const sourceHTML = header + content + "</body></html>";
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Presensi_${reportType}.doc`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card className="no-print"><div className="flex gap-4 mb-6 border-b pb-4"><button onClick={() => setReportType('harian')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all ${reportType === 'harian' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>Harian</button><button onClick={() => setReportType('bulanan')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all ${reportType === 'bulanan' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>Bulanan</button></div><div className="flex flex-wrap gap-4 items-end"><div className="flex-1 min-w-[150px]"><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Kelas</label><select className="w-full p-3 border rounded-xl bg-gray-50 font-bold" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}><option value="">Pilih...</option>{data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>{reportType === 'harian' ? (<><div className="w-40"><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Tanggal</label><input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50 font-bold" /></div><div className="w-40"><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Jam Ke</label><select className="w-full p-3 border rounded-xl bg-gray-50 font-bold" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}><option value="all">Semua</option>{[1,2,3,4,5,6,7,8,9,10,11,12].map(p => <option key={p} value={p}>{p}</option>)}</select></div></>) : (<div className="w-48"><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Bulan</label><input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50 font-bold" /></div>)}<div className="flex gap-2"><Button onClick={() => window.print()} className="uppercase text-[10px] px-4 h-[48px]"><Printer size={16}/> PDF</Button><Button onClick={handleExportAttendanceWord} variant="info" className="uppercase text-[10px] px-4 h-[48px]"><FileDown size={16}/> Word</Button><Button onClick={handleExportAttendanceExcel} variant="success" className="uppercase text-[10px] px-4 h-[48px]"><FileText size={16}/> Excel</Button></div></div></Card>
      <div className="bg-white p-12 print:p-0 min-h-[800px] border shadow-xl rounded-xl" id="report-printable-area">
        <div className="text-center mb-10 border-b-2 pb-6"><h1 className="text-3xl font-bold uppercase">SMAN 1 KWANYAR</h1><p className="text-sm font-medium text-gray-500 uppercase tracking-[0.3em]">Laporan Presensi Siswa</p><h2 className="text-xl font-bold mt-4 uppercase">{reportType === 'harian' ? 'Rekap Harian' : 'Rekap Bulanan'}</h2><p className="text-sm font-bold">KELAS: {data.classes.find(c => c.id === selectedClassId)?.name || '...'} | {reportType === 'harian' ? filterDate : getMonthName(filterMonth)}</p></div>
        {!selectedClassId ? (<p className="text-center text-gray-300 italic py-20 uppercase tracking-widest">Pilih kelas dahulu.</p>) : reportType === 'harian' ? (
          <>
            <table className="w-full border-collapse border text-sm"><thead><tr className="bg-gray-50"><th className="border p-2">NO</th><th className="border p-2">NIS</th><th className="border p-2">NAMA</th><th className="border p-2">L/P</th><th className="border p-2">KET</th><th className="border p-2">JAM</th><th className="border p-2">WAKTU</th></tr></thead><tbody className="font-bold">{reportStudents.map((s, idx) => { const d = getDailyStudentStatusDetails(s.id); return (<tr key={s.id}><td className="border p-2 text-center">{idx + 1}</td><td className="border p-2 text-center">{s.nis}</td><td className="border p-2 uppercase">{s.name}</td><td className="border p-2 text-center">{s.gender}</td><td className="border p-2 text-center text-lg">{d.status}</td><td className="border p-2 text-center">{d.period}</td><td className="border p-2 text-center">{d.time}</td></tr>); })}</tbody></table>
            <div className="mt-8">
               <h4 className="text-sm font-bold uppercase mb-2">Rekapitulasi Kehadiran:</h4>
               <table className="w-full sm:w-1/2 border-collapse border text-sm text-center">
                 <thead className="bg-gray-50"><tr><th className="border p-2">Hadir (H)</th><th className="border p-2">Sakit (S)</th><th className="border p-2">Izin (I)</th><th className="border p-2">Alpa (A)</th><th className="border p-2">Dispen (D)</th></tr></thead>
                 <tbody className="font-black"><tr><td className="border p-2 text-green-600">{totals.H}</td><td className="border p-2 text-amber-600">{totals.S}</td><td className="border p-2 text-blue-600">{totals.I}</td><td className="border p-2 text-red-600">{totals.A}</td><td className="border p-2 text-purple-600">{totals.D}</td></tr></tbody>
               </table>
            </div>
          </>
        ) : (
          <>
            <table className="w-full border-collapse border text-sm text-center"><thead><tr className="bg-gray-50"><th className="border p-2" rowSpan={2}>NO</th><th className="border p-2" rowSpan={2}>NIS</th><th className="border p-2" rowSpan={2}>NAMA</th><th className="border p-2" rowSpan={2}>L/P</th><th className="border p-2" colSpan={5}>PRESENSI</th></tr><tr className="bg-gray-50"><th className="border p-2">H</th><th className="border p-2">S</th><th className="border p-2">I</th><th className="border p-2">D</th><th className="border p-2">A</th></tr></thead><tbody className="font-bold">{monthlySummary.map((s, idx) => (<tr key={s.id}><td className="border p-2">{idx + 1}</td><td className="border p-2">{s.nis}</td><td className="border p-2 text-left uppercase">{s.name}</td><td className="border p-2">{s.gender}</td><td className="border p-2">{s.H}</td><td className="border p-2">{s.S}</td><td className="border p-2">{s.I}</td><td className="border p-2">{s.D}</td><td className="border p-2">{s.A}</td></tr>))}</tbody>
                <tfoot className="bg-gray-50 font-black">
                    <tr><td className="border p-2" colSpan={4}>TOTAL KESELURUHAN</td><td className="border p-2">{totals.H}</td><td className="border p-2">{totals.S}</td><td className="border p-2">{totals.I}</td><td className="border p-2">{totals.D}</td><td className="border p-2">{totals.A}</td></tr>
                </tfoot>
            </table>
          </>
        )}
        
        {selectedClassId && (
            <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="text-[10px] text-gray-400 font-bold uppercase italic">
                    Waktu Cetak: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} Pukul {new Date().toLocaleTimeString('id-ID')}
                </div>
                <div className="text-center w-64 border-t border-gray-200 pt-4 print:mt-10">
                    <p className="text-xs font-bold uppercase mb-20">Kepala Sekolah,</p>
                    <p className="text-xs font-black uppercase underline decoration-2">{data.headmaster.name}</p>
                    <p className="text-[10px] font-bold text-gray-500">NIP. {data.headmaster.nip}</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const DatabaseManagement = ({ data, onRefresh }: { data: AppState, onRefresh: () => void }) => {
  const exportData = () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `backup_${getTodayDateString()}.json`; link.click(); };
  const importData = (e: any) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (event) => { try { const parsed = JSON.parse(event.target?.result as string); if (parsed.headmaster) { db.replaceData(parsed); onRefresh(); alert("Pulih!"); } } catch (err) { alert("Gagal!"); } }; reader.readAsText(file); };
  return (<div className="grid md:grid-cols-2 gap-8"><Card className="hover:border-blue-200 transition-colors"><div className="flex items-center gap-4 mb-6"><div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Download size={24} /></div><div><h3 className="text-lg font-bold uppercase">Cadangkan Data</h3><p className="text-xs text-gray-400">Unduh database ke file JSON</p></div></div><Button onClick={exportData} className="w-full">Unduh Backup</Button></Card><Card className="hover:border-indigo-200 transition-colors"><div className="flex items-center gap-4 mb-6"><div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Upload size={24} /></div><div><h3 className="text-lg font-bold uppercase">Pulihkan Data</h3><p className="text-xs text-gray-400">Unggah file backup</p></div></div><input type="file" onChange={importData} className="hidden" id="import-db" /><Button onClick={() => document.getElementById('import-db')?.click()} variant="info" className="w-full">Unggah File</Button></Card></div>);
};

const AdminDashboardComponent = ({ data }: { data: AppState }) => {
  const stats = useMemo(() => {
    const totalStudents = data.students.length;
    const totalTeachers = data.teachers.length;
    const totalSubjects = data.subjects.length;
    const maleCount = data.students.filter(s => s.gender === 'L').length;
    const femaleCount = data.students.filter(s => s.gender === 'P').length;

    // Overall Status Counts
    const statusCounts: any = { [AttendanceStatus.HADIR]: 0, [AttendanceStatus.IZIN]: 0, [AttendanceStatus.SAKIT]: 0, [AttendanceStatus.DISPENSASI]: 0, [AttendanceStatus.ALPA]: 0 };
    data.records.forEach(r => r.details.forEach(d => { if (statusCounts[d.status] !== undefined) statusCounts[d.status]++; }));
    const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Gender-based Attendance
    const genderAttendance = [
      { name: 'Laki-laki', Hadir: 0, TidakHadir: 0 },
      { name: 'Perempuan', Hadir: 0, TidakHadir: 0 }
    ];
    data.records.forEach(r => {
      r.details.forEach(d => {
        const student = data.students.find(s => s.id === d.studentId);
        if (!student) return;
        const target = student.gender === 'L' ? genderAttendance[0] : genderAttendance[1];
        if (d.status === AttendanceStatus.HADIR) target.Hadir++;
        else target.TidakHadir++;
      });
    });

    // Class-based Attendance (Top 10 Classes or All)
    const classAttendance = data.classes.map(cls => {
      const classRecords = data.records.filter(r => r.classId === cls.id);
      let present = 0;
      let total = 0;
      classRecords.forEach(r => {
        r.details.forEach(d => {
          total++;
          if (d.status === AttendanceStatus.HADIR) present++;
        });
      });
      return { 
        name: cls.name, 
        persentase: total > 0 ? Math.round((present / total) * 100) : 0,
        total 
      };
    }).filter(c => c.total > 0).sort((a,b) => b.persentase - a.persentase).slice(0, 10);

    return { totalStudents, totalTeachers, totalSubjects, maleCount, femaleCount, pieData, genderAttendance, classAttendance };
  }, [data]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-8">
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><GraduationCap size={20} /></div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Total Guru</p>
              <h3 className="text-2xl font-black">{stats.totalTeachers}</h3>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><Users size={20} /></div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Total Siswa</p>
              <h3 className="text-2xl font-black">{stats.totalStudents}</h3>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><UserRound size={20} /></div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Laki-laki</p>
              <h3 className="text-2xl font-black">{stats.maleCount}</h3>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-pink-600 to-pink-700 text-white border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><UserRound size={20} /></div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Perempuan</p>
              <h3 className="text-2xl font-black">{stats.femaleCount}</h3>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-amber-600 to-amber-700 text-white border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><LibraryBig size={20} /></div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Total Mapel</p>
              <h3 className="text-2xl font-black">{stats.totalSubjects}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gender Based Attendance Chart */}
        <Card>
          <h3 className="text-sm font-black uppercase mb-6 flex items-center gap-2">
            <VenetianMask className="text-blue-600" size={18} /> Kehadiran per Jenis Kelamin
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.genderAttendance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} fontWeight={700} />
                <YAxis fontSize={11} fontWeight={700} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Legend />
                <Bar dataKey="Hadir" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="TidakHadir" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Pie Chart */}
        <Card>
          <h3 className="text-sm font-black uppercase mb-6 flex items-center gap-2">
            <Activity className="text-blue-600" size={18} /> Distribusi Status Presensi
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie 
                  data={stats.pieData} 
                  innerRadius={70} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {stats.pieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </RPieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Class Based Attendance Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-black uppercase mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={18} /> Persentase Kehadiran per Kelas (Top 10)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.classAttendance} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} fontSize={11} fontWeight={700} unit="%" />
                <YAxis dataKey="name" type="category" width={100} fontSize={11} fontWeight={700} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value) => `${value}%`} />
                <Bar dataKey="persentase" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                  {stats.classAttendance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.persentase > 90 ? '#10b981' : entry.persentase > 75 ? '#6366f1' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

const HeadmasterDashboard = ({ data, onRefresh }: { data: AppState, onRefresh: () => void }) => {
  const [hmName, setHmName] = useState(data.headmaster.name);
  const [hmNip, setHmNip] = useState(data.headmaster.nip);
  
  // Monitoring Filters
  const [filterType, setFilterType] = useState<'harian' | 'bulanan'>('harian');
  const [filterDate, setFilterDate] = useState(getTodayDateString());
  const [filterMonth, setFilterMonth] = useState(getTodayDateString().substring(0, 7));

  // Teacher Monitoring (Live Today)
  const teacherActivity = useMemo(() => data.records.filter(r => r.date === getTodayDateString()).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [data.records]);

  // Violation Stats for Charts
  const violationStats = useMemo(() => {
    const classStats = data.classes.map(cls => {
      const records = data.violationRecords.filter(v => {
        const matchesDate = filterType === 'harian' ? v.date === filterDate : v.date.startsWith(filterMonth);
        const student = data.students.find(s => s.id === v.studentId);
        return student?.classId === cls.id && matchesDate;
      });
      return { name: cls.name, total: records.length };
    }).filter(s => s.total > 0);
    return classStats;
  }, [data, filterType, filterDate, filterMonth]);

  const categoryStats = useMemo(() => {
    const counts: any = { Ringan: 0, Sedang: 0, Berat: 0 };
    data.violationRecords.forEach(v => {
      const matchesDate = filterType === 'harian' ? v.date === filterDate : v.date.startsWith(filterMonth);
      if (!matchesDate) return;
      const crit = data.violationCriteria.find(c => c.id === v.criterionId);
      if (crit) counts[crit.category]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data, filterType, filterDate, filterMonth]);

  const handleUpdate = (e: any) => { e.preventDefault(); db.updateHeadmaster({ name: hmName, nip: hmNip }); onRefresh(); alert("Tersimpan!"); };

  const COLORS_V = ['#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profil KS & Monitor Guru Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-4"><School size={40} /></div>
            <h3 className="text-xl font-bold uppercase">Profil KS</h3>
          </div>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div><label className="block text-[10px] font-bold uppercase text-gray-400">Nama</label><input required className="w-full p-3 border rounded-xl bg-gray-50 font-bold" value={hmName} onChange={e => setHmName(e.target.value)} /></div>
            <div><label className="block text-[10px] font-bold uppercase text-gray-400">NIP</label><input required className="w-full p-3 border rounded-xl bg-gray-50 font-mono" value={hmNip} onChange={e => setHmNip(e.target.value)} /></div>
            <Button type="submit" className="w-full">Simpan</Button>
          </form>
        </Card>
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold uppercase flex items-center gap-2"><Activity className="text-blue-600" /> Monitor Guru (Hari Ini)</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-3">
            {teacherActivity.length === 0 ? <p className="text-center text-gray-300 italic py-10">Belum ada aktivitas guru hari ini.</p> : teacherActivity.map(r => (<div key={r.id} className="p-4 bg-gray-50 border rounded-xl flex justify-between items-center"><div><p className="font-bold">{data.teachers.find(t => t.id === r.teacherId)?.name}</p><p className="text-xs text-gray-400 uppercase">{data.subjects.find(s => s.id === r.subjectId)?.name} | {data.classes.find(c => c.id === r.classId)?.name}</p></div><div className="text-right"><p className="font-mono text-sm">{formatTimestamp(r.timestamp)}</p><span className="text-[10px] text-green-600 font-black">Jam {r.period}</span></div></div>))}
          </div>
        </Card>
      </div>

      {/* REKAP KETERTIBAN SECTION */}
      <Card className="border-orange-100 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><ShieldAlert /></div>
              <div><h3 className="text-xl font-bold uppercase">Monitoring Ketertiban</h3><p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Analisis Rekapitulasi Pelanggaran</p></div>
           </div>
           <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border">
              <button onClick={() => setFilterType('harian')} className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-all ${filterType === 'harian' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>Harian</button>
              <button onClick={() => setFilterType('bulanan')} className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-all ${filterType === 'bulanan' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>Bulanan</button>
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              {filterType === 'harian' ? <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="bg-transparent text-[11px] font-bold text-gray-600 outline-none" /> : <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="bg-transparent text-[11px] font-bold text-gray-600 outline-none" />}
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
           {/* Chart Pelanggaran per Kelas */}
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Pelanggaran per Kelas</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={violationStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={10} fontWeight={800} />
                    <YAxis fontSize={10} fontWeight={800} />
                    <Tooltip cursor={{ fill: '#f9731610' }} />
                    <Bar dataKey="total" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
           {/* Pie Chart Kategori */}
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Sebaran Kategori</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <RPieChart>
                     <Pie data={categoryStats} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {categoryStats.map((e, i) => <Cell key={i} fill={COLORS_V[i % COLORS_V.length]} />)}
                     </Pie>
                     <Tooltip />
                     <Legend align="center" verticalAlign="bottom" />
                   </RPieChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Tabel Rekapitulasi */}
        <div className="border-t pt-8">
           <h4 className="text-sm font-bold uppercase mb-4 flex items-center gap-2"><Gavel size={18} /> Tabel Rekapitulasi Pelanggaran</h4>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-xs border-collapse border border-gray-100">
               <thead className="bg-gray-50 font-black uppercase tracking-widest text-gray-400 border-b">
                 <tr>
                    <th className="p-3 border">Nama Kelas</th>
                    <th className="p-3 border text-center">Total Kasus</th>
                    <th className="p-3 border text-center">Ringan</th>
                    <th className="p-3 border text-center">Sedang</th>
                    <th className="p-3 border text-center">Berat</th>
                 </tr>
               </thead>
               <tbody className="font-bold">
                 {data.classes.map(cls => {
                    const records = data.violationRecords.filter(v => {
                      const matchesDate = filterType === 'harian' ? v.date === filterDate : v.date.startsWith(filterMonth);
                      const student = data.students.find(s => s.id === v.studentId);
                      return student?.classId === cls.id && matchesDate;
                    });
                    if (records.length === 0) return null;
                    const r = records.filter(v => data.violationCriteria.find(c => c.id === v.criterionId)?.category === 'Ringan').length;
                    const s = records.filter(v => data.violationCriteria.find(c => c.id === v.criterionId)?.category === 'Sedang').length;
                    const b = records.filter(v => data.violationCriteria.find(c => c.id === v.criterionId)?.category === 'Berat').length;
                    return (
                      <tr key={cls.id} className="hover:bg-gray-50/50">
                        <td className="p-3 border text-gray-900">{cls.name}</td>
                        <td className="p-3 border text-center text-orange-600 text-lg">{records.length}</td>
                        <td className="p-3 border text-center text-blue-600">{r}</td>
                        <td className="p-3 border text-center text-yellow-600">{s}</td>
                        <td className="p-3 border text-center text-red-600">{b}</td>
                      </tr>
                    );
                 })}
                 {violationStats.length === 0 && (
                   <tr><td colSpan={5} className="p-10 text-center text-gray-300 italic">Tidak ada data ketertiban untuk periode ini.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </Card>
    </div>
  );
};

const TeacherLayout = ({ teacherId, onLogout }: { teacherId: string, onLogout: () => void }) => {
  return (<div className="min-h-screen bg-gray-100"><nav className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50"><div className="flex items-center gap-2"><GraduationCap className="text-blue-600" /><h1 className="font-bold uppercase text-sm">SMAN 1 Kwanyar Portal Guru</h1></div><button onClick={onLogout} className="p-2 bg-red-50 text-red-600 rounded-lg"><LogOut size={20} /></button></nav><div className="max-w-5xl mx-auto p-4 md:p-8"><AttendancePage onBack={onLogout} loggedInTeacherId={teacherId} /></div></div>);
};

const AdminLayout = ({ onLogout }: { onLogout: () => void }) => {
  const [data, setData] = useState<AppState>(db.get());
  const [view, setView] = useState<'dashboard' | 'management' | 'reports' | 'headmaster' | 'settings' | 'database'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const refreshData = () => setData(db.get());
  const currentAdmin = useMemo(() => data.admins.find(a => a.id === sessionStorage.getItem('userId')) || data.admins[0], [data.admins]);
  const NavItem = ({ id, icon: Icon, label }: any) => (<button onClick={() => { setView(id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white'}`}><Icon size={20} /> <span className="font-bold text-xs uppercase tracking-widest">{label}</span></button>);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="p-6 border-b flex items-center gap-3"><School className="text-blue-600" /><h1 className="text-xl font-bold uppercase tracking-tighter leading-tight">SiPresensi KWANYAR</h1></div><nav className="p-4 space-y-2"><NavItem id="dashboard" icon={PieChart} label="Dashboard" /><NavItem id="management" icon={Users} label="Master Data" /><NavItem id="reports" icon={FileText} label="Laporan" /><NavItem id="headmaster" icon={Eye} label="Monitoring KS" /><NavItem id="settings" icon={Settings} label="Akun" /><NavItem id="database" icon={HardDrive} label="Database" /></nav><div className="absolute bottom-0 w-full p-4 border-t"><button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 w-full font-bold hover:bg-red-50 rounded-xl transition-all"><LogOut size={20} /> Logout</button></div></aside>
      <main className="flex-1 h-screen overflow-y-auto"><div className="md:hidden bg-white p-4 flex items-center justify-between border-b shadow-sm sticky top-0 z-40"><span className="font-bold uppercase tracking-widest text-blue-600">SiPresensi Admin</span><button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-gray-100 rounded-lg">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button></div><div className="p-6 md:p-8 max-w-6xl mx-auto"><h2 className="text-3xl font-bold mb-8 text-gray-800 uppercase tracking-tight">{view === 'management' ? 'Master Data' : view === 'reports' ? 'Laporan' : view === 'headmaster' ? 'Monitoring KS' : view}</h2>{view === 'dashboard' && <AdminDashboardComponent data={data} />}{view === 'management' && <DataManagement data={data} onRefresh={refreshData} />}{view === 'reports' && <ReportsComponent data={data} />}{view === 'headmaster' && <HeadmasterDashboard data={data} onRefresh={refreshData} />}{view === 'settings' && <AdminSettings currentAdmin={currentAdmin} admins={data.admins} teachers={data.teachers} violationStaffs={data.violationStaffs} onRefresh={refreshData} />}{view === 'database' && <DatabaseManagement data={data} onRefresh={refreshData} />}</div></main>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [loggedInType, setLoggedInType] = useState<'admin' | 'teacher' | null>(null);
  const [loggedInId, setLoggedInId] = useState<string | null>(null);
  useEffect(() => { const isLogged = sessionStorage.getItem('isLoggedIn') === 'true'; if (isLogged) { setLoggedInType(sessionStorage.getItem('userType') as any); setLoggedInId(sessionStorage.getItem('userId')); setCurrentPage('dashboard'); } }, []);
  const handleLogin = (type: 'admin' | 'teacher', id: string) => { setLoggedInType(type); setLoggedInId(id); sessionStorage.setItem('isLoggedIn', 'true'); sessionStorage.setItem('userType', type); sessionStorage.setItem('userId', id); setCurrentPage('dashboard'); };
  const handleLogout = () => { setLoggedInType(null); setLoggedInId(null); sessionStorage.clear(); setCurrentPage('landing'); };
  const renderPage = () => { if (currentPage === 'landing') return <LandingPage onNavigate={setCurrentPage} />; if (currentPage === 'attendance') return <AttendancePage onBack={() => setCurrentPage('landing')} />; if (currentPage === 'violation') return <ViolationPage onBack={() => setCurrentPage('landing')} />; if (currentPage === 'login') return <UnifiedLogin onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />; if (currentPage === 'dashboard') { if (loggedInType === 'admin') return <AdminLayout onLogout={handleLogout} />; if (loggedInType === 'teacher') return <TeacherLayout teacherId={loggedInId!} onLogout={handleLogout} />; } return <LandingPage onNavigate={setCurrentPage} />; };
  return (<div className="font-sans text-gray-900 selection:bg-blue-100 antialiased">{renderPage()}</div>);
}