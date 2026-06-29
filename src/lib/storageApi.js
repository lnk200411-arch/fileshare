import { supabase } from './supabase';

const BUCKET = 'files';

/**
 * 파일을 Storage에 업로드하고 public URL을 반환합니다.
 * @param {File} file - 업로드할 파일 객체
 * @param {string} storagePath - storage 저장 경로 (e.g. "uuid/filename.ext")
 * @param {function} onProgress - 진행률 콜백 (0~100)
 * @returns {Promise<{path: string, url: string}>}
 */
export async function uploadFile(file, storagePath, onProgress) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return { path: data.path, url: urlData.publicUrl };
}

/**
 * Storage에서 파일을 삭제합니다.
 * @param {string} storagePath
 */
export async function deleteStorageFile(storagePath) {
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw error;
}

/**
 * 파일의 public URL을 반환합니다.
 * @param {string} storagePath
 * @returns {string}
 */
export function getPublicUrl(storagePath) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Public URL을 fetch해서 Blob으로 반환합니다.
 * @param {string} storagePath
 * @returns {Promise<Blob>}
 */
export async function downloadFileAsBlob(storagePath) {
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const res = await fetch(urlData.publicUrl);
  if (!res.ok) throw new Error(`다운로드 실패: HTTP ${res.status}`);
  return await res.blob();
}
