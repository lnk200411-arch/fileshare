import { useState, useRef, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FileTypeIcon from './FileTypeIcon';
import { formatBytes, getExtension } from '../../utils/fileUtils';
import { supabase } from '../../lib/supabase';

/**
 * UploadModal 컴포넌트 - 파일 업로드 다이얼로그
 *
 * Props:
 * @param {boolean} open - 모달 열림 여부 [Required]
 * @param {function} onClose - 닫기 핸들러 [Required]
 * @param {object} user - 현재 사용자 [Optional]
 * @param {function} onSuccess - 업로드 성공 콜백 [Optional]
 *
 * Example usage:
 * <UploadModal open={open} onClose={handleClose} user={user} onSuccess={handleSuccess} />
 */
function UploadModal({ open, onClose, user, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const abortRefs = useRef({});

  const addFiles = useCallback((newFiles) => {
    const entries = Array.from(newFiles).map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}`,
      file: f,
      status: 'pending',
      progress: 0,
      error: null,
    }));
    setFiles((prev) => [...prev, ...entries]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleRemove = (id) => {
    abortRefs.current[id]?.abort();
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClose = () => {
    if (uploading) return;
    setFiles([]);
    onClose();
  };

  const uploadAll = async () => {
    if (files.length === 0) return;
    setUploading(true);

    const ownerId = user?.id ?? null;
    const folderPrefix = ownerId ?? 'anon';
    let hasError = false;

    for (const entry of files) {
      if (entry.status === 'done') continue;

      const controller = new AbortController();
      abortRefs.current[entry.id] = controller;

      const ext = getExtension(entry.file.name);
      const storagePath = `${folderPrefix}/${Date.now()}_${entry.file.name}`;

      setFiles((prev) =>
        prev.map((f) => f.id === entry.id ? { ...f, status: 'uploading', progress: 10 } : f)
      );

      try {
        const { error: storageError } = await supabase.storage
          .from('files')
          .upload(storagePath, entry.file, { upsert: false });

        if (storageError) throw storageError;

        setFiles((prev) =>
          prev.map((f) => f.id === entry.id ? { ...f, progress: 70 } : f)
        );

        const { error: dbError } = await supabase.from('files').insert({
          file_name: entry.file.name,
          storage_path: storagePath,
          extension: ext,
          mime_type: entry.file.type,
          size: entry.file.size,
          owner_id: ownerId,
          folder_id: null,
        });

        if (dbError) throw dbError;

        setFiles((prev) =>
          prev.map((f) => f.id === entry.id ? { ...f, status: 'done', progress: 100 } : f)
        );
      } catch (err) {
        hasError = true;
        if (err.name === 'AbortError') {
          setFiles((prev) => prev.map((f) => f.id === entry.id ? { ...f, status: 'cancelled' } : f));
        } else {
          setFiles((prev) =>
            prev.map((f) => f.id === entry.id ? { ...f, status: 'error', error: err.message } : f)
          );
        }
      }
    }

    setUploading(false);
    if (!hasError) {
      onSuccess?.();
    }
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const doneCount = files.filter((f) => f.status === 'done').length;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px', border: '1px solid #E2E8F0' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>파일 업로드</Typography>
        <IconButton size='small' onClick={handleClose} disabled={uploading}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* 드래그앤드롭 영역 */}
        <Box
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: `2px dashed ${isDragOver ? '#2563EB' : '#E2E8F0'}`,
            borderRadius: '12px',
            bgcolor: isDragOver ? '#EFF6FF' : '#F8FAFC',
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
            mb: 2,
            '&:hover': { borderColor: '#93C5FD', bgcolor: '#F0F9FF' },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 40, color: isDragOver ? '#2563EB' : '#CBD5E1', mb: 1 }} />
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#475569', mb: 0.5 }}>
            파일을 드래그하거나 클릭하여 선택
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
            모든 파일 형식 지원 · 다중 선택 가능
          </Typography>
          <input
            ref={fileInputRef}
            type='file'
            multiple
            style={{ display: 'none' }}
            onChange={(e) => addFiles(e.target.files)}
          />
        </Box>

        {/* 파일 목록 */}
        {files.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                {files.length}개 파일
                {doneCount > 0 && <Chip label={`${doneCount} 완료`} size='small' sx={{ ml: 1, bgcolor: '#DCFCE7', color: '#16A34A', fontSize: '0.6875rem', height: 18 }} />}
              </Typography>
            </Box>

            <List disablePadding sx={{ maxHeight: 240, overflow: 'auto' }}>
              {files.map((entry) => (
                <ListItem
                  key={entry.id}
                  disablePadding
                  sx={{ mb: 1, bgcolor: '#F8FAFC', borderRadius: '8px', px: 1.5, py: 1, border: '1px solid #E2E8F0' }}
                >
                  <FileTypeIcon extension={getExtension(entry.file.name)} size={32} showExt={false} />
                  <ListItemText
                    sx={{ ml: 1.5, mr: 1 }}
                    primary={
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.file.name}
                      </Typography>
                    }
                    secondary={
                      entry.status === 'uploading' ? (
                        <LinearProgress
                          variant='determinate'
                          value={entry.progress}
                          sx={{ mt: 0.5, height: 3, borderRadius: 2, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#2563EB' } }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                          {formatBytes(entry.file.size)}
                        </Typography>
                      )
                    }
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {entry.status === 'done' && <CheckCircleIcon sx={{ fontSize: 18, color: '#16A34A' }} />}
                    {entry.status === 'error' && <ErrorIcon sx={{ fontSize: 18, color: '#E11D48' }} />}
                    {(entry.status === 'pending' || entry.status === 'error') && (
                      <IconButton size='small' onClick={() => handleRemove(entry.id)}>
                        <DeleteOutlinedIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                      </IconButton>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <Button
                fullWidth
                variant='outlined'
                onClick={handleClose}
                disabled={uploading}
                sx={{ borderColor: '#E2E8F0', color: '#475569' }}
              >
                취소
              </Button>
              <Button
                fullWidth
                variant='contained'
                onClick={uploadAll}
                disabled={uploading || pendingCount === 0}
                sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}
              >
                {uploading ? '업로드 중...' : `${pendingCount}개 업로드`}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UploadModal;
