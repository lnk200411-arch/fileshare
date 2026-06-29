import PageContainer from '../components/common/PageContainer';

function FavoritesPage({ user, searchQuery, refreshKey }) {
  return (
    <PageContainer
      title='즐겨찾기'
      mode='favorites'
      user={user}
      searchQuery={searchQuery}
      refreshKey={refreshKey}
      emptyMessage='즐겨찾기한 파일이 없습니다.'
    />
  );
}

export default FavoritesPage;
