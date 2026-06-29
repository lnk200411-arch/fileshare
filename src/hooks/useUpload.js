import { useState, useCallback, useRef } from 'react';
import { createFile } from '../lib/filesApi';

/**
 * @typedef {object} UploadItem
 * @property {string} id - 고유 식별자
 * @property {File} file - 파일 객체
 * @property {'pending'|'uploading'|'done'|'error'} status
 * @property {number} progress - 0~100
 * @property {string} [error]
 */

/**
 * useUpload 훅 - 다중 파일 업로드 상태 관리
 * @param {function} onComplete - 전체 완료 콜백
 * @returns {{ items, upload, retry, cancel, clear, isUploading }}
 */
function useUpload(onComplete) {
  const [items, setItems] = useState([]);
  const abortRefs = useRef({});

  const setItem = useCallback((id, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }, []);

  const uploadSingle = useCallback(
    async (uploadItem, folderId) => {
      const { id, file } = uploadItem;
      const abortCtrl = new AbortController();
      abortRefs.current[id] = abortCtrl;

      setItem(id, { status: 'uploading', progress: 0 });

      try {
        await createFile(file, folderId, (progress) => {
          if (!abortCtrl.signal.aborted) setItem(id, { progress });
        });
        setItem(id, { status: 'done', progress: 100 });
      } catch (err) {
        if (!abortCtrl.signal.aborted) {
          setItem(id, { status: 'error', error: err.message || '업로드 실패' });
        }
      } finally {
        delete abortRefs.current[id];
      }
    },
    [setItem]
  );

  const upload = useCallback(
    async (files, folderId = null) => {
      const newItems = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: 'pending',
        progress: 0,
      }));

      setItems((prev) => [...prev, ...newItems]);

      await Promise.allSettled(newItems.map((item) => uploadSingle(item, folderId)));

      const allDone = newItems.every((item) => item.status !== 'error');
      if (allDone) onComplete?.();
    },
    [uploadSingle, onComplete]
  );

  const retry = useCallback(
    (id, folderId) => {
      const item = items.find((i) => i.id === id);
      if (item) uploadSingle({ ...item, status: 'pending' }, folderId);
    },
    [items, uploadSingle]
  );

  const cancel = useCallback((id) => {
    abortRefs.current[id]?.abort();
    setItem(id, { status: 'error', error: '취소됨' });
  }, [setItem]);

  const clear = useCallback(() => {
    Object.values(abortRefs.current).forEach((ctrl) => ctrl.abort());
    abortRefs.current = {};
    setItems([]);
  }, []);

  const isUploading = items.some((i) => i.status === 'uploading');

  return { items, upload, retry, cancel, clear, isUploading };
}

export default useUpload;
