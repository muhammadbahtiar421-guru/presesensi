import { AppState, AttendanceStatus, Teacher, Subject, StudentClass, Student, AttendanceRecord, Headmaster, Admin, ViolationCriterion, ViolationRecord, ViolationStaff } from '../types';

const STORAGE_KEY = 'sman1kwanyar_db_v7';

const INITIAL_DATA: AppState = {
  headmaster: { id: 'hm1', name: 'Drs. H. Kepala Sekolah, M.Pd', nip: '19650101' },
  admins: [
    { id: 'admin-1', username: 'admin', password: 'admin123', name: 'Administrator Utama' }
  ],
  teachers: [
    { id: 't1', name: 'Budi Santoso, S.Pd', nip: '19800101', classIds: ['c1'], subjectIds: ['s1', 's3'] },
    { id: 't2', name: 'Siti Aminah, M.Pd', nip: '19850202', classIds: ['c2'], subjectIds: ['s2'] },
  ],
  violationStaffs: [
    { id: 'vs1', name: 'Tim Ketertiban BK', username: 'bk1', password: 'bk123' }
  ],
  subjects: [
    { id: 's1', name: 'Matematika Wajib' },
    { id: 's2', name: 'Bahasa Indonesia' },
    { id: 's3', name: 'Fisika' },
  ],
  classes: [
    { id: 'c1', name: 'X MIPA 1' },
    { id: 'c2', name: 'XII MIPA 1' },
  ],
  students: [
    { id: 'st1', name: 'Achmad Fikri', nis: '1001', classId: 'c1', gender: 'L' },
    { id: 'st2', name: 'Dewi Sartika', nis: '1002', classId: 'c1', gender: 'P' },
  ],
  records: [],
  violationCriteria: [
    { id: 'vc1', name: 'Terlambat Masuk Sekolah', category: 'Ringan', points: 5 },
    { id: 'vc2', name: 'Berpakaian Tidak Rapi', category: 'Ringan', points: 2 },
    { id: 'vc3', name: 'Merusak Fasilitas Sekolah', category: 'Berat', points: 50 },
    { id: 'vc4', name: 'Bolos Mata Pelajaran', category: 'Sedang', points: 15 },
  ],
  violationRecords: []
};

const loadData = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.admins) parsed.admins = INITIAL_DATA.admins;
      if (!parsed.violationStaffs) parsed.violationStaffs = INITIAL_DATA.violationStaffs;
      if (!parsed.violationCriteria) parsed.violationCriteria = INITIAL_DATA.violationCriteria;
      if (!parsed.violationRecords) parsed.violationRecords = INITIAL_DATA.violationRecords;
      return parsed;
    } catch (e) {
      return INITIAL_DATA;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
};

