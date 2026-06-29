import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { Download, DeleteOutlined } from '@mui/icons-material';
import FileTypeIcon from './FileTypeIcon';
import { formatBytes, formatDate } from '../../utils/fileUtils';

/**
 * FileListItem 컴포넌트 - 파일 리스트 행 아이템
 *
 * Props:
 * @param {object} file - 파일 데이터 객체 [Required]
 * @param {boolean} isSelected - 선택 여부 [Optional, 기본값: false]
 * @param {function} onSelect - 체크박스 선택 핸들러 [Optional]
 * @param {function} onDownload - 다운로드 핸들러 [Optional]
 * @param {function} onDelete - 삭제 핸들러 [Optional]
 *
 * Example usage:
 * <FileListItem file={file} onDownload={handleDownload} onDelete={handleDelete} />
 */
function FileListItem({ file, isSelected = false, onSelect, onDownload, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.25,
        bgcolor: isSelected ? '#EFF6FF' : hovered ? '#F8FAFC' : '#FFFFFF',
        borderBottom: '1px solid #F1F5F9',
        transition: 'background 0.1s',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* 체크박스 */}
      <Checkbox
        size='small'
        checked={!!isSelected}
        onChange={(e) => onSelect?.(file.id, e.target.checked)}
        sx={{ p: 0.25, opacity: hovered || isSelected ? 1 : 0.3, transition: 'opacity 0.15s' }}
      />

      {/* 아이콘 */}
      <FileTypeIcon extension={file.extension} size={36} showExt={false} />

      {/* 파일명 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          title={file.file_name}
          sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {file.file_name}
        </Typography>
      </Box>

      {/* 확장자 */}
      <Chip
        label={(file.extension || 'file').toUpperCase()}
        size='small'
        sx={{ fontSize: '0.6875rem', fontWeight: 600, height: 20, display: { xs: 'none', sm: 'flex' } }}
      />

      {/* 크기 */}
      <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', width: 72, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
        {formatBytes(file.size)}
      </Typography>

      {/* 업로드 시간 */}
      <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', width: 88, textAlign: 'right', display: { xs: 'none', lg: 'block' } }}>
        {formatDate(file.created_at)}
      </Typography>

      {/* 다운로드 수 */}
      <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', width: 52, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
        ↓ {file.download_count || 0}
      </Typography>

      {/* 다운로드 버튼 */}
      <Tooltip title='다운로드'>
        <IconButton
          size='small'
          onClick={() => onDownload?.(file)}
          sx={{ opacity: hovered ? 1 : 0.4, transition: 'opacity 0.15s', color: '#2563EB' }}
        >
          <Download sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      {/* 삭제 버튼 */}
      <Tooltip title='삭제'>
        <IconButton
          size='small'
          onClick={() => onDelete?.(file)}
          sx={{ opacity: hovered ? 1 : 0.4, transition: 'opacity 0.15s', color: '#EF4444' }}
        >
          <DeleteOutlined sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default FileListItem;
