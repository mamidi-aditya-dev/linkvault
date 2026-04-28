export const KNOWN_SOURCES = [
  { id: 'google',    name: 'Google',    emoji: '🔍', color: '#4285f4' },
  { id: 'youtube',   name: 'YouTube',   emoji: '▶️', color: '#ff4444' },
  { id: 'twitter',   name: 'Twitter/X', emoji: '🐦', color: '#1da1f2' },
  { id: 'linkedin',  name: 'LinkedIn',  emoji: '💼', color: '#0a66c2' },
  { id: 'reddit',    name: 'Reddit',    emoji: '🤖', color: '#ff4500' },
  { id: 'github',    name: 'GitHub',    emoji: '🐙', color: '#6af7c8' },
  { id: 'instagram', name: 'Instagram', emoji: '📸', color: '#e1306c' },
  { id: 'medium',    name: 'Medium',    emoji: '✍️', color: '#f7d06a' },
  { id: 'other',     name: 'Other',     emoji: '🌐', color: '#7c6af7' },
];

export const COLORS = [
  '#7c6af7','#f76a8c','#6af7c8','#f7d06a',
  '#6ab8f7','#f7a06a','#c46af7','#f76a6a',
];

export function getSource(id) {
  return KNOWN_SOURCES.find(s => s.id === id) || { id, name: id, emoji: '🌐', color: '#7c6af7' };
}

export function hexToRgba(hex, a) {
  if (!hex || hex.length < 7) return `rgba(124,106,247,${a})`;
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
