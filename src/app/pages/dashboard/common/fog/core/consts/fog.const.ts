import type { Feature, Polygon } from 'geojson';
import { polygon } from '@turf/helpers';
import { webMercatorLatLimitConst } from './web-mercator.const';

export const fogRevealRadiusMetersConst = 30;

export const fogMinRevealDistanceMetersConst = fogRevealRadiusMetersConst / 2;

export const worldPolygonConst: Feature<Polygon> = polygon([
  [
    [-180, -webMercatorLatLimitConst],
    [180, -webMercatorLatLimitConst],
    [180, webMercatorLatLimitConst],
    [-180, webMercatorLatLimitConst],
    [-180, -webMercatorLatLimitConst],
  ],
]);
