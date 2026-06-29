import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import FileGrid from '../components/common/FileGrid';
import SortFilter from '../components/common/SortFilter';
import { useFiles } from '../hooks/useFiles';
import { useFileActions } from '../hooks/useFileActions';

function TrashPage({ user, searchQuery, refreshKey }) {
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterType, setFilterType] = useState('all');
  const [internalRefresh, setInternalRefresh] = useState(0);

  const refresh = () => setInternalRefresh((k) => k + 1);

  const { files, isLoading } = useFiles({
    mode: 'trash',
    userId: user?.id,
    searchQuery,
    sortBy,
    filterType,
    refreshKey: refreshKey + internalRefresh,
  });

  const { selectedIds, handleSelect, clearSelection, restoreFile, permanentDelete } = useFileActions({
    userId: user?.id,
    onRefresh: refresh,
  });

  const hasSelection = selectedIds.size > 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant='h1'>휴지통</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mt: 0.5 }}>
            삭제된 파일은 30일 후 자동으로 영구 삭제됩니다.
          </Typography>
        </Box>
      </Box>

      <Alert
        severity='warning'
        sx={{ mb: 2, borderRadius: '10px', fontSize: '0.8125rem' }}
      >
        이 폴더의 파일은 30일 후 자동으로 영구 삭제됩니다.
      </Alert>

      {hasSelection && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, p: 1.5, bgcolor: '#FFF7ED', borderRadius: '10px', border: '1px solid #FED7AA' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#EA580C' }}>
            {selectedIds.size}개 선택됨
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Button
            size='small'
            startIcon={<RestoreIcon />}
            onClick={async () => {
              for (const id of selectedIds) await restoreFile(id);
              clearSelection();
            }}
            sx={{ fontSize: '0.8125rem', color: '#2563EB' }}
          >
            복구
          </Button>
          <Button
            size='small'
            startIcon={<DeleteForeverIcon />}
            color='error'
            onClick={async () => {
              const targets = files.filter((f) => selectedIds.has(f.id));
              for (const f of targets) await permanentDelete(f);
              clearSelection();
            }}
            sx={{ fontSize: '0.8125rem' }}
          >
            영구 삭제
          </Button>
          <Button size='small' onClick={clearSelection} sx={{ fontSize: '0.8125rem', color: '#64748B' }}>
            취소
          </Button>
        </Box>
      )}

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

      <FileGrid
        files={files}
        viewMode={viewMode}
        isLoading={isLoading}
        selectedIds={selectedIds}
        favoriteIds={new Set()}
        onSelect={handleSelect}
        onDelete={(file) => permanentDelete(typeof file === 'object' ? file : files.find((f) => f.id === file))}
        emptyMessage='휴지통이 비어 있습니다.'
      />
    </Box>
  );
}

export default TrashPage;
