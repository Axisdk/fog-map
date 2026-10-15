import { CoordinatesInterface } from './coordinates.interface';
import { GeolocationAccuracyStatusEnum } from '../enums/geolocation-accuracy-status.enum';

export interface GeolocationInterface {
  id: number;
  coordinates: CoordinatesInterface;
  accuracy: number;
  accuracy_status: GeolocationAccuracyStatusEnum;
  speed: number;
}
