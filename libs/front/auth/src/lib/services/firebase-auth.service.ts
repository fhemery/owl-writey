import { inject, Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  isLoginEnabled = true;
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  isInitialized = signal(false);

  user: Signal<User | null> = toSignal(
    authState(this.auth).pipe(
      map((u) => {
        return u || null;
      }),
      tap(() => this.isInitialized.set(true))
    ),
    { initialValue: null }
  );

  async login(login: string, password: string): Promise<boolean> {
    try {
      const user = await signInWithEmailAndPassword(this.auth, login, password);
      // This is a tricky workaround, because the "authState" observable does not update immediately,
      // therefore the Guard executes with the old value.
      setTimeout(() => {
        this.router.navigateByUrl('/dashboard');
      }, 10);
      return !!user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  }

  async logout() {
    await signOut(this.auth);
    // This is a tricky workaround, because the "authState" observable does not update immediately,
    // therefore the Guard executes with the old value.
    setTimeout(() => {
      this.router.navigateByUrl('');
    }, 10);
  }
}
