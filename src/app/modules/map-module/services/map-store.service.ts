import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapConfigInterface } from '../interfaces/map-config.interface';

@Service({ autoProvided: false })
export class MapStoreService {
  public mapConfig$: BehaviorSubject<MapConfigInterface | null> =
    new BehaviorSubject<MapConfigInterface | null>(null);
}
