import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import SortIcon from '@mui/icons-material/Sort';

/**
 * SortFilter 컴포넌트 - 정렬/필터/뷰모드 전환 툴바
 *
 * Props:
 * @param {string} viewMode - 'grid' | 'list' [Optional, 기본값: 'grid']
 * @param {string} sortBy - 정렬 기준 [Optional, 기본값: 'created_at']
 * @param {string} filterType - 파일 타입 필터 [Optional, 기본값: 'all']
 * @param {number} totalCount - 총 파일 수 [Optional, 기본값: 0]
 * @param {function} onViewModeChange - 뷰모드 변경 핸들러 [Optional]
 * @param {function} onSortChange - 정렬 변경 핸들러 [Optional]
 * @param {function} onFilterChange - 필터 변경 핸들러 [Optional]
 *
 * Example usage:
 * <SortFilter viewMode='grid' onViewModeChange={setViewMode} />
 */
function SortFilter({
  viewMode = 'grid',
  sortBy = 'created_at',
  filterType = 'all',
  totalCount = 0,
  onViewModeChange,
  onSortChange,
  onFilterChange,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
      }}
    >
      <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', mr: 'auto' }}>
        {totalCount > 0 ? `${totalCount}개 항목` : ''}
      </Typography>

      {/* 파일 타입 필터 */}
      <Select
        size='small'
        value={filterType}
        onChange={(e) => onFilterChange?.(e.target.value)}
        displayEmpty
        sx={{
          fontSize: '0.8125rem',
          height: 32,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
          '& .MuiSelect-select': { py: 0.5 },
        }}
      >
        <MenuItem value='all' sx={{ fontSize: '0.8125rem' }}>전체 유형</MenuItem>
        <MenuItem value='image' sx={{ fontSize: '0.8125rem' }}>이미지</MenuItem>
        <MenuItem value='video' sx={{ fontSize: '0.8125rem' }}>동영상</MenuItem>
        <MenuItem value='audio' sx={{ fontSize: '0.8125rem' }}>오디오</MenuItem>
        <MenuItem value='pdf' sx={{ fontSize: '0.8125rem' }}>PDF</MenuItem>
        <MenuItem value='doc' sx={{ fontSize: '0.8125rem' }}>문서</MenuItem>
        <MenuItem value='zip' sx={{ fontSize: '0.8125rem' }}>압축</MenuItem>
      </Select>

      {/* 정렬 */}
      <Select
        size='small'
        value={sortBy}
        onChange={(e) => onSortChange?.(e.target.value)}
        startAdornment={<SortIcon sx={{ fontSize: 16, color: '#94A3B8', mr: 0.5 }} />}
        sx={{
          fontSize: '0.8125rem',
          height: 32,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
          '& .MuiSelect-select': { py: 0.5 },
        }}
      >
        <MenuItem value='created_at' sx={{ fontSize: '0.8125rem' }}>최신순</MenuItem>
        <MenuItem value='file_name' sx={{ fontSize: '0.8125rem' }}>이름순</MenuItem>
        <MenuItem value='size' sx={{ fontSize: '0.8125rem' }}>크기순</MenuItem>
        <MenuItem value='download_count' sx={{ fontSize: '0.8125rem' }}>다운로드순</MenuItem>
      </Select>

      {/* 뷰모드 전환 */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(_, v) => v && onViewModeChange?.(v)}
        size='small'
        sx={{ height: 32 }}
      >
        <Tooltip title='카드뷰'>
          <ToggleButton value='grid' sx={{ px: 1, border: '1px solid #E2E8F0' }}>
            <GridViewIcon sx={{ fontSize: 16 }} />
          </ToggleButton>
        </Tooltip>
        <Tooltip title='리스트뷰'>
          <ToggleButton value='list' sx={{ px: 1, border: '1px solid #E2E8F0' }}>
            <ViewListIcon sx={{ fontSize: 16 }} />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  );
}

export default SortFilter;
