import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'subvision-website';
  isDark = false;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme ?? (prefersDark ? 'dark' : 'light');
    this.applyTheme(initialTheme);
  }

  get logoSrc(): string {
    return this.isDark ? 'img/logo_long.light.svg' : 'img/logo_long.dark.svg';
  }

  toggleTheme(): void {
    this.applyTheme(this.isDark ? 'light' : 'dark');
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    this.isDark = theme === 'dark';
    this.document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
