import { Service } from '@angular/core';
import { GeolocationInterface } from '../interfaces/geolocation.interface';

@Service({ autoProvided: false })
export class GeolocationHelperService {
  public parseGeolocation(geolocation: GeolocationCoordinates): GeolocationInterface {
    console.log(geolocation);
    return {
      id: Date.now(),
      coordinates: {
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        value: [geolocation?.longitude, geolocation.latitude],
      },
      accuracy: geolocation.accuracy,
      speed: geolocation.speed ?? 0,
    };
  }
}
