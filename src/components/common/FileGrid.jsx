import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileCard from './FileCard';
import FileItem from './FileItem';

/**
 * FileGrid 컴포넌트 - 카드뷰 / 리스트뷰 전환 파일 목록
 *
 * Props:
 * @param {Array} files - 파일 목록 [Required]
 * @param {string} viewMode - 'grid' | 'list' [Optional, 기본값: 'grid']
 * @param {boolean} isLoading - 로딩 상태 [Optional, 기본값: false]
 * @param {Set} selectedIds - 선택된 파일 ID Set [Optional]
 * @param {Set} favoriteIds - 즐겨찾기 파일 ID Set [Optional]
 * @param {function} onSelect - 선택 핸들러 [Optional]
 * @param {function} onDownload - 다운로드 핸들러 [Optional]
 * @param {function} onRename - 이름변경 핸들러 [Optional]
 * @param {function} onDelete - 삭제 핸들러 [Optional]
 * @param {function} onToggleFavorite - 즐겨찾기 토글 [Optional]
 * @param {string} emptyMessage - 빈 목록 메시지 [Optional]
 *
 * Example usage:
 * <FileGrid files={files} viewMode='grid' isLoading={false} />
 */
function FileGrid({
  files = [],
  viewMode = 'grid',
  isLoading = false,
  selectedIds = new Set(),
  favoriteIds = new Set(),
  onSelect,
  onDownload,
  onRename,
  onDelete,
  onToggleFavorite,
  emptyMessage = '파일이 없습니다.',
}) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} sx={{ color: '#2563EB' }} />
      </Box>
    );
  }

  if (files.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 1.5 }}>
        <InsertDriveFileIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
        <Typography sx={{ fontSize: '0.9375rem', color: '#94A3B8', fontWeight: 500 }}>
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  const commonProps = (file) => ({
    file,
    isSelected: selectedIds.has(file.id),
    isFavorite: favoriteIds.has(file.id),
    onSelect,
    onDownload,
    onRename,
    onDelete,
    onToggleFavorite,
  });

  if (viewMode === 'grid') {
    return (
      <Grid container spacing={2}>
        {files.map((file) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={file.id}>
            <FileCard {...commonProps(file)} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      {/* 리스트 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1,
          bgcolor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Box sx={{ width: 24 }} />
        <Box sx={{ width: 36 }} />
        <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
          파일명
        </Typography>
        <Box sx={{ width: 24 }} />
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', minWidth: 72, textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
          크기
        </Typography>
        <Box sx={{ width: 88 }} />
      </Box>

      {files.map((file) => (
        <FileItem key={file.id} {...commonProps(file)} />
      ))}
    </Box>
  );
}

export default FileGrid;
