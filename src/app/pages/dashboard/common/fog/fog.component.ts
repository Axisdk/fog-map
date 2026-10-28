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
import { TrackStorageService } from '../../../../modules/track-module/services/track-storage.service';
import { TrackPointInterface } from '../../../../modules/track-module/interfaces/track-point.interface';
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
  private readonly _trackStorageService: TrackStorageService = inject(TrackStorageService);

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
    void this._loadHistory();

    effect((): void => {
      const geolocation: GeolocationInterface | null = this._geolocation();
      if (geolocation) this._reveal(geolocation.coordinates.value);
    });
  }

  private async _loadHistory(): Promise<void> {
    const points: TrackPointInterface[] = await this._trackStorageService.getAllPoints();

    const circles: Feature<Polygon | MultiPolygon>[] = [];
    let lastRevealedAt: [number, number] | null = null;

    for (const { coordinates } of points) {
      const [lng, lat] = coordinates;
      if (
        lastRevealedAt &&
        distance(point(lastRevealedAt), point([lng, lat]), { units: 'meters' }) <
          fogMinRevealDistanceMetersConst
      ) {
        continue;
      }
      lastRevealedAt = [lng, lat];

      const circle: Feature<Polygon | MultiPolygon> | undefined = buffer(
        point([lng, lat]),
        fogRevealRadiusMetersConst,
        { units: 'meters' },
      );
      if (circle) circles.push(circle);
    }

    if (circles.length === 0) return;

    const history: Feature<Polygon | MultiPolygon> | null =
      circles.length === 1 ? circles[0] : union(featureCollection(circles));
    if (!history) return;

    this._lastRevealedAt = lastRevealedAt;

    const current: Feature<Polygon | MultiPolygon> | null = this._revealed();
    this._revealed.set(
      current ? (union(featureCollection([current, history])) ?? current) : history,
    );
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
