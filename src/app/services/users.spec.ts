import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UsersService, CreateUserPayload } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);

    sessionStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUsers should return array', async () => {
    const p = new Promise<void>((resolve) => {
      service.getUsers(1).subscribe((data) => {
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(1);
        resolve();
      });
    });

    const req = httpMock.expectOne('https://gorest.co.in/public/v2/users?page=1');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

    req.flush([{ id: 1, name: 'Mario' }]);

    await p;
  });

  it('createUser should call post', async () => {
    const payload: CreateUserPayload = {
      name: 'Mario',
      email: 'mario@test.com',
      gender: 'male',
      status: 'active',
    };

    const p = new Promise<void>((resolve) => {
      service.createUser(payload).subscribe((res) => {
        expect(res).toBeTruthy();
        resolve();
      });
    });

    const req = httpMock.expectOne('https://gorest.co.in/public/v2/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({ id: 10, ...payload });

    await p;
  });

  it('deleteUser should call delete', async () => {
    const p = new Promise<void>((resolve) => {
      service.deleteUser(10).subscribe(() => resolve());
    });

    const req = httpMock.expectOne('https://gorest.co.in/public/v2/users/10');
    expect(req.request.method).toBe('DELETE');

    req.flush({});

    await p;
  });

  it('getUserById should call get', async () => {
    const p = new Promise<void>((resolve) => {
      service.getUserById(10).subscribe((u) => {
        expect(u.id).toBe(10);
        resolve();
      });
    });

    const req = httpMock.expectOne('https://gorest.co.in/public/v2/users/10');
    expect(req.request.method).toBe('GET');

    req.flush({ id: 10, name: 'Luigi' });

    await p;
  });

  it('getUserPosts should call get', async () => {
    const p = new Promise<void>((resolve) => {
      service.getUserPosts(10).subscribe((posts) => {
        expect(Array.isArray(posts)).toBe(true);
        expect(posts.length).toBe(1);
        resolve();
      });
    });

    const req = httpMock.expectOne('https://gorest.co.in/public/v2/users/10/posts');
    expect(req.request.method).toBe('GET');

    req.flush([{ id: 1, user_id: 10, title: 't', body: 'b' }]);

    await p;
  });

  it('should handle 401 error example', async () => {
    const p = new Promise<void>((resolve) => {
      service.getUsers(1).subscribe({
        next: () => {
          throw new Error('Should not go to next');
        },
        error: (err: any) => {
          expect(err.status).toBe(401);
          resolve();
        },
      });
    });

    const req = httpMock.expectOne('https://gorest.co.in/public/v2/users?page=1');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    await p;
  });
});