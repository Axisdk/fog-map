import { inject, Service } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { MapConfigInterface } from '../interfaces/map-config.interface';
import { mapConfigConst } from '../consts/map-config.const';
import { MapStoreService } from './map-store.service';

@Service({ autoProvided: false })
export class MapService {
  private readonly _mapStoreService: MapStoreService = inject(MapStoreService);

  public getMapConfig$(): Observable<MapConfigInterface> {
    return of(mapConfigConst).pipe(
      tap({
        next: (response: MapConfigInterface): void => {
          this._mapStoreService.mapConfig$.next(response);
        },
      }),
    );
  }
}
