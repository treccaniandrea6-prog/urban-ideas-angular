import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  token = '';
  error = '';

  constructor(private router: Router, private auth: AuthService) {}

  login(): void {
    this.error = '';

    const t = (this.token ?? '').trim();
    if (!t || t.length < 20) {
      this.error = 'Invalid token';
      return;
    }

    this.auth.setToken(t);
    this.router.navigateByUrl('/users');
  }
}