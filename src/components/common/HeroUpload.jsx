import { useState, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { CloudUpload, InsertDriveFile, FolderOpen, Close, Replay, CheckCircle, ErrorOutlineOutlined } from '@mui/icons-material';
import { formatBytes } from '../../utils/fileUtils';
import useUpload from '../../hooks/useUpload';

/**
 * HeroUpload 컴포넌트 - 메인 페이지 대형 드래그&드롭 업로드 영역
 *
 * Props:
 * @param {function} onSuccess - 업로드 완료 후 목록 갱신 콜백 [Required]
 *
 * Example usage:
 * <HeroUpload onSuccess={handleRefresh} />
 */
function HeroUpload({ onSuccess }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const { items, upload, retry, cancel, clear, isUploading } = useUpload(onSuccess);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) upload(files, null);
    },
    [upload]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false);
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length) upload(files, null);
      e.target.value = '';
    },
    [upload]
  );

  const doneCount = items.filter((i) => i.status === 'done').length;
  const errorCount = items.filter((i) => i.status === 'error').length;
  const hasItems = items.length > 0;

  return (
    <Box>
      {/* 드래그&드롭 영역 */}
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !hasItems && fileInputRef.current?.click()}
        sx={{
          border: `2px dashed ${isDragOver ? '#2563EB' : '#CBD5E1'}`,
          borderRadius: '16px',
          bgcolor: isDragOver ? '#EFF6FF' : '#FFFFFF',
          p: { xs: 4, md: 6 },
          textAlign: 'center',
          cursor: hasItems ? 'default' : 'pointer',
          transition: 'all 0.2s',
          '&:hover': !hasItems ? { borderColor: '#94A3B8', bgcolor: '#F8FAFC' } : {},
        }}
      >
        <CloudUpload sx={{ fontSize: 48, color: isDragOver ? '#2563EB' : '#CBD5E1', mb: 2 }} />
        <Typography variant='h2' sx={{ mb: 1, color: '#0F172A' }}>
          파일을 드래그하거나 클릭하여 업로드
        </Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          모든 파일 형식 지원 · 다중 파일 · 폴더 업로드 가능
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant='contained'
            startIcon={<InsertDriveFile sx={{ fontSize: '1rem !important' }} />}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            size='small'
          >
            파일 선택
          </Button>
          <Button
            variant='outlined'
            startIcon={<FolderOpen sx={{ fontSize: '1rem !important' }} />}
            onClick={(e) => { e.stopPropagation(); folderInputRef.current?.click(); }}
            size='small'
          >
            폴더 선택
          </Button>
          {hasItems && (
            <Button
              variant='text'
              size='small'
              onClick={(e) => { e.stopPropagation(); clear(); }}
              sx={{ color: '#94A3B8' }}
            >
              초기화
            </Button>
          )}
        </Box>
      </Box>

      {/* 숨겨진 input */}
      <input ref={fileInputRef} type='file' multiple hidden onChange={handleFileChange} />
      <input ref={folderInputRef} type='file' webkitdirectory='' multiple hidden onChange={handleFileChange} />

      {/* 업로드 목록 */}
      {hasItems && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* 요약 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: '#0F172A' }}>
              {items.length}개 파일
            </Typography>
            {doneCount > 0 && <Chip label={`완료 ${doneCount}`} size='small' color='success' />}
            {errorCount > 0 && <Chip label={`실패 ${errorCount}`} size='small' color='error' />}
            {isUploading && <Chip label='업로드 중...' size='small' color='primary' />}
          </Box>

          {/* 각 파일 */}
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                p: 1.5,
              }}
            >
              {/* 상태 아이콘 */}
              {item.status === 'done' && <CheckCircle sx={{ color: '#22C55E', fontSize: 20, flexShrink: 0 }} />}
              {item.status === 'error' && <ErrorOutlineOutlined sx={{ color: '#EF4444', fontSize: 20, flexShrink: 0 }} />}
              {(item.status === 'pending' || item.status === 'uploading') && (
                <InsertDriveFile sx={{ color: '#94A3B8', fontSize: 20, flexShrink: 0 }} />
              )}

              {/* 파일 정보 */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {item.file.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant='caption' color='text.secondary'>
                    {formatBytes(item.file.size)}
                  </Typography>
                  {item.status === 'error' && (
                    <Typography variant='caption' color='error'>{item.error}</Typography>
                  )}
                </Box>
                {item.status === 'uploading' && (
                  <LinearProgress
                    variant='determinate'
                    value={item.progress}
                    sx={{ mt: 0.5, height: 3, borderRadius: 2 }}
                  />
                )}
              </Box>

              {/* 액션 */}
              {item.status === 'error' && (
                <IconButton size='small' onClick={() => retry(item.id, null)} title='재시도'>
                  <Replay fontSize='small' />
                </IconButton>
              )}
              {item.status === 'uploading' && (
                <IconButton size='small' onClick={() => cancel(item.id)} title='취소'>
                  <Close fontSize='small' />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default HeroUpload;
