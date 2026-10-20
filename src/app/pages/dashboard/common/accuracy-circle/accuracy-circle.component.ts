import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { GeoJSONSourceComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import buffer from '@turf/buffer';
import { point } from '@turf/helpers';
import { GeolocationInterface } from '../../../../modules/geolocation-module/interfaces/geolocation.interface';
import { GeolocationAccuracyStatusEnum } from '../../../../modules/geolocation-module/enums/geolocation-accuracy-status.enum';

interface AccuracyCircleStyle {
  fillColor: string;
  fillOpacity: number;
  lineColor: string;
  lineOpacity: number;
  lineDasharray: number[];
}

const accuracyCircleStyleByStatus: Record<GeolocationAccuracyStatusEnum, AccuracyCircleStyle> = {
  [GeolocationAccuracyStatusEnum.GOOD]: {
    fillColor: '#21a839',
    fillOpacity: 0.3,
    lineColor: '#21a839',
    lineOpacity: 1,
    lineDasharray: [1, 0],
  },
  [GeolocationAccuracyStatusEnum.BAD]: {
    fillColor: '#aa6f1d',
    fillOpacity: 0.3,
    lineColor: '#b87136',
    lineOpacity: 1,
    lineDasharray: [1, 2],
  },
  [GeolocationAccuracyStatusEnum.NONE]: {
    fillColor: 'transparent',
    fillOpacity: 0,
    lineColor: '#434343',
    lineOpacity: 0,
    lineDasharray: [1, 0],
  },
};

@Component({
  selector: 'app-accuracy-circle',
  templateUrl: './accuracy-circle.component.html',
  styleUrl: './accuracy-circle.component.scss',
  imports: [GeoJSONSourceComponent, LayerComponent],
})
export class AccuracyCircleComponent {
  public geolocation: InputSignal<GeolocationInterface | null> = input<GeolocationInterface | null>(
    null,
  );

  protected readonly accuracyGeoJson: Signal<Feature<Polygon | MultiPolygon> | null> = computed(
    (): Feature<Polygon | MultiPolygon> | null => {
      const geolocation: GeolocationInterface | null = this.geolocation();
      if (!geolocation) return null;

      const [lng, lat] = geolocation.coordinates.value;
      return buffer(point([lng, lat]), geolocation.accuracy, { units: 'meters' }) ?? null;
    },
  );

  protected readonly style: Signal<AccuracyCircleStyle> = computed(
    (): AccuracyCircleStyle =>
      accuracyCircleStyleByStatus[
        this.geolocation()?.accuracy_status ?? GeolocationAccuracyStatusEnum.NONE
      ],
  );
}
