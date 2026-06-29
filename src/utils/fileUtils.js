export const FILE_TYPE_MAP = {
  image: { exts: ['jpg','jpeg','png','gif','webp','svg','bmp','ico'], color: '#10B981', label: '이미지' },
  video: { exts: ['mp4','mov','avi','mkv','webm','wmv'], color: '#8B5CF6', label: '동영상' },
  audio: { exts: ['mp3','wav','ogg','flac','aac','m4a'], color: '#F59E0B', label: '오디오' },
  pdf:   { exts: ['pdf'], color: '#EF4444', label: 'PDF' },
  doc:   { exts: ['doc','docx','hwp','hwpx','odt','rtf'], color: '#2563EB', label: '문서' },
  sheet: { exts: ['xls','xlsx','csv','ods'], color: '#059669', label: '스프레드시트' },
  ppt:   { exts: ['ppt','pptx','odp'], color: '#EA580C', label: '프레젠테이션' },
  zip:   { exts: ['zip','rar','7z','tar','gz','bz2'], color: '#78716C', label: '압축' },
  code:  { exts: ['js','jsx','ts','tsx','py','java','go','rs','cpp','c','html','css','json','xml','yaml','yml'], color: '#6366F1', label: '코드' },
};

export function getFileType(extension) {
  const ext = (extension || '').toLowerCase().replace('.', '');
  for (const [type, info] of Object.entries(FILE_TYPE_MAP)) {
    if (info.exts.includes(ext)) return { type, ...info };
  }
  return { type: 'other', color: '#94A3B8', label: '파일', exts: [] };
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return '방금 전';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}일 전`;
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getExtension(fileName) {
  if (!fileName) return '';
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

/** 파일을 브라우저에서 직접 다운로드 트리거 (크로스 오리진 대응: blob fetch) */
export async function triggerDownload(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch {
    // fetch 실패 시 직접 링크 방식으로 폴백
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/** Supabase Storage public URL 생성 */
export function getStoragePublicUrl(supabaseUrl, storagePath) {
  return `${supabaseUrl}/storage/v1/object/public/files/${storagePath}`;
}
