type Props = {
  message: string;
  onClose: () => void;
};

export default function InlineAlert({ message, onClose }: Props) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
      <span>{message}</span>
      <button
        type="button"
        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold text-zinc-50 hover:bg-white/10"
        onClick={onClose}
      >
        Fechar
      </button>
    </div>
  );
}
