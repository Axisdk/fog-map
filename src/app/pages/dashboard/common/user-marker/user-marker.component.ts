import { Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { UserService } from '../../../../modules/user-module/services/user.service';
import { UserInterface } from '../../../../modules/user-module/interfaces/user.interface';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { UserStoreService } from '../../../../modules/user-module/services/user-store.service';

@Component({
  selector: 'app-user-marker',
  templateUrl: './user-marker.component.html',
  styleUrl: './user-marker.component.scss',
  providers: [UserService, UserStoreService],
})
export class UserMarkerComponent implements OnInit {
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _userService: UserService = inject(UserService);
  private readonly _userStoreService: UserStoreService = inject(UserStoreService);

  protected user: Signal<UserInterface | null> = toSignal(this._userStoreService.user$, {
    requireSync: true,
  });

  protected userInitial: Signal<string> = computed((): string => {
    const user: UserInterface | null = this.user();
    return user ? `${user.first_name[0]}${user.last_name[0]}` : '';
  });

  protected userClasses: Signal<string[]> = computed((): string[] => {
    const user: UserInterface | null = this.user();
    if (!user) return ['user'];

    return ['user', `user-status-${user.online}`];
  });

  private _getUser(): void {
    this._userService.get$().pipe(takeUntilDestroyed(this._destroyRef)).subscribe();
  }

  ngOnInit(): void {
    this._getUser();
  }
}
