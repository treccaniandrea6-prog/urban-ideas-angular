import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  let router: Router;

  // Dummy snapshots (authGuard vuole 2 argomenti)
  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/users' } as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            navigateByUrl: (_url: string, _extras?: any) => Promise.resolve(true),
            createUrlTree: (_commands: any[]) => ({} as any),
          },
        },
      ],
    });

    router = TestBed.inject(Router);
    sessionStorage.clear();
  });

  it('should deny access when token is missing', () => {
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(false);
  });

  it('should allow access when token exists', () => {
    sessionStorage.setItem('token', 'fake-token-12345678901234567890');

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });
});