const saveData = (data: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const db = {
  get: (): AppState => loadData(),
  save: (data: AppState) => saveData(data),
  
  replaceData: (newData: AppState) => {
    saveData(newData);
  },

  // Admins
  addAdmin: (a: Omit<Admin, 'id'>) => {
    const data = loadData();
    data.admins.push({ ...a, id: crypto.randomUUID() });
    saveData(data);
  },
  updateAdmin: (id: string, updates: Partial<Admin>) => {
    const data = loadData();
    data.admins = data.admins.map(a => a.id === id ? { ...a, ...updates } : a);
    saveData(data);
  },
  deleteAdmin: (id: string) => {
    const data = loadData();
    if (data.admins.length <= 1) throw new Error("Minimal harus ada 1 admin.");
    data.admins = data.admins.filter(a => a.id !== id);
    saveData(data);
  },

  // Teachers
  addTeacher: (t: Omit<Teacher, 'id'>) => {
    const data = loadData();
    data.teachers.push({ ...t, id: crypto.randomUUID() });
    saveData(data);
  },
  bulkAddTeachers: (teachers: Omit<Teacher, 'id'>[]) => {
    const data = loadData();
    const withIds = teachers.map(t => ({ ...t, id: crypto.randomUUID() }));
    data.teachers.push(...withIds);
    saveData(data);
  },
  updateTeacher: (id: string, updates: Partial<Teacher>) => {
    const data = loadData();
    data.teachers = data.teachers.map(t => t.id === id ? { ...t, ...updates } : t);
    saveData(data);
  },
  deleteTeacher: (id: string) => {
    const data = loadData();
    data.teachers = data.teachers.filter(t => t.id !== id);
    saveData(data);
  },

  // Violation Staffs
  addViolationStaff: (vs: Omit<ViolationStaff, 'id'>) => {
    const data = loadData();
    data.violationStaffs.push({ ...vs, id: crypto.randomUUID() });
    saveData(data);
  },
  updateViolationStaff: (id: string, updates: Partial<ViolationStaff>) => {
    const data = loadData();
    data.violationStaffs = data.violationStaffs.map(vs => vs.id === id ? { ...vs, ...updates } : vs);
    saveData(data);
  },
  deleteViolationStaff: (id: string) => {
    const data = loadData();
    data.violationStaffs = data.violationStaffs.filter(vs => vs.id !== id);
    saveData(data);
  },

  // Students
  addStudent: (s: Omit<Student, 'id'>) => {
    const data = loadData();
    data.students.push({ ...s, id: crypto.randomUUID() });
    saveData(data);
  },
  updateStudent: (id: string, updates: Partial<Student>) => {
    const data = loadData();
    data.students = data.students.map(s => s.id === id ? { ...s, ...updates } : s);
    saveData(data);
  },
  deleteStudent: (id: string) => {
    const data = loadData();
    data.students = data.students.filter(s => s.id !== id);
    saveData(data);
  },

  // Classes
  addClass: (c: Omit<StudentClass, 'id'>) => {
    const data = loadData();
    data.classes.push({ ...c, id: crypto.randomUUID() });
    saveData(data);
  },
  updateClass: (id: string, updates: Partial<StudentClass>) => {
    const data = loadData();
    data.classes = data.classes.map(c => c.id === id ? { ...c, ...updates } : c);
    saveData(data);
  },
  deleteClass: (id: string) => {
    const data = loadData();
    data.classes = data.classes.filter(c => c.id !== id);
    saveData(data);
  },

  // Subjects
  addSubject: (s: Omit<Subject, 'id'>) => {
    const data = loadData();
    data.subjects.push({ ...s, id: crypto.randomUUID() });
    saveData(data);
  },
  updateSubject: (id: string, updates: Partial<Subject>) => {
    const data = loadData();
    data.subjects = data.subjects.map(s => s.id === id ? { ...s, ...updates } : s);
    saveData(data);
  },
  deleteSubject: (id: string) => {
    const data = loadData();
    data.subjects = data.subjects.filter(s => s.id !== id);
    saveData(data);
  },

  // Attendance
  submitAttendance: (record: AttendanceRecord) => {
    const data = loadData();
    data.records.push(record);
    saveData(data);
  },
  deleteRecord: (id: string) => {
    const data = loadData();
    data.records = data.records.filter(r => r.id !== id);
    saveData(data);
  },
  updateHeadmaster: (updates: Partial<Headmaster>) => {
    const data = loadData();
    data.headmaster = { ...data.headmaster, ...updates };
    saveData(data);
  },

  // Violations
  addViolationCriterion: (v: Omit<ViolationCriterion, 'id'>) => {
    const data = loadData();
    data.violationCriteria.push({ ...v, id: crypto.randomUUID() });
    saveData(data);
  },
  updateViolationCriterion: (id: string, updates: Partial<ViolationCriterion>) => {
    const data = loadData();
    data.violationCriteria = data.violationCriteria.map(v => v.id === id ? { ...v, ...updates } : v);
    saveData(data);
  },
  deleteViolationCriterion: (id: string) => {
    const data = loadData();
    data.violationCriteria = data.violationCriteria.filter(v => v.id !== id);
    saveData(data);
  },
  addViolationRecord: (vr: Omit<ViolationRecord, 'id'>) => {
    const data = loadData();
    data.violationRecords.push({ ...vr, id: crypto.randomUUID() });
    saveData(data);
  },
  deleteViolationRecord: (id: string) => {
    const data = loadData();
    data.violationRecords = data.violationRecords.filter(vr => vr.id !== id);
    saveData(data);
  },

  bulkAddStudents: (students: Omit<Student, 'id'>[]) => {
    const data = loadData();
    const withIds = students.map(s => ({ ...s, id: crypto.randomUUID() }));
    data.students.push(...withIds);
    saveData(data);
  }
};