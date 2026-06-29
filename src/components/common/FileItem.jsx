import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ShareIcon from '@mui/icons-material/Share';
import FileTypeIcon from './FileTypeIcon';
import { formatBytes, formatDate } from '../../utils/fileUtils';

/**
 * FileItem 컴포넌트 - 파일 행 아이템 (리스트뷰)
 *
 * Props:
 * @param {object} file - 파일 데이터 객체 [Required]
 * @param {boolean} isSelected - 선택 여부 [Optional, 기본값: false]
 * @param {boolean} isFavorite - 즐겨찾기 여부 [Optional, 기본값: false]
 * @param {function} onSelect - 체크박스 선택 핸들러 [Optional]
 * @param {function} onDownload - 다운로드 핸들러 [Optional]
 * @param {function} onRename - 이름변경 핸들러 [Optional]
 * @param {function} onDelete - 삭제 핸들러 [Optional]
 * @param {function} onToggleFavorite - 즐겨찾기 토글 [Optional]
 *
 * Example usage:
 * <FileItem file={file} isSelected={false} onDownload={handleDownload} />
 */
function FileItem({ file, isSelected, isFavorite, onSelect, onDownload, onRename, onDelete, onToggleFavorite }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.25,
        borderBottom: '1px solid #F1F5F9',
        bgcolor: isSelected ? '#EFF6FF' : '#FFFFFF',
        '&:hover': { bgcolor: isSelected ? '#EFF6FF' : '#F8FAFC' },
        transition: 'background-color 0.1s',
        cursor: 'default',
      }}
    >
      <Checkbox
        size='small'
        checked={!!isSelected}
        onChange={(e) => onSelect?.(file.id, e.target.checked)}
        sx={{ p: 0.5, color: '#CBD5E1', '&.Mui-checked': { color: '#2563EB' } }}
      />

      <FileTypeIcon extension={file.extension} size={36} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#0F172A',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {file.file_name}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
          {formatDate(file.created_at)}
        </Typography>
      </Box>

      {file.is_shared && (
        <Chip
          label='공유됨'
          size='small'
          sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontSize: '0.6875rem', height: 20 }}
        />
      )}

      <Typography
        sx={{
          fontSize: '0.8125rem',
          color: '#64748B',
          minWidth: 72,
          textAlign: 'right',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {formatBytes(file.size)}
      </Typography>

      <Tooltip title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}>
        <IconButton size='small' onClick={() => onToggleFavorite?.(file.id)}>
          {isFavorite
            ? <StarIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
            : <StarBorderIcon sx={{ fontSize: 18, color: '#CBD5E1' }} />
          }
        </IconButton>
      </Tooltip>

      <Tooltip title='다운로드'>
        <IconButton size='small' onClick={() => onDownload?.(file)}>
          <DownloadIcon sx={{ fontSize: 18, color: '#64748B' }} />
        </IconButton>
      </Tooltip>

      <IconButton size='small' onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: '10px', border: '1px solid #E2E8F0', minWidth: 160 } }}
      >
        <MenuItem
          onClick={() => { onDownload?.(file); handleMenuClose(); }}
          sx={{ gap: 1.5, fontSize: '0.875rem' }}
        >
          <DownloadIcon fontSize='small' sx={{ color: '#64748B' }} />
          다운로드
        </MenuItem>
        <MenuItem
          onClick={() => { onRename?.(file); handleMenuClose(); }}
          sx={{ gap: 1.5, fontSize: '0.875rem' }}
        >
          <DriveFileRenameOutlineIcon fontSize='small' sx={{ color: '#64748B' }} />
          이름 변경
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, fontSize: '0.875rem' }}>
          <ShareIcon fontSize='small' sx={{ color: '#64748B' }} />
          공유
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => { onDelete?.(file.id); handleMenuClose(); }}
          sx={{ gap: 1.5, fontSize: '0.875rem', color: '#E11D48' }}
        >
          <DeleteOutlinedIcon fontSize='small' />
          삭제
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default FileItem;
