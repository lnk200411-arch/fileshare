import { useState } from 'react';
import FilePageLayout from '../components/common/FilePageLayout';
import { useFiles } from '../hooks/useFiles';

/**
 * PopularPage - 다운로드 인기순
 */
function PopularPage({ searchQuery = '', refreshKey = 0 }) {
  const [viewMode, setViewMode] = useState('list');
  const [filterType, setFilterType] = useState('all');

  const { files, isLoading, error, handleDownload, handleDelete, selectedIds, toggleSelect, downloadSelected, deleteSelected } = useFiles(
    { sortBy: 'download_count', ascending: false, search: searchQuery, filterType },
    refreshKey
  );

  return (
    <FilePageLayout
      title='인기 다운로드'
      files={files}
      isLoading={isLoading}
      error={error}
      viewMode={viewMode}
      sortBy='download_count'
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

export default PopularPage;
