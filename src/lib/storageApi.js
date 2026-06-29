import { supabase } from './supabase';

const BUCKET = 'files';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * 파일을 Storage에 업로드하고 public URL을 반환합니다.
 * SDK 대신 XHR 직접 호출로 모든 파일 형식의 Content-Type을 보장합니다.
 * @param {File} file - 업로드할 파일 객체
 * @param {string} storagePath - storage 저장 경로
 * @param {function} onProgress - 진행률 콜백 (0~100)
 * @returns {Promise<{path: string, url: string}>}
 */
export function uploadFile(file, storagePath, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
        resolve({ path: storagePath, url: urlData.publicUrl });
      } else {
        reject(new Error(`업로드 실패 (${xhr.status}): ${xhr.responseText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('네트워크 오류로 업로드 실패')));
    xhr.addEventListener('abort', () => reject(new Error('업로드가 취소되었습니다')));

    xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`);
    xhr.setRequestHeader('Authorization', `Bearer ${SUPABASE_KEY}`);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.send(file);
  });
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
