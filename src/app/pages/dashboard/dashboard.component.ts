import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MapComponent, MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import { MapConfigInterface } from '../../modules/map-module/interfaces/map-config.interface';
import { MapService } from '../../modules/map-module/services/map.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MapStoreService } from '../../modules/map-module/services/map-store.service';
import { GeolocationService } from '../../modules/geolocation-module/services/geolocation.service';
import { GeolocationHelperService } from '../../modules/geolocation-module/services/geolocation-helper.service';
import { GeolocationStore } from '../../modules/geolocation-module/services/geolocation-store.service';
import { GeolocationInterface } from '../../modules/geolocation-module/interfaces/geolocation.interface';
import { CoordinatesType } from '../../modules/geolocation-module/types/coordinates.type';
import { UserMarkerComponent } from './common/user-marker/user-marker.component';
import { ZoomControllerComponent } from './common/zoom-controller/zoom-controller.component';
import { MapHelperService } from '../../modules/map-module/services/map-helper.service';
import { MarkerFollowComponent } from './common/marker-follow/marker-follow.component';
import { UpdateMapConfigType } from '../../modules/map-module/types/update-map-config.type';
import { FogComponent } from './common/fog/fog.component';
import { AccuracyCircleComponent } from './common/accuracy-circle/accuracy-circle.component';
import { TrackStorageService } from '../../modules/track-module/services/track-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    MapComponent,
    UserMarkerComponent,
    MarkerComponent,
    ZoomControllerComponent,
    MarkerFollowComponent,
    FogComponent,
    AccuracyCircleComponent,
  ],
  providers: [
    MapService,
    MapHelperService,
    MapStoreService,
    GeolocationService,
    GeolocationHelperService,
    GeolocationStore,
    TrackStorageService,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _mapService: MapService = inject(MapService);
  private readonly _mapHelperService: MapHelperService = inject(MapHelperService);
  private readonly _mapStoreService: MapStoreService = inject(MapStoreService);
  private readonly _geolocationService: GeolocationService = inject(GeolocationService);
  private readonly _geolocationStore: GeolocationStore = inject(GeolocationStore);

  protected mapConfig: Signal<MapConfigInterface | null> = toSignal(
    this._mapStoreService.mapConfig$,
    { requireSync: true },
  );
  protected geolocation: Signal<GeolocationInterface | null> = toSignal(
    this._geolocationStore.geolocation$,
    { requireSync: true },
  );

  protected mapCenter: WritableSignal<CoordinatesType | undefined> = signal(undefined);

  constructor() {
    effect((): void => {
      const geolocation: GeolocationInterface | null = this.geolocation();
      const isMarkerFollowing = !!this.mapConfig()?.marker_following;

      if (geolocation && isMarkerFollowing) {
        this.mapCenter.set(geolocation.coordinates.value);
      }
    });
  }

  private _initMapConfig(): void {
    this._mapService.initMapConfig$().pipe(takeUntilDestroyed(this._destroyRef)).subscribe();
  }

  private _initGeolocation(): void {
    this._geolocationService
      .listenGeolocation$()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  protected updateMapConfig(value: UpdateMapConfigType): void {
    this._mapHelperService.updateMapConfig(value);
  }

  ngOnInit(): void {
    this._initMapConfig();
    this._initGeolocation();
  }
}
