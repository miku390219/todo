import {
  FILTERS,
  addTodo,
  toggleTodo,
  editTodo,
  removeTodo,
  toggleAll,
  clearCompleted,
  filterTodos,
  countActive,
} from './todos.js';
import { loadTodos, saveTodos } from './storage.js';

const els = {
  form: document.querySelector('#new-todo-form'),
  input: document.querySelector('#new-todo'),
  main: document.querySelector('#main'),
  toggleAll: document.querySelector('#toggle-all'),
  list: document.querySelector('#todo-list'),
  footer: document.querySelector('#footer'),
  count: document.querySelector('#count'),
  filters: document.querySelectorAll('#filters a'),
  clear: document.querySelector('#clear-completed'),
  empty: document.querySelector('#empty'),
};

let todos = loadTodos();
let filter = currentFilter();
let editingId = null;

function currentFilter() {
  const name = location.hash.replace(/^#\/?/, '');
  return FILTERS.includes(name) ? name : 'all';
}

function update(next) {
  todos = next;
  saveTodos(todos);
  render();
}

function renderItem(todo) {
  const li = document.createElement('li');
  li.dataset.id = todo.id;
  li.className = 'todo' + (todo.completed ? ' completed' : '');

  if (todo.id === editingId) {
    const input = document.createElement('input');
    input.className = 'edit';
    input.value = todo.title;
    input.setAttribute('aria-label', 'タスクを編集');
    li.classList.add('editing');
    li.append(input);
    return li;
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'toggle';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', `「${todo.title}」を完了にする`);

  const label = document.createElement('label');
  label.className = 'title';
  label.textContent = todo.title;
  label.title = 'ダブルクリックで編集';

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'destroy';
  del.setAttribute('aria-label', `「${todo.title}」を削除`);
  del.textContent = '×';

  li.append(checkbox, label, del);
  return li;
}

function render() {
  const visible = filterTodos(todos, filter);
  const active = countActive(todos);
  const hasTodos = todos.length > 0;

  els.list.replaceChildren(...visible.map(renderItem));

  els.main.hidden = !hasTodos;
  els.footer.hidden = !hasTodos;
  els.empty.hidden = hasTodos;

  els.toggleAll.checked = hasTodos && active === 0;
  els.count.textContent = `残り ${active} 件`;
  els.clear.hidden = active === todos.length;

  for (const a of els.filters) {
    const selected = a.dataset.filter === filter;
    a.classList.toggle('selected', selected);
    if (selected) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }

  const editInput = els.list.querySelector('.edit');
  if (editInput) {
    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);
  }
}

function startEditing(id) {
  editingId = id;
  render();
}

function finishEditing(input, save) {
  if (editingId === null) return;
  const id = editingId;
  editingId = null;
  if (save) update(editTodo(todos, id, input.value));
  else render();
}

els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const next = addTodo(todos, els.input.value);
  if (next !== todos) {
    // 追加したタスクが見えるよう「完了済み」表示中なら「すべて」に戻す
    if (filter === 'completed') location.hash = '#/';
    update(next);
  }
  els.input.value = '';
});

els.toggleAll.addEventListener('change', () => update(toggleAll(todos)));
els.clear.addEventListener('click', () => update(clearCompleted(todos)));

els.list.addEventListener('change', (e) => {
  if (!e.target.matches('.toggle')) return;
  update(toggleTodo(todos, e.target.closest('li').dataset.id));
});

els.list.addEventListener('click', (e) => {
  if (!e.target.matches('.destroy')) return;
  update(removeTodo(todos, e.target.closest('li').dataset.id));
});

els.list.addEventListener('dblclick', (e) => {
  if (!e.target.matches('.title')) return;
  startEditing(e.target.closest('li').dataset.id);
});

els.list.addEventListener('keydown', (e) => {
  if (!e.target.matches('.edit') || e.isComposing) return;
  if (e.key === 'Enter') finishEditing(e.target, true);
  else if (e.key === 'Escape') finishEditing(e.target, false);
});

els.list.addEventListener('focusout', (e) => {
  if (e.target.matches('.edit')) finishEditing(e.target, true);
});

window.addEventListener('hashchange', () => {
  filter = currentFilter();
  render();
});

// 別タブでの変更を反映する
window.addEventListener('storage', () => {
  todos = loadTodos();
  render();
});

render();
