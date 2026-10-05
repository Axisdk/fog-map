import { inject, Service } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { GeolocationInterface } from '../interfaces/geolocation.interface';
import { GeolocationStore } from './geolocation-store.service';
import { GeolocationHelperService } from './geolocation-helper.service';

@Service({ autoProvided: false })
export class GeolocationService {
  private readonly _geolocationStore: GeolocationStore = inject(GeolocationStore);
  private readonly _geolocationHelperService: GeolocationHelperService =
    inject(GeolocationHelperService);

  public getGeolocation$(): Observable<GeolocationInterface> {
    const navigator: Geolocation = window.navigator.geolocation;
    return new Observable<GeolocationInterface>(
      (subscriber: Subscriber<GeolocationInterface>): void => {
        navigator.getCurrentPosition(
          (response: GeolocationPosition): void => {
            subscriber.next(this._geolocationHelperService.parseGeolocation(response.coords));
          },
          (positionError: GeolocationPositionError): void => {
            subscriber.error(positionError);
          },
          { timeout: 15000, maximumAge: 1000, enableHighAccuracy: true },
        );
      },
    );
  }

  public listenGeolocation$(): Observable<GeolocationInterface> {
    const navigator: Geolocation = window.navigator.geolocation;
    return new Observable<GeolocationInterface>(
      (subscriber: Subscriber<GeolocationInterface>): (() => void) => {
        const watchId: number = navigator.watchPosition(
          (response: GeolocationPosition): void => {
            subscriber.next(this._geolocationHelperService.parseGeolocation(response.coords));
          },
          (positionError: GeolocationPositionError): void => {
            subscriber.error(positionError);
          },
          { timeout: 15000, maximumAge: 1000, enableHighAccuracy: true },
        );

        return (): void => navigator.clearWatch(watchId);
      },
    );
  }
}
