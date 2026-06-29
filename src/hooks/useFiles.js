import { useState, useEffect, useCallback } from 'react';
import { fetchFiles, fetchRecentDownloads, recordDownload } from '../lib/filesApi';
import { getStoragePublicUrl, triggerDownload, getFileType } from '../utils/fileUtils';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * useFiles 훅 - 파일 목록 조회, 다운로드, 다중선택
 *
 * @param {object} opts - fetchFiles에 전달할 옵션 (sortBy, search, extension, folderId)
 * @param {number} refreshKey - 변경 시 재조회 트리거
 * @param {boolean} recentDownloads - true면 최근 다운로드 목록 조회
 * @returns {{ files, isLoading, error, refresh, handleDownload, selectedIds, toggleSelect, downloadSelected, clearSelection }}
 */
export function useFiles(opts = {}, refreshKey = 0, recentDownloads = false) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (recentDownloads) {
        data = await fetchRecentDownloads();
      } else {
        const { filterType, ...apiOpts } = opts;
        data = await fetchFiles(apiOpts);
        if (filterType && filterType !== 'all') {
          data = data.filter((f) => {
            const { type } = getFileType(f.extension);
            return type === filterType;
          });
        }
      }
      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(opts), refreshKey, recentDownloads]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const handleDownload = useCallback(async (file) => {
    const url = getStoragePublicUrl(SUPABASE_URL, file.storage_path);
    await triggerDownload(url, file.file_name);
    await recordDownload(file.id).catch(() => {});
    setFiles((prev) =>
      prev.map((f) => f.id === file.id ? { ...f, download_count: (f.download_count || 0) + 1 } : f)
    );
  }, []);

  const toggleSelect = useCallback((id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }, []);

  const downloadSelected = useCallback(async () => {
    const targets = files.filter((f) => selectedIds.has(f.id));
    for (const file of targets) await handleDownload(file);
    setSelectedIds(new Set());
  }, [files, selectedIds, handleDownload]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  return { files, isLoading, error, refresh: load, handleDownload, selectedIds, toggleSelect, downloadSelected, clearSelection };
}
