"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer: ReactNode;
};

// Wraps the native <dialog> element so we get focus trap, Escape handling, and
// inert background.
export function Dialog({ open, onClose, title, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    const dialog = ref.current;
    if (!dialog) return;
    const r = dialog.getBoundingClientRect();
    const inside =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom;
    if (!inside) onClose();
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={onBackdropClick}
      className="bg-paper backdrop:bg-ink/50 fixed border-0"
      style={{
        inset: 0,
        margin: "auto",
        width: 420,
        height: "fit-content",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 20px 60px rgb(26 24 21 / 0.3)",
      }}
      aria-labelledby={titleId}
    >
      <h2
        id={titleId}
        className="text-ink text-center font-serif"
        style={{ fontSize: 22, margin: 0, marginBottom: 8 }}
      >
        {title}
      </h2>
      <div
        className="text-ink-muted text-center"
        style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 18 }}
      >
        {children}
      </div>
      <div className="flex [&>*]:flex-1" style={{ gap: 8 }}>
        {footer}
      </div>
    </dialog>
  );
}
