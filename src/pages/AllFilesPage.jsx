import { useState } from 'react';
import FilePageLayout from '../components/common/FilePageLayout';
import HeroUpload from '../components/common/HeroUpload';
import { useFiles } from '../hooks/useFiles';

/**
 * AllFilesPage - 전체보기 (기본 진입 페이지)
 * 히어로 업로드 영역 + 전체 파일 목록
 */
function AllFilesPage({ searchQuery = '', refreshKey = 0, onUploadSuccess }) {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterType, setFilterType] = useState('all');
  const [internalRefresh, setInternalRefresh] = useState(0);

  const handleUploadSuccess = () => {
    setInternalRefresh((k) => k + 1);
    onUploadSuccess?.();
  };

  const { files, isLoading, error, handleDownload, selectedIds, toggleSelect, downloadSelected } = useFiles(
    { sortBy, search: searchQuery, filterType },
    refreshKey + internalRefresh
  );

  return (
    <FilePageLayout
      title='전체보기'
      files={files}
      isLoading={isLoading}
      error={error}
      viewMode={viewMode}
      sortBy={sortBy}
      filterType={filterType}
      selectedIds={selectedIds}
      onViewModeChange={setViewMode}
      onSortChange={setSortBy}
      onFilterChange={setFilterType}
      onDownload={handleDownload}
      onSelect={toggleSelect}
      onDownloadSelected={downloadSelected}
      topSlot={<HeroUpload onSuccess={handleUploadSuccess} />}
    />
  );
}

export default AllFilesPage;
