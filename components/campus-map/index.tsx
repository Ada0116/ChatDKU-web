"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useMediaQuery } from "@/components/hooks/use-media-query";
import { FilterButtons } from "./filter-buttons";
import { MapView } from "./map-view";
import { ListView } from "./list-view";
import { MapModal } from "./map-modal";
import { Button } from "@/components/ui/button";
import {
  buildListItems,
  type ExtraOfficeItem,
  type Marker,
  type MarkerType,
  type WeeklyEvent,
} from "./types";

// Static data loaded directly (student version does not fetch from API)
import campusData from "@/data/campus-markers.json";

// ==================== Event helpers ====================

function getThisWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  const format = (d: Date) => d.toISOString().split("T")[0];
  return { start: format(monday), end: format(sunday) };
}

function extractBuildingAbbr(location: string): string | null {
  if (!location) return null;
  const normalized = location.toUpperCase().replace(/\s+/g, " ");
  const buildingMap: { [key: string]: string } = {
    LIB: "LIB",
    LIBRARY: "LIB",
    AB: "AB",
    "ACADEMIC BUILDING": "AB",
    CCTW: "CCTW",
    "CCT W": "CCTW",
    "COMMUNITY CENTER W": "CCTW",
    CCTE: "CCTE",
    "CCT E": "CCTE",
    "COMMUNITY CENTER E": "CCTE",
    "SOCCER FIELD": "SF",
    "SOCCER": "SF",
    CC: "CC",
    "CONFERENCE CENTER": "CC",
    IB: "IB",
    "INNOVATION BUILDING": "IB",
    WDR: "WDR",
    "WHU-DUKE RESEARCH INSTITUTE": "WDR",
    SC: "SC",
    "SPORTS COMPLEX": "SC",
    ADB: "ADB",
    "ADMINISTRATIVE BUILDING": "ADB",
    VC: "VC",
    "VISITOR CENTER": "VC",
    "WATER PAVILION": "WP",
    "湖心亭": "WP",
    "ACADEMIC AVENUE": "AV",
    "AVENUE": "AV",
    "STUDENTS RESIDENCE": "SR",
    "RESIDENCE": "SR",
  };
  for (const [variant, abbr] of Object.entries(buildingMap)) {
    if (normalized.includes(variant)) return abbr;
  }
  return null;
}

function getBuildingCoord(
  abbr: string,
  allMarkers: Marker[],
): { top: number; left: number; markerId: number } | null {
  if (abbr === "CCTW") {
    const m = allMarkers.find((m) => m.type === "building" && m.id === 7);
    if (m) return { top: m.top, left: m.left, markerId: m.id };
  }
  if (abbr === "CCTE") {
    const m = allMarkers.find((m) => m.type === "building" && m.id === 8);
    if (m) return { top: m.top, left: m.left, markerId: m.id };
  }
  if (abbr === "LIB") {
    const m = allMarkers.find((m) => m.type === "building" && m.id === 5);
    if (m) return { top: m.top, left: m.left, markerId: m.id };
  }
  if (abbr === "WP") {
    const m = allMarkers.find((m) => m.type === "building" && m.id === 4);
    if (m) return { top: m.top, left: m.left, markerId: m.id };
  }
  if (abbr === "SF") {
    const m = allMarkers.find((m) => m.type === "building" && m.id === 10);
    if (m) return { top: m.top, left: m.left, markerId: m.id };
  }
  if (abbr === "AV") {
    const m = allMarkers.find((m) => m.type === "building" && m.id === 14);
    if (m) return { top: m.top, left: m.left, markerId: m.id };
  }
  if (abbr === "SR") {
    const m = allMarkers.find((m) => m.type === "building" && m.id === 11);
    if (m) return { top: m.top, left: m.left, markerId: m.id };
  }
  const buildingMarker = allMarkers.find(
    (m) =>
      m.type === "building" &&
      m.items.some((item) => {
        const name = item.name.toUpperCase();
        return (
          name.includes(abbr) ||
          (abbr === "AB" && name === "ACADEMIC BUILDING") ||
          (abbr === "CC" && name === "CONFERENCE CENTER") ||
          (abbr === "IB" && name === "INNOVATION BUILDING") ||
          (abbr === "WDR" && name === "WHU-DUKE RESEARCH INSTITUTE") ||
          (abbr === "SC" && name === "SPORTS COMPLEX") ||
          (abbr === "ADB" && name === "ADMINISTRATIVE BUILDING") ||
          (abbr === "VC" && name === "VISITOR CENTER")
        );
      }),
  );
  if (buildingMarker) {
    return {
      top: buildingMarker.top,
      left: buildingMarker.left,
      markerId: buildingMarker.id,
    };
  }
  return null;
}

