import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MapComponent, MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import { SmartSignal } from '@axisdk/axis-lib';
import { MapConfigInterface } from '../../modules/map-module/interfaces/map-config.interface';
import { MapService } from '../../modules/map-module/services/map.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { MapStoreService } from '../../modules/map-module/services/map-store.service';
import { GeolocationService } from '../../modules/geolocation-module/services/geolocation.service';
import { GeolocationHelperService } from '../../modules/geolocation-module/services/geolocation-helper.service';
import { GeolocationStore } from '../../modules/geolocation-module/services/geolocation-store.service';
import { GeolocationInterface } from '../../modules/geolocation-module/interfaces/geolocation.interface';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { UserMarkerComponent } from './common/user-marker/user-marker.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    MapComponent,
    UserMarkerComponent,
    SidebarComponent,
    UserMarkerComponent,
    MarkerComponent,
  ],
  providers: [
    MapService,
    MapStoreService,
    GeolocationService,
    GeolocationHelperService,
    GeolocationStore,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _mapService: MapService = inject(MapService);
  private readonly _geolocationService: GeolocationService = inject(GeolocationService);

  protected mapConfig: SmartSignal<MapConfigInterface | null> =
    new SmartSignal<MapConfigInterface | null>();
  protected geolocation: SmartSignal<GeolocationInterface | null> =
    new SmartSignal<GeolocationInterface | null>();

  private _initMapConfig(): void {
    this._mapService
      .getMapConfig$()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap({
          subscribe: (): void => this.mapConfig.updateLoading(true),
          finalize: (): void => this.mapConfig.updateLoading(false),
        }),
      )
      .subscribe((config: MapConfigInterface): void => {
        this.mapConfig.updateValue(config);
      });
  }

  private _initGeolocation(): void {
    this._geolocationService
      .getGeolocation$()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap({
          subscribe: (): void => this.geolocation.updateLoading(true),
          finalize: (): void => this.geolocation.updateLoading(false),
        }),
      )
      .subscribe((response: GeolocationInterface): void => this.geolocation.updateValue(response));
  }

  ngOnInit(): void {
    this._initMapConfig();
    this._initGeolocation();
  }
}
