import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersApiService } from '../core/api/users-api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  users: any[] = [];
  loading = false;
  error = '';
  page = 1;

  constructor(private usersApi: UsersApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.usersApi.getUsers(this.page).subscribe({
      next: (users: any[]) => {
        this.users = users;
        this.loading = false;
        this.error = '';
      },
      error: () => {
        this.loading = false;
        this.error = 'Unauthorized. Please sign in again.';
      },
    });
  }

  nextPage(): void {
    this.page++;
    this.loadUsers();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }
}