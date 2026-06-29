import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { supabase } from '../lib/supabase';

/**
 * useFileActions 훅 - 다운로드, 삭제, 복구, 즐겨찾기, 이름변경
 *
 * @param {string} userId - 현재 사용자 ID
 * @param {function} onRefresh - 작업 완료 후 목록 갱신 콜백
 */
export function useFileActions({ userId, onRefresh }) {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());

  /* ─── 즐겨찾기 로드 ─── */
  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from('favorites').select('file_id').eq('user_id', userId);
    setFavoriteIds(new Set((data || []).map((f) => f.file_id)));
  }, [userId]);

  /* ─── 즐겨찾기 토글 ─── */
  const toggleFavorite = useCallback(async (fileId) => {
    if (!userId) return;
    if (favoriteIds.has(fileId)) {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('file_id', fileId);
      setFavoriteIds((prev) => { const s = new Set(prev); s.delete(fileId); return s; });
    } else {
      await supabase.from('favorites').insert({ user_id: userId, file_id: fileId });
      setFavoriteIds((prev) => new Set([...prev, fileId]));
    }
  }, [userId, favoriteIds]);

  /* ─── 단건 다운로드 ─── */
  const downloadFile = useCallback(async (file) => {
    const { data, error } = await supabase.storage.from('files').download(file.storage_path);
    if (error || !data) return;

    await supabase.from('downloads').insert({ file_id: file.id, user_id: userId || null });

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file_name;
    a.click();
    URL.revokeObjectURL(url);
  }, [userId]);

  /* ─── 다중 압축 다운로드 ─── */
  const downloadSelected = useCallback(async (files) => {
    const targets = files.filter((f) => selectedIds.has(f.id));
    if (targets.length === 0) return;
    if (targets.length === 1) { downloadFile(targets[0]); return; }

    const zip = new JSZip();
    for (const file of targets) {
      const { data } = await supabase.storage.from('files').download(file.storage_path);
      if (data) zip.file(file.file_name, data);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'download.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedIds, downloadFile]);

  /* ─── 소프트 삭제 ─── */
  const deleteFile = useCallback(async (fileId) => {
    await supabase.from('files').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', fileId);
    onRefresh?.();
  }, [onRefresh]);

  /* ─── 복구 ─── */
  const restoreFile = useCallback(async (fileId) => {
    await supabase.from('files').update({ is_deleted: false, deleted_at: null }).eq('id', fileId);
    onRefresh?.();
  }, [onRefresh]);

  /* ─── 영구 삭제 ─── */
  const permanentDelete = useCallback(async (file) => {
    await supabase.storage.from('files').remove([file.storage_path]);
    await supabase.from('files').delete().eq('id', file.id);
    onRefresh?.();
  }, [onRefresh]);

  /* ─── 이름 변경 ─── */
  const renameFile = useCallback(async (fileId, newName) => {
    await supabase.from('files').update({ file_name: newName }).eq('id', fileId);
    onRefresh?.();
  }, [onRefresh]);

  /* ─── 선택 관리 ─── */
  const handleSelect = useCallback((fileId, checked) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      checked ? s.add(fileId) : s.delete(fileId);
      return s;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  return {
    favoriteIds, selectedIds,
    loadFavorites, toggleFavorite,
    downloadFile, downloadSelected,
    deleteFile, restoreFile, permanentDelete,
    renameFile, handleSelect, clearSelection,
  };
}
