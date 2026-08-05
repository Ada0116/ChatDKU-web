import { Button } from "@/components/ui/button";
import type { MarkerType } from "./types";

const LABELS: Record<MarkerType, { en: string; zh: string }> = {
  building: { en: "Buildings", zh: "建筑" },
  office: { en: "Offices", zh: "办公室" },
  printer: { en: "Printers", zh: "打印机" },
  event: { en: "Events", zh: "活动" },
  amenity: { en: "Amenities", zh: "设施" },
};

export function FilterButtons({
  selectedType,
  onSelect,
  lang,
}: {
  selectedType: MarkerType;
  onSelect: (type: MarkerType) => void;
  lang: "en" | "zh";
}) {
  return (
    <>
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden w-full overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-thin px-2 mt-2">
        <div className="inline-flex gap-3">
          {(["building", "office", "printer", "event", "amenity"] as const).map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "secondary"}
              className="rounded-xl text-sm px-3 py-1.5 whitespace-nowrap"
              onClick={() => onSelect(type)}
            >
              {lang === "zh" ? LABELS[type].zh : LABELS[type].en}
            </Button>
          ))}
        </div>
      </div>
      {/* Desktop: vertical column */}
      <div className="hidden md:flex flex-col gap-4 justify-start mt-6">
        {(["building", "office", "printer", "event", "amenity"] as const).map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "secondary"}
            className="rounded-xl text-base px-4 py-2"
            onClick={() => onSelect(type)}
          >
            {lang === "zh" ? LABELS[type].zh : LABELS[type].en}
          </Button>
        ))}
      </div>
    </>
  );
}
