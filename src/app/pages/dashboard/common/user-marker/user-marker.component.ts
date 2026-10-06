import { Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { UserService } from '../../../../modules/user-module/services/user.service';
import { SmartSignal } from '@axisdk/axis-lib';
import { UserInterface } from '../../../../modules/user-module/interfaces/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-user-marker',
  templateUrl: './user-marker.component.html',
  styleUrl: './user-marker.component.scss',
  providers: [UserService],
})
export class UserMarkerComponent implements OnInit {
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _userService: UserService = inject(UserService);

  protected user: SmartSignal<UserInterface> = new SmartSignal<UserInterface>();

  protected userInitial: Signal<string> = computed((): string => {
    const user: UserInterface | null = this.user.value();
    return user ? `${user.first_name[0]}${user.last_name[0]}` : '';
  });

  protected markerClass: Signal<string[]> = computed((): string[] => {
    const user: UserInterface | null = this.user.value();
    if (!user) return ['marker'];

    return ['marker', `marker-${user.online}`];
  });

  private _getUser(): void {
    this._userService
      .get$()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap({
          subscribe: (): void => this.user.updateLoading(true),
          finalize: (): void => this.user.updateLoading(false),
        }),
      )
      .subscribe({
        next: (user: UserInterface): void => {
          this.user.updateValue(user);
        },
      });
  }

  ngOnInit(): void {
    this._getUser();
  }
}
