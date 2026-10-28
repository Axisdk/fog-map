import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { MapHelperService } from '../../../../modules/map-module/services/map-helper.service';

const MIN_ZOOM = 0;
const MAX_ZOOM = 22;

@Component({
  selector: 'app-zoom-controller',
  templateUrl: './zoom-controller.component.html',
  styleUrl: './zoom-controller.component.scss',
})
export class ZoomControllerComponent {
  private readonly _mapHelperService: MapHelperService = inject(MapHelperService);

  public zoom: InputSignal<number> = input<number>(MIN_ZOOM);

  protected isMinZoom: Signal<boolean> = computed((): boolean => this.zoom() <= MIN_ZOOM);
  protected isMaxZoom: Signal<boolean> = computed((): boolean => this.zoom() >= MAX_ZOOM);

  protected updateZoom(delta: number): void {
    const nextZoom: number = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom() + delta));
    if (nextZoom === this.zoom()) return;

    this._mapHelperService.updateMapConfig({ zoom: nextZoom });
  }
}
