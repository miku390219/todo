import { sanitize } from './todos.js';

const KEY = 'todo-app.todos.v1';

// プライベートモード等で localStorage が使えない場合でもアプリは動作させる
export function loadTodos() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? sanitize(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(KEY, JSON.stringify(todos));
  } catch {
    // 保存できなくてもメモリ上の状態で動作を続ける
  }
}
