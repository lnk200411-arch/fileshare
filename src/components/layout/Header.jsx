import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import FolderIcon from '@mui/icons-material/Folder';

const NAV_ITEMS = [
  { label: '전체보기', path: '/' },
  { label: '최근 업로드', path: '/recent-upload' },
  { label: '인기 다운로드', path: '/popular' },
  { label: '폴더 탐색', path: '/folders' },
  { label: '최근 다운로드', path: '/recent-download' },
  { label: '방명록', path: '/guestbook' },
];

/**
 * Header 컴포넌트 - 상단 앱바 (로고 + 네비 + 검색 + 업로드)
 *
 * Props:
 * @param {function} onUploadClick - 업로드 버튼 클릭 핸들러 [Required]
 * @param {function} onSearch - 검색어 변경 핸들러 [Required]
 * @param {string} searchQuery - 현재 검색어 [Optional, 기본값: '']
 *
 * Example usage:
 * <Header onUploadClick={handleUpload} onSearch={setSearchQuery} searchQuery={searchQuery} />
 */
function Header({ onSearch, searchQuery = '' }) {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSearch = () => onSearch(inputValue);

  return (
    <>
      <AppBar
        position='sticky'
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          color: '#0F172A',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: '56px !important', px: { xs: 2, md: 3 } }}>
          {/* 모바일 햄버거 */}
          <IconButton
            size='small'
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { md: 'none' }, mr: 0.5 }}
          >
            <MenuIcon fontSize='small' />
          </IconButton>

          {/* 로고 */}
          <Box
            component={Link}
            to='/'
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, textDecoration: 'none', flexShrink: 0 }}
          >
            <FolderIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography sx={{ fontSize: '30px', fontWeight: 700, color: '#0F172A' }}>
              NK_FILEShare
            </Typography>
          </Box>

          {/* 데스크톱 네비 */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.25, mx: 1 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  size='small'
                  sx={{
                    color: isActive ? '#2563EB' : '#64748B',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.8125rem',
                    px: 1.25,
                    py: 0.5,
                    bgcolor: isActive ? '#EFF6FF' : 'transparent',
                    borderRadius: '6px',
                    '&:hover': { bgcolor: '#F1F5F9', color: '#0F172A' },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* 검색 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#F1F5F9',
              borderRadius: '8px',
              px: 1.5,
              py: 0.5,
              gap: 1,
              width: { xs: 130, sm: 200, md: 240 },
              border: '1px solid transparent',
              '&:focus-within': { border: '1px solid #2563EB', bgcolor: '#fff' },
              transition: 'all 0.15s',
            }}
          >
            <SearchIcon sx={{ fontSize: 16, color: '#94A3B8', flexShrink: 0 }} />
            <InputBase
              placeholder='파일 검색...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ flex: 1, fontSize: '0.8125rem', '& input': { padding: 0 } }}
            />
          </Box>

          {/* 검색 버튼 */}
          <Button
            variant='contained'
            startIcon={<SearchIcon sx={{ fontSize: '1rem !important' }} />}
            onClick={handleSearch}
            size='small'
            sx={{ flexShrink: 0, px: { xs: 1.5, sm: 2 }, fontSize: '0.875rem' }}
          >
            <Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>검색</Box>
          </Button>
        </Toolbar>
      </AppBar>

      {/* 모바일 드로어 */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <Typography sx={{ px: 2, pb: 1, fontSize: '1rem', fontWeight: 700, color: '#2563EB' }}>
            FileShare
          </Typography>
          <List dense>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: '6px', mx: 1, mb: 0.25,
                  '&.Mui-selected': { bgcolor: '#EFF6FF', color: '#2563EB' },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: location.pathname === item.path ? 600 : 400 }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Header;
