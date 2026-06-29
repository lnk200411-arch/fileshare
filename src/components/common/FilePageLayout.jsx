import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { Download, DeleteOutlined } from '@mui/icons-material';
import SortFilter from './SortFilter';
import FileCard from './FileCard';
import FileListItem from './FileListItem';

/**
 * FilePageLayout 컴포넌트 - 파일 목록 페이지 공통 레이아웃
 *
 * Props:
 * @param {string} title - 페이지 제목 [Required]
 * @param {Array} files - 파일 목록 [Required]
 * @param {boolean} isLoading - 로딩 상태 [Optional, 기본값: false]
 * @param {string} error - 오류 메시지 [Optional]
 * @param {string} viewMode - 'grid'|'list' [Optional, 기본값: 'grid']
 * @param {string} sortBy - 정렬 기준 [Optional, 기본값: 'created_at']
 * @param {string} filterType - 파일 타입 필터 [Optional, 기본값: 'all']
 * @param {Set} selectedIds - 선택된 파일 id 집합 [Optional]
 * @param {function} onViewModeChange - 뷰모드 변경 [Optional]
 * @param {function} onSortChange - 정렬 변경 [Optional]
 * @param {function} onFilterChange - 필터 변경 [Optional]
 * @param {function} onDownload - 다운로드 핸들러 [Optional]
 * @param {function} onSelect - 선택 핸들러 [Optional]
 * @param {function} onDownloadSelected - 선택 다운로드 [Optional]
 * @param {function} onDelete - 단일 삭제 핸들러 [Optional]
 * @param {function} onDeleteSelected - 선택 삭제 핸들러 [Optional]
 * @param {React.ReactNode} topSlot - 상단 슬롯 (히어로 업로드 등) [Optional]
 *
 * Example usage:
 * <FilePageLayout title='전체보기' files={files} onDownload={handleDownload} />
 */
function FilePageLayout({
  title,
  files,
  isLoading = false,
  error,
  viewMode = 'grid',
  sortBy = 'created_at',
  filterType = 'all',
  selectedIds = new Set(),
  onViewModeChange,
  onSortChange,
  onFilterChange,
  onDownload,
  onSelect,
  onDownloadSelected,
  onDelete,
  onDeleteSelected,
  topSlot,
}) {
  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
      {/* 페이지 제목 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant='h1'>{title}</Typography>
        {selectedIds.size > 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant='contained'
              size='small'
              startIcon={<Download sx={{ fontSize: '1rem !important' }} />}
              onClick={onDownloadSelected}
            >
              {selectedIds.size}개 다운로드
            </Button>
            <Button
              variant='outlined'
              size='small'
              color='error'
              startIcon={<DeleteOutlined sx={{ fontSize: '1rem !important' }} />}
              onClick={onDeleteSelected}
            >
              {selectedIds.size}개 삭제
            </Button>
          </Box>
        )}
      </Box>

      {/* 상단 슬롯 (히어로 업로드) */}
      {topSlot && <Box sx={{ mb: 3 }}>{topSlot}</Box>}

      {/* 정렬·필터·뷰 전환 */}
      <Box sx={{ mb: 2 }}>
        <SortFilter
          viewMode={viewMode}
          sortBy={sortBy}
          filterType={filterType}
          totalCount={files.length}
          onViewModeChange={onViewModeChange}
          onSortChange={onSortChange}
          onFilterChange={onFilterChange}
        />
      </Box>

      {/* 오류 */}
      {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={i}>
              <Skeleton variant='rounded' height={160} sx={{ borderRadius: '12px' }} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 빈 상태 */}
      {!isLoading && !error && files.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <Typography variant='h3' sx={{ mb: 1, color: '#CBD5E1' }}>파일이 없습니다</Typography>
          <Typography variant='body2'>업로드 버튼을 눌러 첫 파일을 추가해보세요</Typography>
        </Box>
      )}

      {/* 카드뷰 */}
      {!isLoading && viewMode === 'grid' && files.length > 0 && (
        <Grid container spacing={2}>
          {files.map((file) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={file.id}>
              <FileCard
                file={file}
                isSelected={selectedIds.has(file.id)}
                onSelect={onSelect}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 리스트뷰 */}
      {!isLoading && viewMode === 'list' && files.length > 0 && (
        <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
          {/* 헤더 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <Box sx={{ width: 28 }} />
            <Box sx={{ width: 36 }} />
            <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>파일명</Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', width: 60, display: { xs: 'none', sm: 'block' } }}>형식</Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', width: 72, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>크기</Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', width: 88, textAlign: 'right', display: { xs: 'none', lg: 'block' } }}>업로드</Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', width: 52, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>↓횟수</Typography>
            <Box sx={{ width: 32 }} />
          </Box>
          {files.map((file) => (
            <FileListItem
              key={file.id}
              file={file}
              isSelected={selectedIds.has(file.id)}
              onSelect={onSelect}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default FilePageLayout;
