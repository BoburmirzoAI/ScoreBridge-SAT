import { useStore } from '../store';
import { initialsOf } from '../utils';

/** The current user's avatar — uploaded photo if set, else initials. */
export function Avatar({ size = 38, radius = 6 }: { size?: number; radius?: number }) {
  const profile = useStore((s) => s.profile);
  const style = { width: size, height: size, borderRadius: radius, boxShadow: '0 0 0 1.5px var(--brand)' };
  if (profile.avatar) {
    return <img src={profile.avatar} alt={profile.name} className="object-cover" style={style} />;
  }
  return (
    <div className="disp grid place-items-center bg-surface-2 font-medium text-text" style={{ ...style, fontSize: Math.round(size * 0.34) }}>
      {initialsOf(profile.name)}
    </div>
  );
}

export default Avatar;
