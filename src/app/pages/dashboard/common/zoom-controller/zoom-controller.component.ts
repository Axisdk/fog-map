import { Component, inject, input, InputSignal } from '@angular/core';
import { MapHelperService } from '../../../../modules/map-module/services/map-helper.service';
import { MapConfigInterface } from '../../../../modules/map-module/interfaces/map-config.interface';

@Component({
  selector: 'app-zoom-controller',
  templateUrl: './zoom-controller.component.html',
  styleUrl: './zoom-controller.component.scss',
  providers: [MapHelperService],
})
export class ZoomControllerComponent {
  private readonly _mapHelperService: MapHelperService = inject(MapHelperService);

  public mapConfig: InputSignal<MapConfigInterface | null> = input<MapConfigInterface | null>(null);

  protected updateZoom(isZoomIn: boolean): void {
    const mapConfig: MapConfigInterface | null = this.mapConfig();
    if (!mapConfig) return;

    this._mapHelperService.updateMapConfig({
      zoom: isZoomIn ? mapConfig.zoom + 1 : mapConfig.zoom - 1,
    });
  }
}
