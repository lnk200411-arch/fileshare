import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Breadcrumb from './Breadcrumb';
import SortFilter from './SortFilter';
import FileGrid from './FileGrid';
import RenameDialog from './RenameDialog';
import { useFiles } from '../../hooks/useFiles';
import { useFileActions } from '../../hooks/useFileActions';

/**
 * PageContainer 컴포넌트 - 6개 페이지 공통 레이아웃
 *
 * Props:
 * @param {string} title - 페이지 제목 [Required]
 * @param {string} mode - useFiles 모드 [Required]
 * @param {object} user - 현재 사용자 [Optional]
 * @param {string} searchQuery - 검색어 [Optional]
 * @param {number} refreshKey - 외부 리프레시 트리거 [Optional]
 * @param {string} emptyMessage - 빈 목록 메시지 [Optional]
 * @param {boolean} isTrash - 휴지통 모드 여부 [Optional]
 *
 * Example usage:
 * <PageContainer title='전체보기' mode='all' user={user} />
 */
function PageContainer({ title, mode, user, searchQuery, refreshKey, emptyMessage, isTrash }) {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterType, setFilterType] = useState('all');
  const [internalRefresh, setInternalRefresh] = useState(0);
  const [renameTarget, setRenameTarget] = useState(null);

  const refresh = () => setInternalRefresh((k) => k + 1);

  const { files, isLoading } = useFiles({
    mode,
    userId: user?.id,
    searchQuery,
    sortBy,
    filterType,
    refreshKey: refreshKey + internalRefresh,
  });

  const {
    favoriteIds, selectedIds,
    loadFavorites, toggleFavorite,
    downloadFile, downloadSelected,
    deleteFile, restoreFile, permanentDelete,
    renameFile, handleSelect, clearSelection,
  } = useFileActions({ userId: user?.id, onRefresh: refresh });

  useEffect(() => { loadFavorites(); }, [loadFavorites, refreshKey]);

  const hasSelection = selectedIds.size > 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumb />
        <Typography variant='h1' sx={{ mt: 1, mb: 0.5 }}>{title}</Typography>
      </Box>

      {/* 다중 선택 액션 바 */}
      <Collapse in={hasSelection}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            p: 1.5,
            bgcolor: '#EFF6FF',
            borderRadius: '10px',
            border: '1px solid #BFDBFE',
          }}
        >
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB' }}>
            {selectedIds.size}개 선택됨
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Button
            size='small'
            startIcon={<DownloadIcon />}
            onClick={() => downloadSelected(files)}
            sx={{ fontSize: '0.8125rem' }}
          >
            다운로드
          </Button>
          {!isTrash && (
            <Button
              size='small'
              startIcon={<DeleteOutlinedIcon />}
              color='error'
              onClick={async () => {
                for (const id of selectedIds) await deleteFile(id);
                clearSelection();
              }}
              sx={{ fontSize: '0.8125rem' }}
            >
              삭제
            </Button>
          )}
          <Button size='small' onClick={clearSelection} sx={{ fontSize: '0.8125rem', color: '#64748B' }}>
            취소
          </Button>
        </Box>
      </Collapse>

      {/* 정렬/필터 툴바 */}
      <Box sx={{ mb: 2 }}>
        <SortFilter
          viewMode={viewMode}
          sortBy={sortBy}
          filterType={filterType}
          totalCount={files.length}
          onViewModeChange={setViewMode}
          onSortChange={setSortBy}
          onFilterChange={setFilterType}
        />
      </Box>

      {/* 파일 목록 */}
      <FileGrid
        files={files}
        viewMode={viewMode}
        isLoading={isLoading}
        selectedIds={selectedIds}
        favoriteIds={favoriteIds}
        onSelect={handleSelect}
        onDownload={downloadFile}
        onRename={setRenameTarget}
        onDelete={isTrash ? permanentDelete : deleteFile}
        onToggleFavorite={toggleFavorite}
        emptyMessage={emptyMessage}
      />

      {/* 이름 변경 다이얼로그 */}
      {renameTarget && (
        <RenameDialog
          file={renameTarget}
          onClose={() => setRenameTarget(null)}
          onConfirm={async (newName) => {
            await renameFile(renameTarget.id, newName);
            setRenameTarget(null);
          }}
        />
      )}
    </Box>
  );
}

export default PageContainer;
