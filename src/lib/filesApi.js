import { supabase } from './supabase';
import { uploadFile, deleteStorageFile } from './storageApi';

/**
 * 파일 목록 조회
 * @param {object} opts
 * @param {string} [opts.sortBy='created_at'] - 정렬 기준
 * @param {boolean} [opts.ascending=false]
 * @param {string} [opts.search=''] - 파일명 검색어
 * @param {string} [opts.extension=''] - 확장자 필터
 * @param {string|null} [opts.folderId=null] - 폴더 필터
 * @returns {Promise<Array>}
 */
export async function fetchFiles({ sortBy = 'created_at', ascending = false, search = '', extension = '', folderId = null } = {}) {
  let query = supabase
    .from('files')
    .select('*')
    .is('deleted_at', null)
    .order(sortBy, { ascending });

  if (search) query = query.ilike('file_name', `%${search}%`);
  if (extension) query = query.eq('extension', extension.toLowerCase());
  if (folderId !== undefined) {
    query = folderId === null ? query.is('folder_id', null) : query.eq('folder_id', folderId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * 최근 다운로드된 파일 조회 (downloads 테이블 기준)
 * @param {number} [limit=50]
 * @returns {Promise<Array>}
 */
export async function fetchRecentDownloads(limit = 50) {
  const { data, error } = await supabase
    .from('downloads')
    .select('created_at, files(*)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data
    .filter((d) => d.files && !d.files.deleted_at)
    .map((d) => ({ ...d.files, downloaded_at: d.created_at }));
}

/**
 * Storage + DB에 파일을 등록합니다.
 * @param {File} file
 * @param {string|null} folderId
 * @param {function} onProgress
 * @returns {Promise<object>} 생성된 파일 레코드
 */
export async function createFile(file, folderId = null, onProgress) {
  const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
  const uniqueName = `${crypto.randomUUID()}_${file.name}`;
  const storagePath = folderId ? `${folderId}/${uniqueName}` : `root/${uniqueName}`;

  const { path } = await uploadFile(file, storagePath, onProgress);

  const { data, error } = await supabase
    .from('files')
    .insert({
      file_name: file.name,
      extension: ext,
      storage_path: path,
      size: file.size,
      folder_id: folderId,
    })
    .select()
    .single();

  if (error) {
    await deleteStorageFile(path).catch(() => {});
    throw error;
  }
  return data;
}

/**
 * 다운로드 카운트를 1 증가시키고 downloads 테이블에 기록합니다.
 * @param {string} fileId
 */
export async function recordDownload(fileId) {
  await Promise.allSettled([
    supabase.from('downloads').insert({ file_id: fileId }),
    supabase.rpc('increment_download_count', { file_id: fileId }),
  ]);
}

/**
 * Soft delete — deleted_at 설정
 * @param {string} fileId
 */
export async function softDeleteFile(fileId) {
  const { error } = await supabase
    .from('files')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', fileId);
  if (error) throw error;
}

/**
 * 파일 삭제 — DB soft delete + Storage 파일 제거
 * @param {string} fileId
 * @param {string} storagePath
 */
export async function deleteFile(fileId, storagePath) {
  await softDeleteFile(fileId);
  if (storagePath) {
    await deleteStorageFile(storagePath).catch(() => {});
  }
}
