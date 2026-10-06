import { Service } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';
import { ExampleUserConst } from '../consts/example-user.const';

@Service({ autoProvided: false })
export class UserService {
  public get$(): Observable<UserInterface> {
    return of(ExampleUserConst).pipe(delay(2000));
  }
}
