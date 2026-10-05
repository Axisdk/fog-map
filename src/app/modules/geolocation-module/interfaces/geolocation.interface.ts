import { CoordinatesInterface } from './coordinates.interface';

export interface GeolocationInterface {
  id: number;
  coordinates: CoordinatesInterface;
  accuracy: number;
  speed: number;
}
