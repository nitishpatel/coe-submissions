export const ModalShell: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}> = ({ title, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50">
    <div
      className="absolute inset-0 bg-black/30"
      onClick={onClose}
      aria-hidden="true"
    />
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200 flex items-center">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 hover:bg-slate-50"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M18 6 6 18M6 6l12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-3">{children}</div>
        <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-2">
          {footer}
        </div>
      </div>
    </div>
  </div>
);
