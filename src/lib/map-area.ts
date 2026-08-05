import type { GeoJsonGeometry } from "@/lib/map-content-api";

const EARTH_RADIUS = 6378137;

function ringArea(coordinates: number[][]): number {
  if (coordinates.length < 3) return 0;

  let area = 0;
  const radians = Math.PI / 180;

  for (let i = 0; i < coordinates.length; i += 1) {
    const lower = coordinates[i];
    const middle = coordinates[(i + 1) % coordinates.length];
    const upper = coordinates[(i + 2) % coordinates.length];

    area +=
      (upper[0] - lower[0]) *
      radians *
      Math.sin(middle[1] * radians);
  }

  return Math.abs((area * EARTH_RADIUS * EARTH_RADIUS) / 2);
}

export function calculateGeometryArea(geometry: GeoJsonGeometry | null): number {
  if (!geometry) return 0;

  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates as number[][][];
    if (!rings.length) return 0;
    const outer = ringArea(rings[0]);
    const holes = rings.slice(1).reduce((sum, ring) => sum + ringArea(ring), 0);
    return Math.max(0, outer - holes);
  }

  if (geometry.type === "MultiPolygon") {
    const polygons = geometry.coordinates as number[][][][];
    return polygons.reduce((sum, polygon) => {
      if (!polygon.length) return sum;
      const outer = ringArea(polygon[0]);
      const holes = polygon.slice(1).reduce((holeSum, ring) => holeSum + ringArea(ring), 0);
      return sum + Math.max(0, outer - holes);
    }, 0);
  }

  return 0;
}

export function formatArea(squareMeters: number) {
  const hectares = squareMeters / 10000;
  return {
    squareMeters,
    hectares,
    squareMetersText: new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 0,
    }).format(squareMeters),
    hectaresText: new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(hectares),
  };
}
