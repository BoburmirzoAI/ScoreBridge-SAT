import { BadgeIcon, Confetti, Crest } from './art';
import { useStore } from '../store';

/** Full-screen celebration overlay (level-up / best-score / badge). */
export function Celebration() {
  const celebration = useStore((s) => s.celebration);
  const dismiss = useStore((s) => s.dismissCelebration);
  if (!celebration) return null;

  return (
    <div onClick={dismiss} className="animate-fade fixed inset-0 z-[60] grid place-items-center bg-[rgba(14,16,38,.6)] backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="animate-pop relative max-w-[400px] overflow-hidden rounded-[8px] border border-border bg-surface p-[34px_38px] text-center shadow-soft">
        <Confetti />
        <div className="mx-auto mb-3.5 h-24 w-24 animate-[sbFloat_3s_ease-in-out_infinite]">
          {celebration.kind === 'badge' ? <BadgeIcon icon="trophy" earned size={96} /> : <Crest size={96} />}
        </div>
        <div className="text-xs font-medium uppercase tracking-[0.08em] text-reward">{celebration.kicker}</div>
        <h2 className="disp mb-2 mt-1.5 text-[26px] text-heading">{celebration.title}</h2>
        <p className="mb-5 text-[14.5px] text-dim">{celebration.body}</p>
        <button onClick={dismiss} className="rounded-md bg-brand px-6 py-3 text-[14.5px] font-medium text-white hover:opacity-90">
          {celebration.cta}
        </button>
      </div>
    </div>
  );
}

export default Celebration;
