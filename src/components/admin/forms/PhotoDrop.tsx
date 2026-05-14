"use client";

import type { PhotoRef } from "@/lib/admin/types";
import { FOCUS_RING } from "@/lib/styles";
import { ImageIcon } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

type Props = {
  value: PhotoRef | null;
  onChange: (next: PhotoRef | null) => void;
  square?: boolean;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg"];

export function PhotoDrop({ value, onChange, square }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

  const accept = (file: File | undefined) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG or PNG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is over 5 MB.");
      return;
    }
    setError(undefined);
    onChange({ filename: file.name });
  };

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    accept(e.dataTransfer.files?.[0]);
  };

  const filename = value?.filename;

  return (
    <>
      <button
        type="button"
        aria-label={
          filename ? `Photo: ${filename}. Click to replace.` : "Upload photo"
        }
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        className={`border-ink/[0.18] relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[12px] border-2 border-dashed ${
          filename ? "" : "bg-ink/[0.02]"
        } ${FOCUS_RING.paper}`}
        style={{
          aspectRatio: square ? "1 / 1" : "4 / 3",
          gap: 8,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          hidden
          onChange={e => accept(e.target.files?.[0])}
        />
        {filename ? (
          <>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 40%, var(--color-amber-light) 0%, var(--color-amber) 35%, var(--color-tea) 100%)",
              }}
            />
            <div
              className="text-paper absolute font-medium"
              style={{
                bottom: 8,
                left: 8,
                padding: "4px 8px",
                borderRadius: 6,
                background: "rgb(26 24 21 / 0.7)",
                fontSize: 10,
                letterSpacing: 0.3,
              }}
            >
              {filename}
            </div>
            <div
              className="bg-paper text-ink border-ink/10 absolute border font-medium"
              style={{
                top: 8,
                right: 8,
                padding: "4px 8px",
                borderRadius: 6,
                fontSize: 11,
              }}
            >
              Replace
            </div>
          </>
        ) : (
          <>
            <div
              className="bg-ink/5 text-ink-muted flex items-center justify-center rounded-full"
              style={{ width: 36, height: 36 }}
            >
              <ImageIcon size={18} />
            </div>
            <div className="text-ink font-medium" style={{ fontSize: 13 }}>
              Drop a photo or click to upload
            </div>
            <div className="text-ink-soft" style={{ fontSize: 11 }}>
              JPG or PNG · up to 5 MB
            </div>
          </>
        )}
      </button>
      {error && (
        <div
          className="text-rose font-medium"
          style={{ fontSize: 11, marginTop: 6 }}
          role="alert"
        >
          {error}
        </div>
      )}
    </>
  );
}
