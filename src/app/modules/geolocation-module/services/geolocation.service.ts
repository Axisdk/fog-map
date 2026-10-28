import { inject, Service } from '@angular/core';
import { Observable, Subscriber, tap } from 'rxjs';
import { GeolocationInterface } from '../interfaces/geolocation.interface';
import { GeolocationStore } from './geolocation-store.service';
import { GeolocationHelperService } from './geolocation-helper.service';
import { TrackStorageService } from '../../track-module/services/track-storage.service';

@Service({ autoProvided: false })
export class GeolocationService {
  private readonly _geolocationStore: GeolocationStore = inject(GeolocationStore);
  private readonly _geolocationHelperService: GeolocationHelperService =
    inject(GeolocationHelperService);
  private readonly _trackStorageService: TrackStorageService = inject(TrackStorageService);

  private _handleGeolocation(geolocation: GeolocationInterface): void {
    this._geolocationStore.geolocation$.next(geolocation);
    void this._trackStorageService
      .addPoint({
        id: geolocation.id,
        coordinates: geolocation.coordinates.value,
        timestamp: geolocation.id,
      })
      .catch((): void => undefined);
  }

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
    ).pipe(
      tap((geolocation: GeolocationInterface): void => {
        this._handleGeolocation(geolocation);
      }),
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
    ).pipe(
      tap((geolocation: GeolocationInterface): void => {
        this._handleGeolocation(geolocation);
      }),
    );
  }
}
