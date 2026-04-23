import { Tag } from "@/components/brand/Tag";
import type { ClimateLabel } from "@/lib/types";
import { Leaf } from "lucide-react";

type Props = {
  climate: number;
  climateLabel: ClimateLabel;
};

export function ClimateTag({ climate, climateLabel }: Props) {
  return (
    <Tag
      tone={`climate-${climateLabel}`}
      icon={<Leaf size={12} strokeWidth={2} aria-hidden />}
    >
      {climate.toFixed(1)} kg CO₂e
    </Tag>
  );
}
