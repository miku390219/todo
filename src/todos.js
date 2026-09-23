// TODO の状態を操作する純粋関数群。どの関数も元の配列を変更せず、新しい配列を返す。

export const FILTERS = ['all', 'active', 'completed'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function addTodo(todos, title, { id = generateId(), now = Date.now() } = {}) {
  const trimmed = title.trim();
  if (!trimmed) return todos;
  return [...todos, { id, title: trimmed, completed: false, createdAt: now }];
}

export function toggleTodo(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
}

// 空のタイトルで編集した場合は削除扱いにする
export function editTodo(todos, id, title) {
  const trimmed = title.trim();
  if (!trimmed) return removeTodo(todos, id);
  return todos.map((t) => (t.id === id ? { ...t, title: trimmed } : t));
}

export function removeTodo(todos, id) {
  return todos.filter((t) => t.id !== id);
}

// 未完了が1つでもあれば全て完了に、全て完了済みなら全て未完了にする
export function toggleAll(todos) {
  const completed = todos.some((t) => !t.completed);
  return todos.map((t) => (t.completed === completed ? t : { ...t, completed }));
}

export function clearCompleted(todos) {
  return todos.filter((t) => !t.completed);
}

export function filterTodos(todos, filter) {
  switch (filter) {
    case 'active':
      return todos.filter((t) => !t.completed);
    case 'completed':
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
}

export function countActive(todos) {
  return todos.filter((t) => !t.completed).length;
}

// localStorage から読み込んだ値を検証し、壊れた要素は捨てる
export function sanitize(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((t) => t && typeof t.id === 'string' && typeof t.title === 'string' && t.title.trim())
    .map((t) => ({
      id: t.id,
      title: t.title,
      completed: Boolean(t.completed),
      createdAt: Number.isFinite(t.createdAt) ? t.createdAt : 0,
    }));
}
