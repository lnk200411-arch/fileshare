import { useState } from 'react';
import FilePageLayout from '../components/common/FilePageLayout';
import { useFiles } from '../hooks/useFiles';

/**
 * RecentDownloadPage - 최근 다운로드 이력
 */
function RecentDownloadPage({ refreshKey = 0 }) {
  const [viewMode, setViewMode] = useState('list');

  const { files, isLoading, error, handleDownload, selectedIds, toggleSelect, downloadSelected } = useFiles(
    {},
    refreshKey,
    true  // recentDownloads 모드
  );

  return (
    <FilePageLayout
      title='최근 다운로드'
      files={files}
      isLoading={isLoading}
      error={error}
      viewMode={viewMode}
      selectedIds={selectedIds}
      onViewModeChange={setViewMode}
      onDownload={handleDownload}
      onSelect={toggleSelect}
      onDownloadSelected={downloadSelected}
    />
  );
}

export default RecentDownloadPage;
