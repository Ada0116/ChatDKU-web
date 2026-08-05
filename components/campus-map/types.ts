export type MarkerType = "building" | "office" | "printer" | "event" | "amenity";

export type SubItem = {
  name: string;
  description: string;
  hours?: string;
  location: string;
  image?: string;
  introduction?: string;
  // Chinese translations
  nameZh?: string;
  descriptionZh?: string;
  hoursZh?: string;
  locationZh?: string;
  introductionZh?: string;
};

export type Marker = {
  id: number;
  type: MarkerType;
  top: number;
  left: number;
  items: SubItem[];
};

export type WeeklyEvent = {
  title: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  sponsor: string;
  open_to: string;
  speaker: string;
  url: string;
};

export type ExtraOfficeItem = SubItem & { id: string };

export type ListItem = SubItem & {
  markerId: number;
  markerType: Marker["type"];
  itemIndex: number;
  id?: string;
};

/**
 * Flatten markers (and standalone office items) for the current filter into a
 * single list. Offices additionally fold in `extraOfficeItems` and are sorted
 * alphabetically. Events are handled separately via weekly events API.
 */
export function buildListItems(
  selectedType: MarkerType,
  markers: Marker[],
  extraOfficeItems: ExtraOfficeItem[],
): ListItem[] {
  const safeMarkers = markers || [];

  if (selectedType === "building" || selectedType === "printer" || selectedType === "amenity") {
    return safeMarkers
      .filter((m) => m.type === selectedType)
      .flatMap((marker) =>
        marker.items.map((item, idx) => ({
          ...item,
          markerId: marker.id,
          markerType: marker.type,
          itemIndex: idx,
        })),
      );
  }

  // Office: combine marked offices + extra items, sort alphabetically
  const officeItems = safeMarkers
    .filter((m) => m.type === "office")
    .flatMap((marker) =>
      marker.items.map((item, idx) => ({
        ...item,
        markerId: marker.id,
        markerType: marker.type,
        itemIndex: idx,
      })),
    );
  const extraItems = (extraOfficeItems || []).map((item) => ({
    ...item,
    markerId: -1,
    markerType: "office" as const,
    itemIndex: -1,
  }));
  return [...officeItems, ...extraItems].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}
