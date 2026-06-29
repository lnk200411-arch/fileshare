import { useState } from 'react';
import FilePageLayout from '../components/common/FilePageLayout';
import { useFiles } from '../hooks/useFiles';

/**
 * RecentUploadPage - 최근 업로드 (업로드 시간순)
 */
function RecentUploadPage({ searchQuery = '', refreshKey = 0 }) {
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');

  const { files, isLoading, error, handleDownload, handleDelete, selectedIds, toggleSelect, downloadSelected, deleteSelected } = useFiles(
    { sortBy: 'created_at', ascending: false, search: searchQuery, filterType },
    refreshKey
  );

  return (
    <FilePageLayout
      title='최근 업로드'
      files={files}
      isLoading={isLoading}
      error={error}
      viewMode={viewMode}
      sortBy='created_at'
      filterType={filterType}
      selectedIds={selectedIds}
      onViewModeChange={setViewMode}
      onFilterChange={setFilterType}
      onDownload={handleDownload}
      onDelete={handleDelete}
      onSelect={toggleSelect}
      onDownloadSelected={downloadSelected}
      onDeleteSelected={deleteSelected}
    />
  );
}

export default RecentUploadPage;
