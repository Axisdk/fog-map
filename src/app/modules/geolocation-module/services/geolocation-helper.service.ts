import { Service } from '@angular/core';
import { GeolocationInterface } from '../interfaces/geolocation.interface';
import { GeolocationAccuracyStatusEnum } from '../enums/geolocation-accuracy-status.enum';

@Service({ autoProvided: false })
export class GeolocationHelperService {
  private _checkAccuracyStatus(accuracy: number): GeolocationAccuracyStatusEnum {
    switch (true) {
      case accuracy > 0 && accuracy <= 15:
        return GeolocationAccuracyStatusEnum.GOOD;
      case accuracy > 15:
        return GeolocationAccuracyStatusEnum.BAD;
      default:
        return GeolocationAccuracyStatusEnum.NONE;
    }
  }

  public parseGeolocation(geolocation: GeolocationCoordinates): GeolocationInterface {
    return {
      id: Date.now(),
      coordinates: {
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        value: [geolocation?.longitude, geolocation.latitude],
      },
      accuracy: geolocation.accuracy,
      accuracy_status: this._checkAccuracyStatus(geolocation.accuracy),
      speed: geolocation.speed ?? 0,
    };
  }
}
