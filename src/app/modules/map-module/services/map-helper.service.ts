import { inject, Service } from '@angular/core';
import { MapStoreService } from './map-store.service';
import { UpdateMapConfigType } from '../types/update-map-config.type';
import { MapConfigInterface } from '../interfaces/map-config.interface';

@Service({
  autoProvided: false,
})
export class MapHelperService {
  private readonly _mapStoreService: MapStoreService = inject(MapStoreService);

  public updateMapConfig(updatedMapConfig: UpdateMapConfigType): void {
    const currentMapConfig: MapConfigInterface | null = this._mapStoreService.mapConfig$.getValue()
    if (!currentMapConfig) return

    this._mapStoreService.mapConfig$.next({
      ...currentMapConfig,
      ...updatedMapConfig
    })
  }
}
