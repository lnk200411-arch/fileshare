import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Header from './Header';

/**
 * AppLayout 컴포넌트 - Header + Main + Footer
 *
 * Props:
 * @param {React.ReactNode} children - 메인 콘텐츠 영역 [Required]
 * @param {function} onUploadClick - 업로드 버튼 핸들러 [Required]
 * @param {function} onSearch - 검색 핸들러 [Required]
 * @param {string} searchQuery - 현재 검색어 [Optional]
 *
 * Example usage:
 * <AppLayout onUploadClick={handleUpload} onSearch={setSearch}>{children}</AppLayout>
 */
function AppLayout({ children, onUploadClick, onSearch, searchQuery }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Header onUploadClick={onUploadClick} onSearch={onSearch} searchQuery={searchQuery} />
      <Box component='main' sx={{ flex: 1 }}>
        {children}
      </Box>
      <Box
        component='footer'
        sx={{
          borderTop: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          py: 2,
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant='caption' color='text.secondary'>
          FileShare — 로그인 없이 바로 파일 공유
        </Typography>
      </Box>
    </Box>
  );
}

export default AppLayout;
