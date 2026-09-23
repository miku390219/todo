import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addTodo,
  toggleTodo,
  editTodo,
  removeTodo,
  toggleAll,
  clearCompleted,
  filterTodos,
  countActive,
  sanitize,
} from '../src/todos.js';

const sample = () => [
  { id: 'a', title: '牛乳を買う', completed: false, createdAt: 1 },
  { id: 'b', title: 'レポートを書く', completed: true, createdAt: 2 },
  { id: 'c', title: '部屋の掃除', completed: false, createdAt: 3 },
];

test('addTodo はタイトルを trim して末尾に追加する', () => {
  const result = addTodo([], '  買い物  ', { id: 'x', now: 10 });
  assert.deepEqual(result, [{ id: 'x', title: '買い物', completed: false, createdAt: 10 }]);
});

test('addTodo は空白のみのタイトルを無視し、同じ配列を返す', () => {
  const todos = sample();
  assert.equal(addTodo(todos, '   '), todos);
});

test('addTodo は id を省略すると一意な id を生成する', () => {
  const todos = addTodo(addTodo([], 'a'), 'b');
  assert.notEqual(todos[0].id, todos[1].id);
});

test('toggleTodo は対象だけ完了状態を反転し、元の配列を変更しない', () => {
  const todos = sample();
  const result = toggleTodo(todos, 'a');
  assert.equal(result[0].completed, true);
  assert.equal(result[1].completed, true);
  assert.equal(todos[0].completed, false);
});

test('editTodo はタイトルを更新する', () => {
  assert.equal(editTodo(sample(), 'a', ' 豆乳を買う ')[0].title, '豆乳を買う');
});

test('editTodo は空タイトルなら削除する', () => {
  const result = editTodo(sample(), 'a', '  ');
  assert.deepEqual(result.map((t) => t.id), ['b', 'c']);
});

test('removeTodo は対象を削除する', () => {
  assert.deepEqual(removeTodo(sample(), 'b').map((t) => t.id), ['a', 'c']);
});

test('toggleAll は未完了があれば全て完了にし、全て完了なら全て未完了にする', () => {
  const allDone = toggleAll(sample());
  assert.ok(allDone.every((t) => t.completed));
  assert.ok(toggleAll(allDone).every((t) => !t.completed));
});

test('clearCompleted は完了済みを削除する', () => {
  assert.deepEqual(clearCompleted(sample()).map((t) => t.id), ['a', 'c']);
});

test('filterTodos はフィルタに応じて絞り込む', () => {
  const todos = sample();
  assert.equal(filterTodos(todos, 'all').length, 3);
  assert.deepEqual(filterTodos(todos, 'active').map((t) => t.id), ['a', 'c']);
  assert.deepEqual(filterTodos(todos, 'completed').map((t) => t.id), ['b']);
  assert.equal(filterTodos(todos, 'unknown').length, 3);
});

test('countActive は未完了の件数を返す', () => {
  assert.equal(countActive(sample()), 2);
  assert.equal(countActive([]), 0);
});

test('sanitize は不正なデータを取り除く', () => {
  assert.deepEqual(sanitize(null), []);
  assert.deepEqual(sanitize({}), []);
  const result = sanitize([
    { id: 'a', title: 'OK', completed: 1, createdAt: 5 },
    { id: 'b', title: '   ' },
    { id: 3, title: 'id が数値' },
    null,
    { id: 'c', title: '日時なし' },
  ]);
  assert.deepEqual(result, [
    { id: 'a', title: 'OK', completed: true, createdAt: 5 },
    { id: 'c', title: '日時なし', completed: false, createdAt: 0 },
  ]);
});
