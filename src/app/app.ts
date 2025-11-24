import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './header/header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'tartans4defense';

  constructor(public router: Router) {}

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  openReviewForm(): void {
    this.router.navigate(['/review-system']);
  }
}