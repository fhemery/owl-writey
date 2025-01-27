export interface UserDetails {
  readonly isLoggedIn: boolean;
  readonly uid: string | null;
  readonly email: string | null;
}
