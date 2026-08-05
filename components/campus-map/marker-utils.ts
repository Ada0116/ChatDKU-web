// Utility to determine marker icon based on type and amenity sub-item name

import type { Marker } from "./types";

const getIconBaseName = (marker: Marker): string => {
  if (marker.type === "event") return "events";
  if (marker.type === "building") return "building";
  if (marker.type === "office") return "office";
  if (marker.type === "printer") return "printer";
  if (marker.type === "amenity" && marker.items.length > 0) {
    const name = marker.items[0].name.toLowerCase();
    if (name.includes("canteen") || name.includes("食堂")) return "canteen";
    if (name.includes("coffee") || name.includes("咖啡") || name.includes("never mind")) return "cafe";
    if (name.includes("familymart") || name.includes("全家")) return "familymart";
    if (name.includes("ice maker") || name.includes("ice")) return "ice";
    if (name.includes("parking") || name.includes("停车场")) return "parking";
    if (name.includes("shuttle") || name.includes("班车")) return "shuttle";
    if (name.includes("ev charging") || name.includes("充电")) return "EV";
  }
  return "building"; // fallback
};

export const getMarkerIconSrc = (marker: Marker, isSelected: boolean): string => {
  const base = getIconBaseName(marker);
  const suffix = isSelected ? "1" : "";
  return `/${base}${suffix}.png`;
};
