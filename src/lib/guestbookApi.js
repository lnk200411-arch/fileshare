import { supabase } from './supabase';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function fetchGuestbook() {
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, nickname, message, created_at, updated_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createEntry(nickname, message, password) {
  const password_hash = await hashPassword(password);
  const { data, error } = await supabase
    .from('guestbook')
    .insert({ nickname, message, password_hash })
    .select('id, nickname, message, created_at, updated_at')
    .single();
  if (error) throw error;
  return data;
}

async function verifyPassword(id, password) {
  const hash = await hashPassword(password);
  const { data, error } = await supabase
    .from('guestbook')
    .select('password_hash')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data.password_hash === hash;
}

export async function updateEntry(id, message, password) {
  const ok = await verifyPassword(id, password);
  if (!ok) throw new Error('비밀번호가 일치하지 않습니다.');
  const { data, error } = await supabase
    .from('guestbook')
    .update({ message, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, nickname, message, created_at, updated_at')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEntry(id, password) {
  const ok = await verifyPassword(id, password);
  if (!ok) throw new Error('비밀번호가 일치하지 않습니다.');
  const { error } = await supabase.from('guestbook').delete().eq('id', id);
  if (error) throw error;
}
