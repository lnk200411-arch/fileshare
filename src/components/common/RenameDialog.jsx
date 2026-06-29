import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

/**
 * RenameDialog 컴포넌트 - 파일 이름 변경 다이얼로그
 *
 * Props:
 * @param {object} file - 대상 파일 객체 [Required]
 * @param {function} onClose - 닫기 핸들러 [Required]
 * @param {function} onConfirm - 확인 핸들러 (newName) [Required]
 *
 * Example usage:
 * <RenameDialog file={file} onClose={handleClose} onConfirm={handleConfirm} />
 */
function RenameDialog({ file, onClose, onConfirm }) {
  const [name, setName] = useState(file?.file_name || '');

  return (
    <Dialog
      open={Boolean(file)}
      onClose={onClose}
      maxWidth='xs'
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>이름 변경</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          size='small'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onConfirm(name.trim())}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#64748B' }}>취소</Button>
        <Button
          variant='contained'
          onClick={() => name.trim() && onConfirm(name.trim())}
          disabled={!name.trim() || name.trim() === file?.file_name}
          sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}
        >
          변경
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RenameDialog;
