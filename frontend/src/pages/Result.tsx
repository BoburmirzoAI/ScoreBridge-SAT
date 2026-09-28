import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../icons';
import { Bridge, Confetti, Crest } from '../components/art';
import { useStore } from '../store';
import type { ReviewItem } from '../store';

export default function Result() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { lastResult, bridge, theme, homework } = useStore();

  // Prefer the fresh session result; fall back to the stored score for a
  // completed homework opened via "Review".
  const hw = homework.find((h) => h.id === id);
  const fromSession = lastResult && lastResult.hwId === id;
  const correct = fromSession ? lastResult.correct : hw?.score ?? 0;
  const total = fromSession ? lastResult.total : hw?.total ?? 0;
  const xpEarned = fromSession ? lastResult.xpEarned : 0;
  const review: ReviewItem[] = fromSession ? lastResult.review : [];
  const pct = total ? Math.round((correct / total) * 100) : 0;

  const headline = pct >= 80 ? 'Homework complete' : pct >= 50 ? 'Good progress' : 'Homework submitted';
  const sub = pct >= 80 ? 'Your bridge has a new section.' : 'Every correct answer adds a section to your bridge.';

  return (
    <div className="mx-auto max-w-[640px] animate-pop">
      <div className="relative overflow-hidden rounded-[8px] border border-border bg-surface p-8 text-center shadow-soft">
        <Confetti />
        <div className="mx-auto mb-2.5 h-24 w-24 animate-[sbFloat_3s_ease-in-out_infinite]">
          <Crest size={96} />
        </div>
        <div className="text-xs font-medium uppercase tracking-[0.08em] text-reward">Homework submitted</div>
        <h1 className="disp mb-1 mt-1.5 text-[30px] text-heading">{headline}</h1>
        <p className="mb-[22px] text-[15px] text-dim">{sub}</p>

        <div className="mb-[22px] flex flex-wrap justify-center gap-3">
          <div className="rounded-lg border border-border bg-surface-2 px-[22px] py-3.5">
            <div className="disp text-[26px] font-semibold text-heading">{correct}/{total}</div>
            <div className="text-xs text-dim">Correct</div>
          </div>
          {fromSession && (
            <div className="rounded-lg border border-reward bg-reward-soft px-[22px] py-3.5">
              <div className="disp text-[26px] font-semibold text-reward">+{xpEarned}</div>
              <div className="text-xs text-reward">XP earned</div>
            </div>
          )}
          <div className="rounded-lg border border-border bg-surface-2 px-[22px] py-3.5">
            <div className="disp text-[26px] font-semibold text-st-done">{pct}%</div>
            <div className="text-xs text-dim">Score</div>
          </div>
        </div>

        <div className="mb-[22px] overflow-hidden rounded-lg border border-border">
          <Bridge progress={bridge} width={520} height={150} dark={theme === 'dark'} />
        </div>

        <div className="flex justify-center gap-2.5">
          <button onClick={() => navigate('/homework')} className="rounded-md border border-border bg-surface px-[22px] py-3 text-sm font-semibold text-text">
            Back to homework
          </button>
          <button onClick={() => navigate('/')} className="rounded-md bg-brand px-6 py-3 text-sm font-medium text-white hover:opacity-90">
            See my bridge
          </button>
        </div>
      </div>

      {/* review with explanations (amendment 4) */}
      {review.length > 0 && (
        <div className="mt-5">
          <h2 className="disp mb-3 text-lg text-heading">Review answers</h2>
          <div className="flex flex-col gap-3">
            {review.map((r, idx) => {
              const isCorrect = r.chosen === r.answer;
              return (
                <div key={idx} className="rounded-[8px] border border-border bg-surface p-4">
                  <div className="flex items-start gap-2.5">
                    <span
                      className="grid h-6 w-6 flex-none place-items-center rounded-full"
                      style={{ background: isCorrect ? 'var(--st-done-bg)' : 'var(--st-over-bg)', color: isCorrect ? 'var(--st-done)' : 'var(--st-over)' }}
                    >
                      <Icon name={isCorrect ? 'checkSm' : 'x'} size={13} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium text-heading">
                        <span className="text-dim">Q{idx + 1}.</span> {r.stem}
                      </div>
                      <div className="mt-2 flex flex-col gap-1.5">
                        {r.choices.map((c, ci) => {
                          const correctChoice = ci === r.answer;
                          const chosenWrong = ci === r.chosen && !isCorrect;
                          return (
                            <div
                              key={ci}
                              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px]"
                              style={{
                                background: correctChoice ? 'var(--st-done-bg)' : chosenWrong ? 'var(--st-over-bg)' : 'transparent',
                                color: correctChoice ? 'var(--st-done)' : chosenWrong ? 'var(--st-over)' : 'var(--text)',
                                border: `1px solid ${correctChoice ? 'var(--st-done)' : chosenWrong ? 'var(--st-over)' : 'var(--border-2)'}`,
                              }}
                            >
                              <span className="font-medium">{'ABCD'[ci]}</span>
                              <span>{c}</span>
                              {correctChoice && <span className="ml-auto text-[11px] font-semibold">Correct</span>}
                              {chosenWrong && <span className="ml-auto text-[11px] font-semibold">Your answer</span>}
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-2 rounded-md bg-surface-2 px-3 py-2 text-[12.5px] text-dim">
                        <strong className="font-semibold text-text">Why:</strong> {r.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
