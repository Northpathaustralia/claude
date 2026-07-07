// Standard button. `variant`: primary | secondary | danger | ghost.
const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-300',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-300',
  ghost: 'text-brand-700 hover:bg-brand-50 focus:ring-brand-200',
};

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }) {
  const sizeCls = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition
        focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant] || VARIANTS.primary} ${sizeCls} ${className}`}
      {...props}
    />
  );
}
