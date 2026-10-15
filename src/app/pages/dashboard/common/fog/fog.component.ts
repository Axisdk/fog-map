import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GeoJSONSourceComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import buffer from '@turf/buffer';
import union from '@turf/union';
import difference from '@turf/difference';
import distance from '@turf/distance';
import { featureCollection, point } from '@turf/helpers';
import { GeolocationStore } from '../../../../modules/geolocation-module/services/geolocation-store.service';
import { GeolocationInterface } from '../../../../modules/geolocation-module/interfaces/geolocation.interface';
import {
  fogMinRevealDistanceMetersConst,
  fogRevealRadiusMetersConst,
  worldPolygonConst,
} from './core/consts/fog.const';

@Component({
  selector: 'app-fog',
  templateUrl: './fog.component.html',
  styleUrl: './fog.component.scss',
  imports: [GeoJSONSourceComponent, LayerComponent],
})
export class FogComponent {
  private readonly _geolocationStore: GeolocationStore = inject(GeolocationStore);

  private readonly _geolocation: Signal<GeolocationInterface | null> = toSignal(
    this._geolocationStore.geolocation$,
    { requireSync: true },
  );

  private readonly _revealed: WritableSignal<Feature<Polygon | MultiPolygon> | null> = signal(null);
  private _lastRevealedAt: [number, number] | null = null;

  protected readonly fogGeoJson: Signal<Feature<Polygon | MultiPolygon>> = computed(
    (): Feature<Polygon | MultiPolygon> => {
      const revealed: Feature<Polygon | MultiPolygon> | null = this._revealed();
      if (!revealed) return worldPolygonConst;

      return difference(featureCollection([worldPolygonConst, revealed])) ?? worldPolygonConst;
    },
  );

  constructor() {
    effect((): void => {
      const geolocation: GeolocationInterface | null = this._geolocation();
      if (geolocation) this._reveal(geolocation.coordinates.value);
    });
  }

  private _reveal([lng, lat]: [number, number]): void {
    if (
      this._lastRevealedAt &&
      distance(point(this._lastRevealedAt), point([lng, lat]), { units: 'meters' }) <
        fogMinRevealDistanceMetersConst
    ) {
      return;
    }
    this._lastRevealedAt = [lng, lat];

    const circle: Feature<Polygon | MultiPolygon> | undefined = buffer(
      point([lng, lat]),
      fogRevealRadiusMetersConst,
      { units: 'meters' },
    );
    if (!circle) return;

    const current: Feature<Polygon | MultiPolygon> | null = this._revealed();
    this._revealed.set(current ? (union(featureCollection([current, circle])) ?? circle) : circle);
  }
}
