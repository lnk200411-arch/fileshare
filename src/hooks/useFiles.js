import { useState, useEffect, useCallback } from 'react';
import { fetchFiles, fetchRecentDownloads, recordDownload, deleteFile } from '../lib/filesApi';
import { triggerBlobDownload, getFileType } from '../utils/fileUtils';
import { downloadFileAsBlob } from '../lib/storageApi';

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
    const blob = await downloadFileAsBlob(file.storage_path);
    triggerBlobDownload(blob, file.file_name);
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

  const handleDelete = useCallback(async (file) => {
    if (!window.confirm(`"${file.file_name}"을(를) 삭제하시겠습니까?`)) return;
    await deleteFile(file.id, file.storage_path);
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
  }, []);

  const deleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`선택한 ${selectedIds.size}개 파일을 삭제하시겠습니까?`)) return;
    const targets = files.filter((f) => selectedIds.has(f.id));
    await Promise.allSettled(targets.map((f) => deleteFile(f.id, f.storage_path)));
    setFiles((prev) => prev.filter((f) => !selectedIds.has(f.id)));
    setSelectedIds(new Set());
  }, [files, selectedIds]);

  return { files, isLoading, error, refresh: load, handleDownload, handleDelete, selectedIds, toggleSelect, downloadSelected, deleteSelected, clearSelection };
}
