import { Button } from "@/components/ui/button";
import type { ListItem } from "./types";

export function ResourceCard({
  item,
  onAsk,
  onViewOnMap,
  lang,
}: {
  item: ListItem;
  onAsk: (reference: string) => void;
  onViewOnMap: (markerId: number, itemIndex: number) => void;
  lang: "en" | "zh";
}) {
  const isZh = lang === "zh";
  const name = isZh && item.nameZh ? item.nameZh : item.name;
  const desc = isZh && item.descriptionZh ? item.descriptionZh : item.description;
  const intro = isZh && item.introductionZh ? item.introductionZh : item.introduction;
  const hours = isZh && item.hoursZh ? item.hoursZh : item.hours;
  const location = isZh && item.locationZh ? item.locationZh : item.location;

  const isBuilding = item.markerType === "building";
  const isOfficeOrPrinter =
    item.markerType === "office" || item.markerType === "printer";
  const isAmenity = item.markerType === "amenity";
  const hasMapMarker = item.markerId !== -1;

  const openHoursLabel = isZh ? "开放时间：" : "Open Hours:";
  const locationLabel = isZh ? "位置：" : "Location:";
  const askLabel = isZh ? "向 ChatDKU 询问" : "Ask ChatDKU";
  const viewOnMapLabel = isZh ? "在地图上查看" : "View on map";
  const viewItOnMapLabel = isZh ? "在地图上查看" : "View on the map";

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3 md:p-4 shadow-sm">
      {item.image && item.markerType === "building" && (
        <img
          src={item.image}
          alt={name}
          className="w-full h-28 md:h-32 object-cover rounded-lg mb-3"
        />
      )}

      {isBuilding && (
        <>
          <div>
            <div className="font-semibold text-base md:text-lg">{name}</div>
            <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {desc}
            </div>
            <div className="mt-2 md:mt-3 text-xs md:text-sm space-y-1">
              {hours && (
                <div>
                  <span className="font-medium">{openHoursLabel}</span> {hours}
                </div>
              )}
              <div className="whitespace-pre-line break-words">
                <span className="font-medium">{locationLabel}</span> {location}
              </div>
            </div>
          </div>
          <Button
            className="mt-3 md:mt-4 w-full rounded-lg text-sm"
            onClick={() => onViewOnMap(item.markerId, item.itemIndex)}
          >
            {viewItOnMapLabel}
          </Button>
        </>
      )}

      {isOfficeOrPrinter && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 min-w-0 break-words">
            <div className="font-semibold text-base md:text-lg">{name}</div>
            <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {desc}
            </div>
            {intro && (
              <div className="mt-1 text-xs italic text-neutral-500 dark:text-neutral-400">
                {intro}
              </div>
            )}
            <div className="mt-2 md:mt-3 text-xs md:text-sm space-y-1">
              {hours && (
                <div>
                  <span className="font-medium">{openHoursLabel}</span> {hours}
                </div>
              )}
              {hasMapMarker && location && (
                <div className="whitespace-pre-line break-words">
                  <span className="font-medium">{locationLabel}</span> {location}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row sm:flex-col justify-start sm:justify-center gap-2 sm:gap-3 flex-shrink-0">
            <Button
              className="rounded-lg text-xs md:text-sm"
              onClick={() => onAsk(`About ${item.name}`)}
            >
              {askLabel}
            </Button>
            {hasMapMarker && (
              <Button
                variant="secondary"
                className="rounded-lg text-xs md:text-sm"
                onClick={() => onViewOnMap(item.markerId, item.itemIndex)}
              >
                {viewOnMapLabel}
              </Button>
            )}
          </div>
        </div>
      )}

      {isAmenity && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 min-w-0 break-words">
            <div className="font-semibold text-base md:text-lg">{name}</div>
            <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {desc}
            </div>
            {intro && (
              <div className="mt-1 text-xs italic text-neutral-500 dark:text-neutral-400">
                {intro}
              </div>
            )}
            <div className="mt-2 md:mt-3 text-xs md:text-sm space-y-1">
              {hours && (
                <div>
                  <span className="font-medium">{openHoursLabel}</span> {hours}
                </div>
              )}
              <div className="whitespace-pre-line break-words">
                <span className="font-medium">{locationLabel}</span> {location}
              </div>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col justify-start sm:justify-center gap-2 sm:gap-3 flex-shrink-0">
            {hasMapMarker && (
              <Button
                variant="secondary"
                className="rounded-lg text-xs md:text-sm"
                onClick={() => onViewOnMap(item.markerId, item.itemIndex)}
              >
                {viewOnMapLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
