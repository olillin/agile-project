"use client";

import {
  INGREDIENT_UNITS,
  newIngredientRow,
  type Ingredient,
} from "@/lib/admin/types";
import { FOCUS_RING } from "@/lib/styles";
import type { CSSProperties } from "react";

type Props = {
  rows: IngredientRow[];
  onChange: (next: IngredientRow[]) => void;
};

const GRID_COLS = "1fr 90px 100px 32px";
const GRID_GAP = 8;

const inputBase = `bg-paper text-ink border-ink/[0.12] rounded-[7px] border ${FOCUS_RING.paper}`;

// Strip leading zeros unless followed by a decimal separator
const normalizeAmount = (v: string): string => {
  if (!/^0[0-9]/.test(v)) return v;
  return v.replace(/^0+/, "") || "0";
};

const inputStyle: CSSProperties = {
  fontFamily: "inherit",
  fontSize: 13,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

export function IngredientsEditor({ rows, onChange }: Props) {
  const update = (i: number, row: IngredientRow) => {
    const next = rows.slice();
    next[i] = row;
    onChange(next);
  };
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () => onChange([...rows, newIngredientRow()]);

  return (
    <div className="flex flex-col" style={{ gap: GRID_GAP }}>
      <div
        className="text-ink-soft grid font-semibold whitespace-nowrap uppercase"
        style={{
          gridTemplateColumns: GRID_COLS,
          gap: GRID_GAP,
          fontSize: 10,
          letterSpacing: 1,
          padding: "0 2px",
        }}
      >
        <div>Ingredient</div>
        <div style={{ textAlign: "right" }}>Amount</div>
        <div>Unit</div>
        <div />
      </div>

      {rows.map((row, i) => (
        <Row
          key={row.id}
          row={row}
          onChange={r => update(i, r)}
          onRemove={() => remove(i)}
          canRemove={rows.length > 1}
        />
      ))}

      <button
        type="button"
        onClick={add}
        className={`text-ink-muted border-ink/[0.18] hover:border-ink/30 flex cursor-pointer items-center justify-center rounded-[7px] border border-dashed bg-transparent font-medium ${FOCUS_RING.paper}`}
        style={{
          marginTop: 4,
          padding: "9px 12px",
          gap: 6,
          fontSize: 12,
        }}
      >
        + Add ingredient
      </button>
    </div>
  );
}

type RowProps = {
  row: IngredientRow;
  onChange: (next: IngredientRow) => void;
  onRemove: () => void;
  canRemove: boolean;
};

function Row({ row, onChange, onRemove, canRemove }: RowProps) {
  const update = <K extends keyof IngredientRow>(
    key: K,
    val: IngredientRow[K]
  ) => onChange({ ...row, [key]: val });

  return (
    <div
      className="grid items-center"
      style={{ gridTemplateColumns: GRID_COLS, gap: GRID_GAP }}
    >
      <input
        type="text"
        value={row.name}
        onChange={e => update("name", e.target.value)}
        placeholder="Ingredient (e.g. halloumi)"
        className={inputBase}
        style={{ ...inputStyle, padding: "9px 12px" }}
      />
      <input
        type="text"
        inputMode="decimal"
        value={row.amount}
        onChange={e => {
          const v = e.target.value;
          if (v === "" || /^[0-9]*[.,]?[0-9]*$/.test(v)) {
            update("amount", normalizeAmount(v));
          }
        }}
        placeholder="0"
        className={inputBase}
        style={{
          ...inputStyle,
          padding: "9px 10px",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      />
      <div style={{ position: "relative" }}>
        <select
          value={row.unit}
          onChange={e =>
            update("unit", e.target.value as IngredientRow["unit"])
          }
          className={`${inputBase} cursor-pointer appearance-none`}
          style={{ ...inputStyle, padding: "9px 28px 9px 10px" }}
        >
          {INGREDIENT_UNITS.map(u => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="text-ink-muted pointer-events-none absolute"
          style={{
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 9,
          }}
        >
          ▾
        </span>
      </div>
      <button
        type="button"
        onClick={canRemove ? onRemove : undefined}
        disabled={!canRemove}
        aria-label="Remove ingredient"
        className={`text-ink-muted flex items-center justify-center rounded-[7px] disabled:cursor-not-allowed disabled:opacity-40 ${
          canRemove ? "hover:bg-ink/5 cursor-pointer" : ""
        } ${FOCUS_RING.paper}`}
        style={{ width: 32, height: 32, fontSize: 16 }}
      >
        ×
      </button>
    </div>
  );
}
