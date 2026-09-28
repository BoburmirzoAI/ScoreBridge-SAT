import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../icons';
import { questionsFor } from '../data';
import { useStore } from '../store';

export default function Solve() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { homework, submitHomework } = useStore();
  const hw = homework.find((h) => h.id === id);

  const questions = useMemo(() => (hw ? questionsFor(hw.gen, hw.total) : []), [hw]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [secs, setSecs] = useState(() => (hw?.subject === 'Math' ? 35 : 32) * 60);
  const [timerHidden, setTimerHidden] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!hw) {
    navigate('/homework');
    return null;
  }

  const q = questions[i];
  const chosen = answers[i];
  const answeredCount = Object.keys(answers).length;
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const warn = secs < 300;
  const moduleLabel = hw.subject === 'Math' ? 'Math module' : 'Reading & Writing module';

  const submit = () => {
    let correct = 0;
    const review = questions.map((qq, idx) => {
      if (answers[idx] === qq.answer) correct++;
      return { stem: qq.stem, choices: qq.choices, answer: qq.answer, chosen: answers[idx], explanation: qq.explanation };
    });
    submitHomework(id, correct, answeredCount, review);
    navigate(`/homework/${id}/result`);
  };

  return (
    <div className="mx-auto max-w-[960px] animate-fade">
      {/* header */}
      <div className="mb-[18px] flex items-center gap-3.5">
        <button
          onClick={() => navigate('/homework')}
          className="grid h-[38px] w-[38px] flex-none place-items-center rounded-md border border-border bg-surface text-dim hover:border-st-over hover:text-st-over"
        >
          <Icon name="x" size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold text-heading">{hw.title}</div>
          <div className="text-[12.5px] text-dim">Question {i + 1} of {questions.length}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-dim">{moduleLabel}</div>
          <div className="flex items-center gap-2">
            {warn && secs > 0 && <span className="text-[11px] text-st-over">5 minutes left</span>}
            {!timerHidden ? (
              <div
                className="disp flex items-center gap-2 rounded-md px-3.5 py-2 text-[15px] font-medium"
                style={{ background: warn ? 'var(--st-over-bg)' : 'var(--surface)', color: warn ? 'var(--st-over)' : 'var(--heading)' }}
              >
                <Icon name="clock" size={17} /> {mm}:{ss}
              </div>
            ) : (
              <button onClick={() => setTimerHidden(false)} className="rounded-md border border-border bg-surface px-3.5 py-2 text-[13px] text-dim">
                Show timer
              </button>
            )}
            <button
              onClick={() => setTimerHidden((h) => !h)}
              title="Hide or show timer"
              className="grid h-[34px] w-[34px] flex-none place-items-center rounded-md border border-border bg-surface text-dim"
            >
              <Icon name="eye" size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-[18px] md:grid-cols-[1fr_240px]">
        {/* question */}
        <div className="rounded-[8px] border border-border bg-surface p-6">
          <div className="mb-[18px] flex items-start justify-between gap-4">
            <p className="text-[17px] font-medium leading-relaxed text-heading">{q.stem}</p>
            <button
              onClick={() => setFlagged((f) => ({ ...f, [i]: !f[i] }))}
              title="Flag for review"
              className="flex flex-none items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold"
              style={{
                border: `1px solid ${flagged[i] ? 'var(--st-late)' : 'var(--border)'}`,
                background: flagged[i] ? 'var(--st-late-bg)' : 'var(--surface)',
                color: flagged[i] ? 'var(--st-late)' : 'var(--dim)',
              }}
            >
              <Icon name="flag" size={14} /> Flag
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {q.choices.map((c, idx) => {
              const sel = chosen === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: idx }))}
                  className="flex w-full items-center gap-3.5 rounded-lg p-[15px_17px] text-left transition-colors hover:border-brand"
                  style={{ border: `2px solid ${sel ? 'var(--brand)' : 'var(--border)'}`, background: sel ? 'var(--brand-soft)' : 'var(--surface)' }}
                >
                  <span
                    className="grid h-[30px] w-[30px] flex-none place-items-center rounded-md text-sm font-medium"
                    style={{ border: `2px solid ${sel ? 'var(--brand)' : 'var(--border)'}`, background: sel ? 'var(--brand)' : 'transparent', color: sel ? '#fff' : 'var(--dim)' }}
                  >
                    {'ABCD'[idx]}
                  </span>
                  <span className="text-[15px]" style={{ color: sel ? 'var(--heading)' : 'var(--text)' }}>{c}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-[22px] flex justify-between">
            <button
              onClick={() => setI((n) => Math.max(0, n - 1))}
              className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-[18px] py-2.5 text-sm font-semibold text-text"
            >
              <Icon name="chevLeft" size={16} /> Previous
            </button>
            <button
              onClick={() => setI((n) => Math.min(questions.length - 1, n + 1))}
              className="flex items-center gap-1.5 rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Next <Icon name="chevRight" size={16} />
            </button>
          </div>
        </div>

        {/* navigator */}
        <div className="sticky top-4 rounded-[8px] border border-border bg-surface p-[18px]">
          <div className="mb-3 text-[13.5px] font-semibold text-heading">Questions</div>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, idx) => {
              const ans = answers[idx] != null;
              const flg = flagged[idx];
              const cur = idx === i;
              return (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  className="h-[38px] w-full rounded-md text-[13px] font-medium transition-colors"
                  style={{
                    border: `2px solid ${cur ? 'var(--brand)' : flg ? 'var(--st-late)' : ans ? 'transparent' : 'var(--border)'}`,
                    background: cur ? 'var(--brand)' : ans ? 'var(--st-done-bg)' : 'var(--surface)',
                    color: cur ? '#fff' : ans ? 'var(--st-done)' : 'var(--dim)',
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-3.5 flex flex-col gap-1.5 text-[11.5px] text-dim">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded border border-st-done bg-st-done-bg" />Answered</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded border-2 border-st-late" />Flagged</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded border border-border" />Not answered</span>
          </div>
          <div className="my-3.5 h-px bg-border-2" />
          <div className="mb-2.5 text-[12.5px] text-dim"><strong className="text-heading">{answeredCount}</strong> of {questions.length} answered</div>
          <button onClick={submit} className="w-full rounded-md bg-reward py-3 text-[14.5px] font-semibold text-[#1C1F4A] hover:opacity-90">
            Submit homework
          </button>
        </div>
      </div>
    </div>
  );
}
