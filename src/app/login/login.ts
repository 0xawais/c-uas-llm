// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  credentials = {
    email: '',
    password: ''
  };

  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  isValidMilEmail(email: string): boolean {
    // Check if email matches the pattern: something@something.mil
    const milEmailPattern = /^[^\s@]+@[^\s@]+\.mil$/i;
    return milEmailPattern.test(email);
  }

  onSubmit(): void {
    // Clear previous error
    this.errorMessage = '';

    // Validate email format
    if (!this.isValidMilEmail(this.credentials.email)) {
      this.errorMessage = 'Please enter a valid .mil email address (e.g., name@example.mil)';
      return;
    }

    // Validate password is not empty
    if (!this.credentials.password) {
      this.errorMessage = 'Please enter your password';
      return;
    }

    // Attempt login
    if (this.authService.login(this.credentials.email, this.credentials.password)) {
      // Navigate to home on successful login
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Invalid credentials';
    }
  }

  signInWithCAC(): void {
    // Simulate CAC login - logs in directly without credentials
    this.authService.loginWithCAC();
    this.router.navigate(['/']);
  }
}