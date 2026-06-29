import PageContainer from '../components/common/PageContainer';

function MyFilesPage({ user, searchQuery, refreshKey }) {
  return (
    <PageContainer
      title='내 파일'
      mode='mine'
      user={user}
      searchQuery={searchQuery}
      refreshKey={refreshKey}
      emptyMessage='내가 업로드한 파일이 없습니다.'
    />
  );
}

export default MyFilesPage;
