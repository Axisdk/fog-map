import { inject, Service } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';
import { ExampleUserConst } from '../consts/example-user.const';
import { UserStoreService } from './user-store.service';

@Service({ autoProvided: false })
export class UserService {
  private readonly _userStoreService: UserStoreService = inject(UserStoreService);

  public get$(): Observable<UserInterface> {
    return of(ExampleUserConst).pipe(
      tap((user: UserInterface): void => {
        this._userStoreService.user$.next(user);
      }),
    );
  }
}
