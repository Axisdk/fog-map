import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MapHelperService } from '../../../../modules/map-module/services/map-helper.service';
import { MapConfigInterface } from '../../../../modules/map-module/interfaces/map-config.interface';

@Component({
  selector: 'app-marker-follow',
  templateUrl: './marker-follow.component.html',
  styleUrl: './marker-follow.component.scss',
})
export class MarkerFollowComponent {
  private readonly _mapHelperService: MapHelperService = inject(MapHelperService);

  public mapConfig: InputSignal<MapConfigInterface | null> = input<MapConfigInterface | null>(null);

  protected isMarkerFollowing: WritableSignal<boolean> = signal(false);
  protected markerFollowingClass: Signal<string> = computed((): string => {
    return `marker-follow ${this.isMarkerFollowing() && 'active'}`;
  });

  constructor() {
    effect((): void => {
      this.isMarkerFollowing.set(!!this.mapConfig()?.marker_following);
    });
  }

  protected toggleMarkerFollow(): void {
    this._mapHelperService.updateMapConfig({ marker_following: !this.isMarkerFollowing() });
  }
}
