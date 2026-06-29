import PageContainer from '../components/common/PageContainer';

function RecentPage({ user, searchQuery, refreshKey }) {
  return (
    <PageContainer
      title='최근 항목'
      mode='recent'
      user={user}
      searchQuery={searchQuery}
      refreshKey={refreshKey}
      emptyMessage='최근 항목이 없습니다.'
    />
  );
}

export default RecentPage;
