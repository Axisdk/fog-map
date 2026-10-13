import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Service({ autoProvided: false })
export class UserStoreService {
  public user$: BehaviorSubject<UserInterface | null> = new BehaviorSubject<UserInterface | null>(
    null,
  );
}
