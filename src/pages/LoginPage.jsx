import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CloudIcon from '@mui/icons-material/Cloud';
import { supabase } from '../lib/supabase';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else if (isSignup) {
      setMessage({ type: 'success', text: '가입 확인 이메일을 보냈습니다. 이메일을 확인해주세요.' });
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F8FAFC',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <CloudIcon sx={{ fontSize: 28, color: '#2563EB' }} />
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>
              FileShare
            </Typography>
          </Box>

          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, mb: 0.5 }}>
            {isSignup ? '회원가입' : '로그인'}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mb: 3 }}>
            파일을 저장하고 공유하세요
          </Typography>

          {message && (
            <Alert severity={message.type} sx={{ mb: 2, borderRadius: '8px', fontSize: '0.8125rem' }}>
              {message.text}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='이메일'
              type='email'
              size='small'
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label='비밀번호'
              type='password'
              size='small'
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputProps={{ minLength: 6 }}
            />
            <Button
              type='submit'
              variant='contained'
              fullWidth
              disabled={loading}
              sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' }, py: 1.25 }}
            >
              {loading ? '처리 중...' : isSignup ? '가입하기' : '로그인'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>
              {isSignup ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
              {' '}
              <Button
                variant='text'
                size='small'
                onClick={() => { setIsSignup(!isSignup); setMessage(null); }}
                sx={{ fontSize: '0.875rem', fontWeight: 600, p: 0, minWidth: 0 }}
              >
                {isSignup ? '로그인' : '회원가입'}
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
