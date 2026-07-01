import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AllFilesPage from './pages/AllFilesPage';
import RecentUploadPage from './pages/RecentUploadPage';
import PopularPage from './pages/PopularPage';
import FoldersPage from './pages/FoldersPage';
import RecentDownloadPage from './pages/RecentDownloadPage';
import GuestbookPage from './pages/GuestbookPage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleUploadClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pageProps = { searchQuery, refreshKey, onUploadSuccess: handleUploadSuccess };

  return (
    <BrowserRouter basename='/fileshare'>
      <AppLayout
        onUploadClick={handleUploadClick}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      >
        <Routes>
          <Route path='/' element={<AllFilesPage {...pageProps} />} />
          <Route path='/recent-upload' element={<RecentUploadPage searchQuery={searchQuery} refreshKey={refreshKey} />} />
          <Route path='/popular' element={<PopularPage searchQuery={searchQuery} refreshKey={refreshKey} />} />
          <Route path='/folders' element={<FoldersPage refreshKey={refreshKey} />} />
          <Route path='/recent-download' element={<RecentDownloadPage refreshKey={refreshKey} />} />
          <Route path='/guestbook' element={<GuestbookPage />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
