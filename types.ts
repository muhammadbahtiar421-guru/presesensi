export enum AttendanceStatus {
  HADIR = 'Hadir',
  IZIN = 'Izin',
  SAKIT = 'Sakit',
  DISPENSASI = 'Dispensasi',
  ALPA = 'Alpa'
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  classIds: string[]; // IDs of classes they teach
  subjectIds: string[]; // IDs of subjects they teach
  username?: string; // Optional login credentials
  password?: string;
}

export interface ViolationStaff {
  id: string;
  name: string;
  username: string;
  password: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface StudentClass {
  id: string;
  name: string; // e.g. "XII MIPA 1"
}

export interface Student {
  id: string;
  name: string;
  nis: string;
  classId: string;
  gender: 'L' | 'P'; // L = Laki-laki, P = Perempuan
}

export interface Headmaster {
  id: string;
  name: string;
  nip: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  timestamp: string; // ISO Full string
  day: string; // Senin, Selasa...
  period: number; // Jam ke-
  teacherId: string;
  subjectId: string;
  classId: string;
  journalNote: string; // Jurnal Kelas
  details: {
    studentId: string;
    status: AttendanceStatus;
  }[];
}

export interface ViolationCriterion {
  id: string;
  name: string;
  category: 'Ringan' | 'Sedang' | 'Berat';
  points: number;
}

export interface ViolationRecord {
  id: string;
  studentId: string;
  criterionId: string;
  date: string;
  note: string;
  reportedBy: string;
}

export interface AppState {
  admins: Admin[];
  teachers: Teacher[];
  violationStaffs: ViolationStaff[];
  subjects: Subject[];
  classes: StudentClass[];
  students: Student[];
  records: AttendanceRecord[];
  headmaster: Headmaster;
  violationCriteria: ViolationCriterion[];
  violationRecords: ViolationRecord[];
}