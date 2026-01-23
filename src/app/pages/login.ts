import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  token = '';
  error = '';

  constructor(private router: Router) {}

  login(): void {
    if (!this.token || this.token.length < 20) {
      this.error = 'Invalid token';
      return;
    }

    sessionStorage.setItem('token', this.token);
    this.router.navigateByUrl('/users');
  }
}
