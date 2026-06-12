// Reusable +/- quantity stepper.
export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="qty" role="group" aria-label="Quantity">
      <button type="button" onClick={dec} disabled={value <= min} aria-label="Decrease quantity">
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={inc} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
