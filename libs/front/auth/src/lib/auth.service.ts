import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  User,
} from '@angular/fire/auth';
import {
  combineLatest,
  from,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

import { EmailPasswordLoginData } from './model/email-password-login-data';
import { UserDetails } from './model/user-details';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private refreshToken$ = new Subject<void>();
  user$: Observable<User | null> = combineLatest([
    authState(this.auth),
    this.refreshToken$.pipe(startWith(null)),
  ]).pipe(map(([auth]) => auth));
  userDetails$: Observable<UserDetails> = this.user$.pipe(
    switchMap((user) => {
      if (!user) {
        return of({ isLoggedIn: false, uid: null, roles: [], email: null });
      }
      return from(user.getIdTokenResult()).pipe(
        map(
          (): UserDetails => ({
            isLoggedIn: true,
            uid: user.uid,
            email: user.email,
          })
        )
      );
    })
  );

  isLoggedIn$: Observable<boolean> = this.user$.pipe(map((user) => !!user));

  login({ email, password }: EmailPasswordLoginData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  refreshToken(): Promise<string> {
    return (
      this.auth.currentUser?.getIdToken(true) || Promise.resolve('')
    ).then((val) => {
      this.refreshToken$.next();
      return val;
    });
  }

  get user(): User | null {
    return this.auth.currentUser;
  }
}
