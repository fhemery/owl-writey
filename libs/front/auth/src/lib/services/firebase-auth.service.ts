import { inject, Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
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

  getToken(): Promise<string> | undefined {
    return this.user()?.getIdToken();
  }

  async login(login: string, password: string): Promise<boolean> {
    try {
      const user = await signInWithEmailAndPassword(this.auth, login, password);

      await waitFor(20);
      await this.router.navigateByUrl('/dashboard');

      return !!user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  }

  async register(login: string, password: string): Promise<boolean> {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        login,
        password
      );
      await waitFor(20);
      return !!user;
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await waitFor(20);
    await this.router.navigateByUrl('');
  }
}

async function waitFor(timeInMs: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, timeInMs));
}
