import { CoordinatesType } from '../../geolocation-module/types/coordinates.type';

export interface TrackPointInterface {
  id: number;
  coordinates: CoordinatesType;
  timestamp: number;
}
