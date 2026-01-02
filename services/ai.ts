
import { GoogleGenAI } from "@google/genai";
import { AppState, AttendanceStatus } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateAttendanceInsight = async (data: AppState): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "API Key Gemini tidak ditemukan. Harap konfigurasi environment variable API_KEY.";
  }

  // Summarize data for the prompt to save tokens
  const totalRecords = data.records.length;
  if (totalRecords === 0) return "Belum ada data presensi untuk dianalisis.";

  const statusCounts = {
    [AttendanceStatus.HADIR]: 0,
    [AttendanceStatus.IZIN]: 0,
    [AttendanceStatus.SAKIT]: 0,
    [AttendanceStatus.DISPENSASI]: 0,
    [AttendanceStatus.ALPA]: 0,
  };

  data.records.forEach(r => {
    r.details.forEach(d => {
      if (statusCounts[d.status] !== undefined) {
        statusCounts[d.status]++;
      }
    });
  });

  const prompt = `
    Analisis data presensi siswa SMAN 1 Kwanyar ini.
    Total Data Sesi Kelas: ${totalRecords}
    
    Rincian Kehadiran Individual:
    - Hadir: ${statusCounts[AttendanceStatus.HADIR]}
    - Izin: ${statusCounts[AttendanceStatus.IZIN]}
    - Sakit: ${statusCounts[AttendanceStatus.SAKIT]}
    - Dispensasi: ${statusCounts[AttendanceStatus.DISPENSASI]}
    - Alpa: ${statusCounts[AttendanceStatus.ALPA]}

    Berikan analisis singkat (maksimal 2 paragraf) tentang tingkat kedisiplinan dan saran untuk pihak sekolah (Kepala Sekolah/Guru BK). Gunakan bahasa Indonesia yang formal dan sopan.
  `;

  try {
    // Using 'gemini-3-flash-preview' for basic text tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Accessing .text property directly as per guidelines
    return response.text || "Gagal mendapatkan analisis.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI.";
  }
};
