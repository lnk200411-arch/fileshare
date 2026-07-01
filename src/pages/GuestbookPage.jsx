import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import { EditOutlined, DeleteOutlined, BorderColor } from '@mui/icons-material';
import { fetchGuestbook, createEntry, updateEntry, deleteEntry } from '../lib/guestbookApi';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const EMPTY_WRITE = { nickname: '', message: '', password: '' };
const EMPTY_EDIT = { open: false, id: null, message: '', password: '', loading: false, error: '' };
const EMPTY_DELETE = { open: false, id: null, nickname: '', password: '', loading: false, error: '' };

/**
 * GuestbookPage - 방명록 페이지
 */
function GuestbookPage() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [writeForm, setWriteForm] = useState(EMPTY_WRITE);
  const [writeLoading, setWriteLoading] = useState(false);
  const [writeError, setWriteError] = useState('');
  const [editDialog, setEditDialog] = useState(EMPTY_EDIT);
  const [deleteDialog, setDeleteDialog] = useState(EMPTY_DELETE);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await fetchGuestbook();
      setEntries(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleWriteChange = (field) => (e) =>
    setWriteForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCreate = async () => {
    if (!writeForm.nickname.trim()) { setWriteError('닉네임을 입력해주세요.'); return; }
    if (!writeForm.message.trim()) { setWriteError('내용을 입력해주세요.'); return; }
    if (!writeForm.password) { setWriteError('비밀번호를 입력해주세요.'); return; }
    setWriteLoading(true);
    setWriteError('');
    try {
      const entry = await createEntry(writeForm.nickname.trim(), writeForm.message.trim(), writeForm.password);
      setEntries((prev) => [entry, ...prev]);
      setWriteForm(EMPTY_WRITE);
    } catch (err) {
      setWriteError(err.message);
    } finally {
      setWriteLoading(false);
    }
  };

  const openEdit = (entry) =>
    setEditDialog({ open: true, id: entry.id, message: entry.message, password: '', loading: false, error: '' });

  const handleEdit = async () => {
    if (!editDialog.message.trim()) { setEditDialog((p) => ({ ...p, error: '내용을 입력해주세요.' })); return; }
    if (!editDialog.password) { setEditDialog((p) => ({ ...p, error: '비밀번호를 입력해주세요.' })); return; }
    setEditDialog((p) => ({ ...p, loading: true, error: '' }));
    try {
      const updated = await updateEntry(editDialog.id, editDialog.message.trim(), editDialog.password);
      setEntries((prev) => prev.map((e) => e.id === updated.id ? updated : e));
      setEditDialog(EMPTY_EDIT);
    } catch (err) {
      setEditDialog((p) => ({ ...p, loading: false, error: err.message }));
    }
  };

  const openDelete = (entry) =>
    setDeleteDialog({ open: true, id: entry.id, nickname: entry.nickname, password: '', loading: false, error: '' });

  const handleDelete = async () => {
    if (!deleteDialog.password) { setDeleteDialog((p) => ({ ...p, error: '비밀번호를 입력해주세요.' })); return; }
    setDeleteDialog((p) => ({ ...p, loading: true, error: '' }));
    try {
      await deleteEntry(deleteDialog.id, deleteDialog.password);
      setEntries((prev) => prev.filter((e) => e.id !== deleteDialog.id));
      setDeleteDialog(EMPTY_DELETE);
    } catch (err) {
      setDeleteDialog((p) => ({ ...p, loading: false, error: err.message }));
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <BorderColor sx={{ color: 'primary.main', fontSize: 28 }} />
        <Box>
          <Typography variant='h1' sx={{ fontSize: '1.5rem', fontWeight: 700 }}>방명록</Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>
            {isLoading ? '' : `총 ${entries.length}개의 방명록이 있습니다`}
          </Typography>
        </Box>
      </Box>

      {/* 작성 폼 */}
      <Card variant='outlined' sx={{ mb: 4, borderRadius: '12px', borderColor: '#2563EB', bgcolor: '#F0F7FF' }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E40AF', mb: 2 }}>
            방명록 작성
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              label='닉네임'
              size='small'
              value={writeForm.nickname}
              onChange={handleWriteChange('nickname')}
              sx={{ flex: 1, minWidth: 120, bgcolor: '#fff', borderRadius: 1 }}
              inputProps={{ maxLength: 20 }}
            />
            <TextField
              label='비밀번호'
              type='password'
              size='small'
              value={writeForm.password}
              onChange={handleWriteChange('password')}
              sx={{ flex: 1, minWidth: 120, bgcolor: '#fff', borderRadius: 1 }}
              inputProps={{ maxLength: 20 }}
              helperText='수정·삭제 시 필요합니다'
            />
          </Box>
          <TextField
            label='내용'
            multiline
            rows={3}
            fullWidth
            size='small'
            value={writeForm.message}
            onChange={handleWriteChange('message')}
            sx={{ mb: 1.5, bgcolor: '#fff', borderRadius: 1 }}
            inputProps={{ maxLength: 500 }}
          />
          {writeError && <Alert severity='error' sx={{ mb: 1.5, py: 0 }}>{writeError}</Alert>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant='contained'
              onClick={handleCreate}
              disabled={writeLoading}
              sx={{ px: 3 }}
            >
              {writeLoading ? '작성 중...' : '작성하기'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 오류 */}
      {loadError && <Alert severity='error' sx={{ mb: 2 }}>{loadError}</Alert>}

      {/* 로딩 */}
      {isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} variant='rounded' height={100} sx={{ borderRadius: '12px' }} />)}
        </Box>
      )}

      {/* 빈 상태 */}
      {!isLoading && !loadError && entries.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <Typography sx={{ fontSize: '2rem', mb: 1 }}>✍️</Typography>
          <Typography variant='h3' sx={{ mb: 1, color: '#CBD5E1' }}>아직 방명록이 없습니다</Typography>
          <Typography variant='body2'>첫 번째 방명록을 남겨보세요!</Typography>
        </Box>
      )}

      {/* 방명록 목록 */}
      {!isLoading && entries.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {entries.map((entry, idx) => (
            <Card
              key={entry.id}
              variant='outlined'
              sx={{ borderRadius: '12px', borderColor: '#E2E8F0', '&:hover': { borderColor: '#94A3B8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }, transition: 'all 0.15s' }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: `hsl(${(idx * 47) % 360}, 60%, 55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fff' }}>
                        {entry.nickname.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>
                        {entry.nickname}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        {formatDate(entry.created_at)}
                        {entry.updated_at !== entry.created_at && ' (수정됨)'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <Tooltip title='수정'>
                      <IconButton size='small' onClick={() => openEdit(entry)} sx={{ color: '#64748B', '&:hover': { color: '#2563EB', bgcolor: '#EFF6FF' } }}>
                        <EditOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='삭제'>
                      <IconButton size='small' onClick={() => openDelete(entry)} sx={{ color: '#64748B', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' } }}>
                        <DeleteOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Divider sx={{ my: 1, borderColor: '#F1F5F9' }} />
                <Typography sx={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {entry.message}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* 수정 다이얼로그 */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog(EMPTY_EDIT)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>방명록 수정</DialogTitle>
        <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label='내용'
            multiline
            rows={4}
            fullWidth
            value={editDialog.message}
            onChange={(e) => setEditDialog((p) => ({ ...p, message: e.target.value }))}
            inputProps={{ maxLength: 500 }}
          />
          <TextField
            label='비밀번호 확인'
            type='password'
            fullWidth
            value={editDialog.password}
            onChange={(e) => setEditDialog((p) => ({ ...p, password: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            helperText='작성 시 설정한 비밀번호를 입력하세요'
          />
          {editDialog.error && <Alert severity='error' sx={{ py: 0 }}>{editDialog.error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialog(EMPTY_EDIT)}>취소</Button>
          <Button variant='contained' onClick={handleEdit} disabled={editDialog.loading}>
            {editDialog.loading ? '수정 중...' : '수정 완료'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 다이얼로그 */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog(EMPTY_DELETE)} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>방명록 삭제</DialogTitle>
        <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: '0.9375rem', color: '#475569' }}>
            <Box component='span' sx={{ fontWeight: 600, color: '#0F172A' }}>{deleteDialog.nickname}</Box>님의 방명록을 삭제하시겠습니까?
          </Typography>
          <TextField
            label='비밀번호 확인'
            type='password'
            fullWidth
            value={deleteDialog.password}
            onChange={(e) => setDeleteDialog((p) => ({ ...p, password: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
            helperText='작성 시 설정한 비밀번호를 입력하세요'
            autoFocus
          />
          {deleteDialog.error && <Alert severity='error' sx={{ py: 0 }}>{deleteDialog.error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog(EMPTY_DELETE)}>취소</Button>
          <Button variant='contained' color='error' onClick={handleDelete} disabled={deleteDialog.loading}>
            {deleteDialog.loading ? '삭제 중...' : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GuestbookPage;
