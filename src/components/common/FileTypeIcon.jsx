import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import CodeIcon from '@mui/icons-material/Code';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { getFileType } from '../../utils/fileUtils';

const ICON_MAP = {
  image: ImageIcon,
  video: VideoFileIcon,
  audio: AudioFileIcon,
  pdf: PictureAsPdfIcon,
  doc: DescriptionIcon,
  sheet: TableChartIcon,
  ppt: SlideshowIcon,
  zip: FolderZipIcon,
  code: CodeIcon,
  other: InsertDriveFileIcon,
};

/**
 * FileTypeIcon 컴포넌트 - 확장자 기반 파일 타입 아이콘
 *
 * Props:
 * @param {string} extension - 파일 확장자 [Required]
 * @param {number} size - 아이콘 박스 크기(px) [Optional, 기본값: 40]
 * @param {boolean} showExt - 확장자 텍스트 표시 여부 [Optional, 기본값: true]
 *
 * Example usage:
 * <FileTypeIcon extension='pdf' size={40} />
 */
function FileTypeIcon({ extension, size = 40, showExt = true }) {
  const { type, color } = getFileType(extension);
  const IconComponent = ICON_MAP[type] || InsertDriveFileIcon;
  const ext = (extension || '').toUpperCase().slice(0, 4);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '8px',
        bgcolor: `${color}18`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.25,
        flexShrink: 0,
      }}
    >
      <IconComponent sx={{ fontSize: size * 0.5, color }} />
      {showExt && ext && (
        <Typography
          sx={{
            fontSize: '0.5rem',
            fontWeight: 700,
            color,
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          {ext}
        </Typography>
      )}
    </Box>
  );
}

export default FileTypeIcon;
