import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import AppsIcon from '@mui/icons-material/Apps';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useLocation } from 'react-router-dom';

const SIDEBAR_WIDTH = 220;

const navItems = [
  { label: '전체보기', icon: <AppsIcon fontSize='small' />, path: '/' },
  { label: '내 파일', icon: <FolderIcon fontSize='small' />, path: '/my-files' },
  { label: '공유 파일', icon: <PeopleIcon fontSize='small' />, path: '/shared' },
  { label: '최근 항목', icon: <AccessTimeIcon fontSize='small' />, path: '/recent' },
  { label: '즐겨찾기', icon: <StarIcon fontSize='small' />, path: '/favorites' },
];

/**
 * Sidebar 컴포넌트 - 좌측 고정 네비게이션
 *
 * Props:
 * @param {boolean} isOpen - 모바일 드로어 열림 여부 [Optional, 기본값: true]
 *
 * Example usage:
 * <Sidebar isOpen={true} />
 */
function Sidebar({ isOpen = true }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: '100vh',
        bgcolor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* 상단 로고 */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #E2E8F0' }}>
        <Typography
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#2563EB',
            letterSpacing: '-0.02em',
          }}
        >
          FileShare
        </Typography>
      </Box>

      {/* 네비게이션 */}
      <List sx={{ px: 1, py: 1.5, flex: 1 }} disablePadding>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={isActive}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                py: 1,
                px: 1.5,
                '&.Mui-selected': {
                  bgcolor: '#EFF6FF',
                  color: '#2563EB',
                  '& .MuiListItemIcon-root': { color: '#2563EB' },
                  '&:hover': { bgcolor: '#DBEAFE' },
                },
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: '#64748B' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}

        <Divider sx={{ my: 1, borderColor: '#E2E8F0' }} />

        <ListItemButton
          onClick={() => navigate('/trash')}
          selected={pathname === '/trash'}
          sx={{
            borderRadius: '8px',
            mb: 0.5,
            py: 1,
            px: 1.5,
            '&.Mui-selected': {
              bgcolor: '#FFF1F2',
              color: '#E11D48',
              '& .MuiListItemIcon-root': { color: '#E11D48' },
              '&:hover': { bgcolor: '#FFE4E6' },
            },
            '&:hover': { bgcolor: '#F8FAFC' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: '#64748B' }}>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText
            primary='휴지통'
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: pathname === '/trash' ? 600 : 500,
            }}
          />
        </ListItemButton>
      </List>

      {/* 스토리지 사용량 */}
      <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
            저장 공간
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            1GB 중
          </Typography>
        </Box>
        <LinearProgress
          variant='determinate'
          value={0}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: '#E2E8F0',
            '& .MuiLinearProgress-bar': { bgcolor: '#2563EB', borderRadius: 2 },
          }}
        />
        <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', mt: 0.5 }}>
          0 MB 사용 중
        </Typography>
      </Box>
    </Box>
  );
}

export { SIDEBAR_WIDTH };
export default Sidebar;
