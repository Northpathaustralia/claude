// ---------------------------------------------------------------------------
// Tasks — manual to-dos plus the Operations Assistant's generated plan.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/StoreContext.jsx';
import { buildTodaysPlan } from '@/ai/operationsAssistant.js';
import { TASK_PRIORITIES } from '@/domain/constants.js';
import { todayISO, formatDate, isOverdue } from '@/utils/dates.js';
import PageHeader from '@/components/layout/PageHeader.jsx';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge, { priorityTone } from '@/components/ui/Badge.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';

export default function Tasks() {
  const { state, dispatch } = useStore();
  const today = todayISO();
  const plan = buildTodaysPlan({ leads: state.leads, partners: state.partners, tasks: state.tasks }, today);
  const [draft, setDraft] = useState({ title: '', priority: 'Medium', dueDate: today });
  const openTasks = state.tasks.filter((t) => !t.done).sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
  const doneTasks = state.tasks.filter((t) => t.done);

  function addTask(e) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    dispatch({ type: 'task/add', payload: { ...draft, done: false } });
    setDraft({ title: '', priority: 'Medium', dueDate: today });
  }

  return (
    <div>
      <PageHeader title="Tasks" subtitle="Your list plus everything the Operations Assistant thinks matters today" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* AI-generated plan */}
        <Card title="Today's plan" subtitle="Generated automatically — refreshes as your data changes">
          {plan.length === 0 ? (
            <EmptyState title="Nothing urgent today" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {plan.map((item) => (
                <li key={item.id} className="flex items-start gap-3 py-2.5">
                  <Badge tone={priorityTone(item.priority)}>{item.priority}</Badge>
                  <div className="min-w-0 flex-1">
                    <Link to={item.link} className="text-sm font-medium text-slate-800 hover:text-brand-700">
                      {item.title}
                    </Link>
                    <p className="text-xs text-slate-500">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Manual tasks */}
        <Card title="My tasks">
          <form onSubmit={addTask} className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-4">
            <input
              className="field sm:col-span-2"
              placeholder="New task…"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <select className="field" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}>
              {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
            <div className="flex gap-2">
              <input type="date" className="field" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
              <Button type="submit" size="sm">Add</Button>
            </div>
          </form>

          {openTasks.length === 0 ? (
            <EmptyState title="No open tasks" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {openTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => dispatch({ type: 'task/update', id: task.id, payload: { done: true } })}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-800">{task.title}</p>
                    {task.dueDate && (
                      <p className={`text-xs ${isOverdue(task.dueDate, today) ? 'font-medium text-rose-600' : 'text-slate-400'}`}>
                        Due {formatDate(task.dueDate)}{isOverdue(task.dueDate, today) ? ' — overdue' : ''}
                      </p>
                    )}
                  </div>
                  <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
                  <button
                    onClick={() => dispatch({ type: 'task/remove', id: task.id })}
                    className="text-xs text-slate-400 hover:text-rose-600"
                    aria-label={`Delete ${task.title}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {doneTasks.length > 0 && (
            <>
              <h3 className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Completed ({doneTasks.length})
              </h3>
              <ul className="mt-2 space-y-1">
                {doneTasks.slice(0, 10).map((task) => (
                  <li key={task.id} className="flex items-center gap-2 text-sm text-slate-400">
                    <span>✓</span><span className="line-through">{task.title}</span>
                    <button
                      onClick={() => dispatch({ type: 'task/update', id: task.id, payload: { done: false } })}
                      className="ml-auto text-xs text-slate-400 hover:text-brand-600"
                    >
                      Undo
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
