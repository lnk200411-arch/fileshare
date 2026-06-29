import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * Breadcrumb 컴포넌트 - 폴더 탐색 경로
 *
 * Props:
 * @param {Array} paths - [{id, name}] 경로 배열 [Optional, 기본값: []]
 * @param {function} onNavigate - 경로 클릭 핸들러 (id) [Optional]
 *
 * Example usage:
 * <Breadcrumb paths={[{id:'1',name:'문서'}]} onNavigate={handleNav} />
 */
function Breadcrumb({ paths = [], onNavigate }) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon sx={{ fontSize: 16, color: '#CBD5E1' }} />}
      sx={{ '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap', alignItems: 'center' } }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
        onClick={() => onNavigate?.(null)}
      >
        <HomeIcon sx={{ fontSize: 16, color: '#64748B' }} />
        <Typography sx={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
          전체
        </Typography>
      </Box>

      {paths.map((path, idx) => {
        const isLast = idx === paths.length - 1;
        return isLast ? (
          <Typography
            key={path.id}
            sx={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 600 }}
          >
            {path.name}
          </Typography>
        ) : (
          <Link
            key={path.id}
            component='button'
            underline='hover'
            onClick={() => onNavigate?.(path.id)}
            sx={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}
          >
            {path.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default Breadcrumb;