function buildEventMarkers(
  events: WeeklyEvent[],
  allMarkers: Marker[],
): Marker[] {
  const map = new Map<
    string,
    { markerId: number; top: number; left: number; items: Marker["items"] }
  >();
  for (const ev of events) {
    const abbr = extractBuildingAbbr(ev.location);
    if (!abbr) continue;
    const coord = getBuildingCoord(abbr, allMarkers);
    if (!coord) continue;
    const key = `${coord.markerId}`;
    if (!map.has(key)) {
      map.set(key, {
        markerId: coord.markerId,
        top: coord.top,
        left: coord.left,
        items: [],
      });
    }
    const group = map.get(key)!;
    const item: any = {
      name: ev.title,
      description: `${ev.date} ${ev.start_time || ""} - ${ev.end_time || ""}`,
      location: ev.location,
      rawEvent: ev,
    };
    group.items.push(item);
  }
  const eventMarkers: Marker[] = [];
  for (const group of map.values()) {
    eventMarkers.push({
      id: -group.markerId,
      type: "event",
      top: group.top,
      left: group.left,
      items: group.items,
    });
  }
  return eventMarkers;
}

function useWeeklyEvents() {
  const [events, setEvents] = useState<WeeklyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchEvents = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const { start, end } = getThisWeekRange();
      const response = await fetch(
        `/api/weekly-events?start_date=${start}&end_date=${end}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err: any) {
      console.error("Failed to fetch weekly events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  return { events, loading, error, fetchEvents };
}

// ==================== Main Component ====================

export default function CampusMap({
  onAsk,
}: {
  onAsk: (reference: string) => void;
}) {
  const [lang, setLang] = useState<"en" | "zh">("en");

  const [selectedType, setSelectedType] = useState<MarkerType>("building");
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mapImage, setMapImage] = useState("/mapupdate.png");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalMarker, setModalMarker] = useState<{
    marker: Marker;
    itemIndex: number;
  } | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const panelContentRef = useRef<HTMLDivElement>(null);

  // Static markers from JSON
  const allStaticMarkers = useMemo(() => campusData.markers as Marker[], []);
  const extraOfficeItems = useMemo(
    () => campusData.extraOfficeItems as ExtraOfficeItem[],
    [],
  );

  // Weekly events
  const { events, loading, error, fetchEvents } = useWeeklyEvents();
  useEffect(() => {
    if (selectedType === "event") fetchEvents();
  }, [selectedType, fetchEvents]);

  const eventMarkers = useMemo(
    () => buildEventMarkers(events, allStaticMarkers),
    [events, allStaticMarkers],
  );

  // Determine which markers to show on the map
  const mapMarkers = useMemo(() => {
    if (selectedType === "event") return eventMarkers;
    return allStaticMarkers.filter((m) => m.type === selectedType);
  }, [selectedType, eventMarkers, allStaticMarkers]);

  const resolvedViewMode = isMobile ? "list" : viewMode;

  // Update map image based on dark/light mode
  useEffect(() => {
    const updateMapImage = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setMapImage(isDark ? "/dark.png" : "/mapupdate.png");
    };
    updateMapImage();
    const observer = new MutationObserver(updateMapImage);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Scroll panel to top when changing items
  useEffect(() => {
    if (panelContentRef.current) {
      panelContentRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  // Build list items for non-event types
  const listItems = useMemo(
    () => buildListItems(selectedType, allStaticMarkers, extraOfficeItems),
    [selectedType, allStaticMarkers, extraOfficeItems],
  );

  // For events, build a separate list from the events array
  const eventListItems = useMemo(() => {
    if (selectedType !== "event") return [];
    return events.map((ev, idx) => {
      const abbr = extractBuildingAbbr(ev.location);
      const coord = abbr ? getBuildingCoord(abbr, allStaticMarkers) : null;
      return {
        ...ev,
        markerId: coord ? coord.markerId : 0,
        markerType: "event" as const,
        itemIndex: idx,
      } as any;
    });
  }, [events, allStaticMarkers, selectedType]);

  // The actual items to render in list view
  const rawListItems = selectedType === "event" ? eventListItems : listItems;

  // Filter by search query
  const displayedItems = useMemo(() => {
    if (!searchQuery.trim()) return rawListItems;
    const q = searchQuery.toLowerCase().trim();
    return rawListItems.filter((item: any) => {
      if (selectedType === "event") {
        const ev = item as WeeklyEvent;
        return (
          ev.title?.toLowerCase().includes(q) ||
          ev.location?.toLowerCase().includes(q) ||
          ev.sponsor?.toLowerCase().includes(q) ||
          ev.speaker?.toLowerCase().includes(q)
        );
      }
      const name = item.name?.toLowerCase() || "";
      const nameZh = item.nameZh?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      const descZh = item.descriptionZh?.toLowerCase() || "";
      const intro = item.introduction?.toLowerCase() || "";
      const introZh = item.introductionZh?.toLowerCase() || "";
      const loc = item.location?.toLowerCase() || "";
      const locZh = item.locationZh?.toLowerCase() || "";
      return (
        name.includes(q) ||
        nameZh.includes(q) ||
        desc.includes(q) ||
        descZh.includes(q) ||
        intro.includes(q) ||
        introZh.includes(q) ||
        loc.includes(q) ||
        locZh.includes(q)
      );
    });
  }, [rawListItems, searchQuery, selectedType]);

  const handleFilter = (type: MarkerType) => {
    setSelectedType(type);
    setSelectedMarker(null);
    setCurrentIndex(0);
  };

  const handleViewOnMap = (
    markerId: number,
    itemIndex: number,
    itemType?: string,
  ) => {
    if (markerId === 0) return;
    let targetMarker: Marker | undefined;
    if (itemType === "event") {
      targetMarker = eventMarkers.find((m) => m.id === -markerId);
    } else {
      targetMarker = allStaticMarkers.find((m) => m.id === markerId);
    }
    if (!targetMarker) return;
    let resolvedIndex = itemIndex;
    // For events, itemIndex is the global events array index,
    // but we need the index within the marker's items (grouped by building).
    if (itemType === "event") {
      const ev = events[itemIndex];
      if (ev && targetMarker.items.length > 0) {
        const found = targetMarker.items.findIndex(
          (item: any) => item.rawEvent?.title === ev.title,
        );
        resolvedIndex = found >= 0 ? found : 0;
      } else {
        resolvedIndex = 0;
      }
    }
    if (isMobile) {
      setModalMarker({ marker: targetMarker, itemIndex: resolvedIndex });
    } else {
      setViewMode("map");
      setSelectedMarker(targetMarker);
      setCurrentIndex(resolvedIndex);
    }
  };

  // Translations
  const t = useMemo(() => {
    const isZh = lang === "zh";
    return {
      map: isZh ? "地图" : "Map",
      list: isZh ? "列表" : "List",
      searchPlaceholder: isZh
        ? "按名称或缩写搜索..."
        : "Search by name or abbreviation...",
    };
  }, [lang]);

  const filterLabelZh: Record<string, string> = {
    building: "建筑",
    office: "办公室",
    printer: "打印机",
    event: "活动",
    amenity: "设施",
  };

  const emptyMessage =
    lang === "zh"
      ? `暂无${filterLabelZh[selectedType] || selectedType}`
      : `No ${selectedType} available.`;

  return (
    <>
      <div className="w-full flex justify-center items-start p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-7xl mx-auto justify-center">
          {isMobile && (
            <FilterButtons
              selectedType={selectedType}
              onSelect={handleFilter}
              lang={lang}
            />
          )}

          <div className="relative w-full md:w-[1000px] h-[500px] md:h-[650px]">
            {/* Desktop: top bar with map/list toggle and search */}
            {!isMobile && (
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-2 pointer-events-none">
                <div className="flex gap-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full p-1 shadow-md border pointer-events-auto">
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    className="rounded-full px-3 py-1.5 text-sm font-medium"
                    onClick={() => setViewMode("map")}
                  >
                    {t.map}
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    className="rounded-full px-3 py-1.5 text-sm font-medium"
                    onClick={() => setViewMode("list")}
                  >
                    {t.list}
                  </Button>
                </div>
                {viewMode === "list" && (
                  <div className="flex-1 relative pointer-events-auto">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full px-3 py-1.5 pr-8 text-sm rounded-full border border-gray-300 dark:border-neutral-600 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {!isMobile && resolvedViewMode === "map" && (
              <MapView
                markers={mapMarkers}
                mapImage={mapImage}
                selectedMarker={selectedMarker}
                onSelectMarker={setSelectedMarker}
                currentIndex={currentIndex}
                onIndexChange={setCurrentIndex}
                panelContentRef={panelContentRef}
                onAsk={onAsk}
                lang={lang}
                onToggleLang={() =>
                  setLang((prev) => (prev === "en" ? "zh" : "en"))
                }
              />
            )}

            {(resolvedViewMode === "list" || isMobile) && (
              <ListView
                items={displayedItems}
                selectedType={selectedType}
                onAsk={onAsk}
                onViewOnMap={(markerId, itemIndex) =>
                  handleViewOnMap(markerId, itemIndex, selectedType)
                }
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                lang={lang}
                emptyMessage={emptyMessage}
                loading={loading}
                error={error}
                showSearch={isMobile}
                onToggleLang={() =>
                  setLang((prev) => (prev === "en" ? "zh" : "en"))
                }
              />
            )}
          </div>

          {!isMobile && (
            <FilterButtons
              selectedType={selectedType}
              onSelect={handleFilter}
              lang={lang}
            />
          )}
        </div>
      </div>

      {isMobile && modalMarker && (
        <MapModal
          marker={modalMarker.marker}
          itemIndex={modalMarker.itemIndex}
          mapImage={mapImage}
          onClose={() => setModalMarker(null)}
          lang={lang}
        />
      )}
    </>
  );
}
