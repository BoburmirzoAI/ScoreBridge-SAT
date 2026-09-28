/** Falling confetti overlay for celebrations. Ported from confetti(). */
const COLS = ['#F5B301', '#6C4DF6', '#20B89A', '#FF7A59', '#3D7BFF'];

export function Confetti() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden={true}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${4 + i * 4}%`,
            top: '-12px',
            width: 7,
            height: 11,
            background: COLS[i % 5],
            borderRadius: 2,
            animation: `sbConfetti ${1.6 + (i % 5) * 0.3}s ease-in ${i * 0.05}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
