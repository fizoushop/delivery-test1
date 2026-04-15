import { useEffect, useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { supabase } from './lib/supabase';

interface Todo {
  id: string;
  task: string;
  completed: boolean;
  created_at: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading todos:', error);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ task: newTask }])
      .select()
      .single();

    if (error) {
      console.error('Error adding todo:', error);
    } else {
      setTodos([data, ...todos]);
      setNewTask('');
    }
  }

  async function toggleTodo(id: string, completed: boolean) {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id);

    if (error) {
      console.error('Error updating todo:', error);
    } else {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    }
  }

  async function deleteTodo(id: string) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">
            My Tasks
          </h1>

          <form onSubmit={addTodo} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Add recette
              </button>
            </div>
          </form>

          {loading ? (
            <div className="text-center py-12 text-slate-500">
              Loading tasks...
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No tasks yet. Add one to get started!
            </div>
          ) : (
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition group"
                >
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-slate-300 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && <Check size={16} className="text-white" />}
                  </button>

                  <span
                    className={`flex-1 transition ${
                      todo.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-700'
                    }`}
                  >
                    {todo.task}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            {todos.filter(t => !t.completed).length} task{todos.filter(t => !t.completed).length !== 1 ? 's' : ''} remaining
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
