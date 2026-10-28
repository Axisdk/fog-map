import { Component, inject, input, InputSignal } from '@angular/core';
import { MapHelperService } from '../../../../modules/map-module/services/map-helper.service';

@Component({
  selector: 'app-marker-follow',
  templateUrl: './marker-follow.component.html',
  styleUrl: './marker-follow.component.scss',
})
export class MarkerFollowComponent {
  private readonly _mapHelperService: MapHelperService = inject(MapHelperService);

  public markerFollowing: InputSignal<boolean> = input<boolean>(false);

  protected toggleMarkerFollow(): void {
    this._mapHelperService.updateMapConfig({ marker_following: !this.markerFollowing() });
  }
}
