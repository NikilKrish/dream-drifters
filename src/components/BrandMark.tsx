interface BrandMarkProps {
  light?: boolean;
}

export function BrandMark({ light = false }: BrandMarkProps) {
  return (
    <span className="brand-mark">
      <span className="brand-mark__tile"><img src="/brand/dd-mark.png" width="58" height="42" alt="" /></span>
      <span className={light ? 'brand-mark__words is-light' : 'brand-mark__words'}>
        <span>Dream</span>
        <span>Drifters</span>
      </span>
    </span>
  );
}

