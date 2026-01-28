import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService, CreateUserPayload } from '../services/users.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error = '';
  page = 1;

  // create user
  newUser: CreateUserPayload = {
    name: '',
    email: '',
    gender: 'male',
    status: 'active',
  };
  creatingUser = false;
  createUserError = '';
  createUserOk = false;

  // delete user
  deletingId: number | null = null;
  deleteOkId: number | null = null;
  deleteErrorId: number | null = null;
  deleteErrorMsg = '';

  constructor(
    private usersService: UsersService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers(1);
  }

  loadUsers(page: number): void {
    const safePage = Math.max(1, Number(page) || 1);

    this.page = safePage;
    this.loading = true;
    this.error = '';

    this.usersService.getUsers(this.page).subscribe({
      next: (data: any[]) => {
        this.users = data ?? [];
        this.loading = false;

        // ✅ forza aggiornamento UI (fix "appare solo dopo click")
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        const status = err?.status;
        if (status === 401) this.error = 'Unauthorized. Please sign in again.';
        else this.error = 'Error loading users.';

        this.cdr.detectChanges();
      },
    });
  }

  nextPage(): void {
    if (this.loading) return;
    this.loadUsers(this.page + 1);
  }

  prevPage(): void {
    if (this.loading || this.page <= 1) return;
    this.loadUsers(this.page - 1);
  }

  openUser(userId: number): void {
    this.router.navigate(['/users', userId]);
  }

  goPosts(): void {
    this.router.navigateByUrl('/posts');
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  createUser(): void {
    this.createUserError = '';
    this.createUserOk = false;

    const name = (this.newUser.name || '').trim();
    const email = (this.newUser.email || '').trim();
    const gender = this.newUser.gender;
    const status = this.newUser.status;

    if (!name || !email) {
      this.createUserError = 'Name and email are required.';
      return;
    }

    this.creatingUser = true;

    this.usersService.createUser({ name, email, gender, status }).subscribe({
      next: () => {
        this.creatingUser = false;
        this.createUserOk = true;

        this.newUser = { ...this.newUser, name: '', email: '' };
        this.loadUsers(this.page);

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.creatingUser = false;
        const statusCode = err?.status;
        if (statusCode === 422)
          this.createUserError = 'Invalid data (email might already exist).';
        else if (statusCode === 401)
          this.createUserError = 'Unauthorized. Please sign in again.';
        else this.createUserError = 'Error creating user.';

        this.cdr.detectChanges();
      },
    });
  }

  deleteUser(userId: number): void {
    const id = Number(userId);
    if (!id) return;

    this.deletingId = id;
    this.deleteOkId = null;
    this.deleteErrorId = null;
    this.deleteErrorMsg = '';

    this.usersService.deleteUser(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.deleteOkId = id;
        this.loadUsers(this.page);

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.deletingId = null;
        this.deleteErrorId = id;

        const statusCode = err?.status;
        if (statusCode === 401)
          this.deleteErrorMsg = 'Unauthorized. Please sign in again.';
        else this.deleteErrorMsg = 'Error deleting user.';

        this.cdr.detectChanges();
      },
    });
  }
}