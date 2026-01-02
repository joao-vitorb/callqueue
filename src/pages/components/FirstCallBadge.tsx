type Props = {
  isVisible: boolean;
};

export default function FirstCallBadge({ isVisible }: Props) {
  if (!isVisible) return null;

  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white">
      <i className="fa-solid fa-1 text-[11px] text-zinc-950" />
    </span>
  );
}
