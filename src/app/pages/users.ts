import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersApiService } from '../core/api/users-api.service';

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
})
export class UsersComponent implements OnInit {
  private usersApi = inject(UsersApiService);

  users: any[] = [];
  loading = false;
  error = '';

  // (form create user)
  newName = '';
  newEmail = '';
  newGender: 'male' | 'female' = 'male';
  newStatus: 'active' | 'inactive' = 'active';

  page = 1;

  ngOnInit(): void {
    this.loadUsers(1);
  }

  loadUsers(page: number): void {
    this.page = page;
    this.loading = true;
    this.error = '';

    this.usersApi.getUsers(this.page).subscribe({
      next: (users: any[]) => {
        this.users = users ?? [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Errore caricamento utenti';
        this.loading = false;
      },
    });
  }

  nextPage(): void {
    this.loadUsers(this.page + 1);
  }

  prevPage(): void {
    this.loadUsers(Math.max(1, this.page - 1));
  }
}
