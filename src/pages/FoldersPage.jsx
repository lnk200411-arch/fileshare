import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { Folder, CreateNewFolder, ArrowBack, NavigateNext } from '@mui/icons-material';
import { fetchFolders, createFolder, fetchFolderPath } from '../lib/foldersApi';
import { useFiles } from '../hooks/useFiles';
import FilePageLayout from '../components/common/FilePageLayout';
import HeroUpload from '../components/common/HeroUpload';

/**
 * FoldersPage - 폴더 탐색 (계층 구조 이동)
 */
function FoldersPage({ refreshKey = 0 }) {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [folders, setFolders] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [foldersError, setFoldersError] = useState(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);
  const [internalRefresh, setInternalRefresh] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  const { files, isLoading: filesLoading, error: filesError, handleDownload, handleDelete, selectedIds, toggleSelect, downloadSelected, deleteSelected } = useFiles(
    { folderId: currentFolderId },
    refreshKey + internalRefresh
  );

  const loadFolders = useCallback(async () => {
    setFoldersLoading(true);
    setFoldersError(null);
    try {
      const data = await fetchFolders(currentFolderId);
      setFolders(data);
    } catch (err) {
      setFoldersError(err.message);
    } finally {
      setFoldersLoading(false);
    }
  }, [currentFolderId, internalRefresh]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadFolders(); }, [loadFolders]);

  const handleFolderClick = useCallback(async (folder) => {
    setCurrentFolderId(folder.id);
    if (folder.id) {
      const path = await fetchFolderPath(folder.id);
      setBreadcrumb(path);
    }
  }, []);

  const handleBreadcrumbClick = useCallback(async (id) => {
    setCurrentFolderId(id);
    if (id === null) {
      setBreadcrumb([]);
    } else {
      const path = await fetchFolderPath(id);
      setBreadcrumb(path);
    }
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setCreating(true);
    try {
      await createFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName('');
      setNewFolderOpen(false);
      setInternalRefresh((k) => k + 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {currentFolderId && (
            <Button
              size='small'
              startIcon={<ArrowBack sx={{ fontSize: '1rem !important' }} />}
              onClick={() => {
                const parent = breadcrumb.length > 1 ? breadcrumb[breadcrumb.length - 2].id : null;
                handleBreadcrumbClick(parent);
              }}
              sx={{ mr: 1 }}
            >
              뒤로
            </Button>
          )}
          <Typography variant='h1'>폴더 탐색</Typography>
        </Box>
        <Button
          variant='outlined'
          size='small'
          startIcon={<CreateNewFolder sx={{ fontSize: '1rem !important' }} />}
          onClick={() => setNewFolderOpen(true)}
        >
          새 폴더
        </Button>
      </Box>

      {/* 브레드크럼 */}
      <Breadcrumbs separator={<NavigateNext fontSize='small' />} sx={{ mb: 3 }}>
        <Box
          onClick={() => handleBreadcrumbClick(null)}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5, color: currentFolderId ? 'primary.main' : 'text.primary', '&:hover': { textDecoration: 'underline' } }}
        >
          <Folder sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: currentFolderId ? 400 : 600 }}>루트</Typography>
        </Box>
        {breadcrumb.map((b, i) => (
          <Box
            key={b.id}
            onClick={() => handleBreadcrumbClick(b.id)}
            sx={{ cursor: 'pointer', color: i === breadcrumb.length - 1 ? 'text.primary' : 'primary.main', '&:hover': { textDecoration: 'underline' } }}
          >
            <Typography sx={{ fontSize: '0.875rem', fontWeight: i === breadcrumb.length - 1 ? 600 : 400 }}>{b.name}</Typography>
          </Box>
        ))}
      </Breadcrumbs>

      {/* 하위 폴더 목록 */}
      {foldersError && <Alert severity='error' sx={{ mb: 2 }}>{foldersError}</Alert>}
      {foldersLoading ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[1, 2, 3].map((i) => <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}><Skeleton variant='rounded' height={80} /></Grid>)}
        </Grid>
      ) : folders.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {folders.map((folder) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={folder.id}>
              <Card
                onClick={() => handleFolderClick(folder)}
                sx={{ cursor: 'pointer', '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF' }, transition: 'all 0.15s' }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, '&:last-child': { pb: 2 } }}>
                  <Folder sx={{ color: '#F59E0B', fontSize: 28 }} />
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {folder.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}

      {/* 현재 폴더 파일 + 업로드 */}
      <FilePageLayout
        title='이 폴더의 파일'
        files={files}
        isLoading={filesLoading}
        error={filesError}
        viewMode={viewMode}
        selectedIds={selectedIds}
        onViewModeChange={setViewMode}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onSelect={toggleSelect}
        onDownloadSelected={downloadSelected}
        onDeleteSelected={deleteSelected}
        topSlot={
          <HeroUpload onSuccess={() => setInternalRefresh((k) => k + 1)} />
        }
      />

      {/* 새 폴더 다이얼로그 */}
      <Dialog open={newFolderOpen} onClose={() => setNewFolderOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>새 폴더 만들기</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label='폴더 이름'
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderOpen(false)}>취소</Button>
          <Button variant='contained' onClick={handleCreateFolder} disabled={creating || !newFolderName.trim()}>
            만들기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FoldersPage;
