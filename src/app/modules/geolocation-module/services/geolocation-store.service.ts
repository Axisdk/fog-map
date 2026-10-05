import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeolocationInterface } from '../interfaces/geolocation.interface';

@Service({ autoProvided: false })
export class GeolocationStore {
  public geolocation$: BehaviorSubject<GeolocationInterface | null> =
    new BehaviorSubject<GeolocationInterface | null>(null);
}
