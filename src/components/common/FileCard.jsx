import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { Download } from '@mui/icons-material';
import FileTypeIcon from './FileTypeIcon';
import { formatBytes, formatDate } from '../../utils/fileUtils';

/**
 * FileCard 컴포넌트 - 파일 카드 아이템 (카드뷰)
 *
 * Props:
 * @param {object} file - 파일 데이터 객체 [Required]
 * @param {boolean} isSelected - 선택 여부 [Optional, 기본값: false]
 * @param {function} onSelect - 체크박스 선택 핸들러 [Optional]
 * @param {function} onDownload - 다운로드 핸들러 [Optional]
 *
 * Example usage:
 * <FileCard file={file} onDownload={handleDownload} />
 */
function FileCard({ file, isSelected = false, onSelect, onDownload }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: '12px',
        border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.15s',
        cursor: 'default',
        position: 'relative',
        bgcolor: '#FFFFFF',
      }}
    >
      {/* 선택 체크박스 */}
      <Box
        sx={{
          position: 'absolute', top: 6, left: 6, zIndex: 1,
          opacity: hovered || isSelected ? 1 : 0, transition: 'opacity 0.15s',
        }}
      >
        <Checkbox
          size='small'
          checked={!!isSelected}
          onChange={(e) => onSelect?.(file.id, e.target.checked)}
          sx={{ p: 0.25, bgcolor: '#FFFFFF', borderRadius: '4px' }}
        />
      </Box>

      {/* 다운로드 버튼 */}
      <Box sx={{ position: 'absolute', top: 6, right: 6, zIndex: 1, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
        <Tooltip title='다운로드'>
          <IconButton
            size='small'
            onClick={() => onDownload?.(file)}
            sx={{ bgcolor: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', '&:hover': { bgcolor: '#EFF6FF' } }}
          >
            <Download sx={{ fontSize: 16, color: '#2563EB' }} />
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent sx={{ p: 2, pt: 2.5, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
          <FileTypeIcon extension={file.extension} size={52} />
        </Box>
        <Typography
          title={file.file_name}
          sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 0.75 }}
        >
          {file.file_name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{formatBytes(file.size)}</Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{formatDate(file.created_at)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
            ↓ {file.download_count || 0}회
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FileCard;
