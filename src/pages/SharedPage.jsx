import PageContainer from '../components/common/PageContainer';

function SharedPage({ user, searchQuery, refreshKey }) {
  return (
    <PageContainer
      title='공유 파일'
      mode='shared'
      user={user}
      searchQuery={searchQuery}
      refreshKey={refreshKey}
      emptyMessage='공유된 파일이 없습니다.'
    />
  );
}

export default SharedPage;
