import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NAV_LINKS } from '../../app.routes';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <!-- Logo / Brand -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">AI</span>
          </div>
          <h1 class="text-lg font-bold text-gray-800">Sales Call Agent</h1>
        </div>

        <!-- Nav Links -->
        <div class="hidden md:flex items-center gap-6">
          <a
            *ngFor="let link of navLinks"
            [routerLink]="link.path"
            routerLinkActive="text-indigo-600 font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-gray-700 hover:text-indigo-600 transition font-medium"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Mobile Menu Toggle (optional) -->
        <button class="md:hidden p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  navLinks = NAV_LINKS;
}
