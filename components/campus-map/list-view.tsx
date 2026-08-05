import { ResourceCard } from "./resource-card";
import { Button } from "@/components/ui/button";
import type { ListItem, MarkerType, WeeklyEvent } from "./types";

/** Event item with optional map marker info */
type EventListItem = WeeklyEvent & { markerId: number };

function EventCard({
  ev,
  hasMapMarker,
  onViewOnMap,
  onMoreInfo,
  lang,
}: {
  ev: EventListItem;
  hasMapMarker: boolean;
  onViewOnMap: () => void;
  onMoreInfo?: () => void;
  lang: "en" | "zh";
}) {
  const isZh = lang === "zh";
  let dateTimeStr = "";
  if (ev.date) {
    const dateObj = new Date(ev.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    let timePart = "";
    if (ev.start_time) {
      timePart += ` at ${ev.start_time.substring(0, 5)}`;
      if (ev.end_time) {
        timePart += ` - ${ev.end_time.substring(0, 5)}`;
      }
    }
    dateTimeStr = `${formattedDate}${timePart}`;
  }

  const locationLabel = isZh ? "位置：" : "Location:";
  const sponsorLabel = isZh ? "主办方：" : "Sponsor:";
  const openToLabel = isZh ? "面向人群：" : "Open to:";
  const speakerLabel = isZh ? "演讲者：" : "Speaker:";
  const moreInfoLabel = isZh ? "更多信息" : "More Info";
  const viewOnMapLabel = isZh ? "在地图上查看" : "View on map";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 min-w-0 break-words">
        <div className="font-semibold text-base md:text-lg">{ev.title}</div>
        {dateTimeStr && (
          <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {dateTimeStr}
          </div>
        )}
        {ev.location && (
          <div className="text-xs md:text-sm mt-1">
            <span className="font-medium">{locationLabel}</span> {ev.location}
          </div>
        )}
        {ev.sponsor && (
          <div className="text-xs md:text-sm">
            <span className="font-medium">{sponsorLabel}</span> {ev.sponsor}
          </div>
        )}
        {ev.open_to && (
          <div className="text-xs md:text-sm">
            <span className="font-medium">{openToLabel}</span> {ev.open_to}
          </div>
        )}
        {ev.speaker && (
          <div className="text-xs md:text-sm">
            <span className="font-medium">{speakerLabel}</span> {ev.speaker}
          </div>
        )}
      </div>
      <div className="flex flex-row sm:flex-col justify-start sm:justify-center gap-2 sm:gap-3 flex-shrink-0">
        {ev.url && (
          <Button
            className="rounded-lg text-xs md:text-sm"
            onClick={() => window.open(ev.url, "_blank", "noopener noreferrer")}
          >
            {moreInfoLabel}
          </Button>
        )}
        {hasMapMarker && (
          <Button
            variant="secondary"
            className="rounded-lg text-xs md:text-sm"
            onClick={onViewOnMap}
          >
            {viewOnMapLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export function ListView({
  items,
  selectedType,
  onAsk,
  onViewOnMap,
  searchQuery,
  onSearchChange,
  lang,
  emptyMessage,
  loading = false,
  error = null,
  showSearch = true,
  onToggleLang,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  selectedType: MarkerType;
  onAsk: (reference: string) => void;
  onViewOnMap: (markerId: number, itemIndex: number) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  lang: "en" | "zh";
  emptyMessage: string;
  loading?: boolean;
  error?: string | null;
  showSearch?: boolean;
  onToggleLang?: () => void;
}) {
  const isZh = lang === "zh";
  const placeholder = isZh
    ? "按名称或缩写搜索..."
    : "Search by name or abbreviation...";
  const loadingText = isZh ? "加载活动中..." : "Loading events...";
  const errorPrefix = isZh ? "加载活动失败：" : "Failed to load events: ";
  const noEventsText = isZh ? "本周暂无活动。" : "No events this week.";

  // For amenities, sort ice makers to the bottom
  const sortedItems =
    selectedType === "amenity"
      ? [...items].sort((a, b) => {
          const aIsIce = (a as any).name?.includes("Ice Maker");
          const bIsIce = (b as any).name?.includes("Ice Maker");
          if (aIsIce && !bIsIce) return 1;
          if (!aIsIce && bIsIce) return -1;
          return 0;
        })
      : items;

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-xl border flex flex-col">
      {showSearch && (
        <div className="px-3 pt-3 pb-2 md:pt-14 md:px-4 flex items-center gap-2 bg-white dark:bg-neutral-900 z-10">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-1.5 pr-8 text-sm rounded-full border border-gray-300 dark:border-neutral-600 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-sm font-medium shadow-sm border hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all text-neutral-700 dark:text-neutral-200 flex-shrink-0"
            >
              {lang === "en" ? "中" : "EN"}
            </button>
          )}
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto px-3 pb-4 md:px-4 ${
          showSearch ? "" : "pt-16"
        }`}
      >
        {loading && selectedType === "event" && (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            {loadingText}
          </div>
        )}
        {error && selectedType === "event" && (
          <div className="text-center py-10 text-red-500">
            {errorPrefix}
            {error}
          </div>
        )}
        {!loading && !error && sortedItems.length === 0 && selectedType === "event" && (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            {noEventsText}
          </div>
        )}
        {!loading && !error && sortedItems.length === 0 && selectedType !== "event" && (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            {emptyMessage}
          </div>
        )}

        <div className="space-y-3 md:space-y-4">
          {sortedItems.map((item, idx) => {
            // Events are passed as WeeklyEvent items in the list
            if (selectedType === "event") {
              const ev = item as unknown as EventListItem;
              const hasMapMarker = ev.markerId !== 0;
              return (
                <div
                  key={`event-${idx}`}
                  className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3 md:p-4 shadow-sm"
                >
                  <EventCard
                    ev={ev}
                    hasMapMarker={hasMapMarker}
                    onViewOnMap={() => onViewOnMap(ev.markerId, idx)}
                    lang={lang}
                  />
                </div>
              );
            }
            return (
              <ResourceCard
                key={`${item.markerId}-${idx}`}
                item={item}
                onAsk={onAsk}
                onViewOnMap={onViewOnMap}
                lang={lang}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
