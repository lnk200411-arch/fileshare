import { supabase } from './supabase';

/**
 * 폴더 목록 조회
 * @param {string|null} parentId - null이면 루트 폴더
 * @returns {Promise<Array>}
 */
export async function fetchFolders(parentId = null) {
  let query = supabase.from('folders').select('*').order('name', { ascending: true });
  query = parentId === null ? query.is('parent_id', null) : query.eq('parent_id', parentId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * 폴더 생성
 * @param {string} name
 * @param {string|null} parentId
 * @returns {Promise<object>}
 */
export async function createFolder(name, parentId = null) {
  const { data, error } = await supabase
    .from('folders')
    .insert({ name, parent_id: parentId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * 폴더 경로(breadcrumb) 조회 — 루트까지 재귀적으로 탐색
 * @param {string} folderId
 * @returns {Promise<Array<{id, name}>>}
 */
export async function fetchFolderPath(folderId) {
  const path = [];
  let currentId = folderId;

  while (currentId) {
    const { data, error } = await supabase
      .from('folders')
      .select('id, name, parent_id')
      .eq('id', currentId)
      .single();
    if (error || !data) break;
    path.unshift({ id: data.id, name: data.name });
    currentId = data.parent_id;
  }
  return path;
}
