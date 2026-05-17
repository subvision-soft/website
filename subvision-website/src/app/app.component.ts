import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'subvision-website';
  isDark = false;
  isNavOpen = false;
  readonly repoOwner = 'subvision-soft';
  readonly repoName = 'subvision-core';
  starsCount: number | null = null;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = storedTheme ?? 'dark';
    this.applyTheme(initialTheme);
    void this.loadGithubStats();
  }

  ngAfterViewInit(): void {
    const links = Array.from(this.document.querySelectorAll('a.moving-letters'));
    links.forEach((link) => this.wrapMovingLetters(link));
  }

  get logoSrc(): string {
    return this.isDark ? 'img/logo_long.light.svg' : 'img/logo_long.dark.svg';
  }

  toggleTheme(): void {
    this.applyTheme(this.isDark ? 'light' : 'dark');
  }

  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    this.isDark = theme === 'dark';
    this.document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  formatCompact(value: number | null): string {
    if (value === null) {
      return '...';
    }

    return new Intl.NumberFormat('en', { notation: 'compact' }).format(value);
  }

  private async loadGithubStats(): Promise<void> {
    const repoPath = `${this.repoOwner}/${this.repoName}`;

    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${repoPath}`, {
        headers: {
          Accept: 'application/vnd.github+json'
        }
      });

      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        this.starsCount = typeof repoData?.stargazers_count === 'number'
          ? repoData.stargazers_count
          : null;
      }
    } catch {
      this.starsCount = null;
    }
  }

  private wrapMovingLetters(link: Element): void {
    if (link.querySelector('span')) {
      return;
    }

    const text = link.textContent?.trim() ?? '';
    if (!text) {
      return;
    }

    const span = this.document.createElement('span');
    text.split('').forEach((char) => {
      const letter = this.document.createElement('i');
      letter.textContent = char === ' ' ? '\u00a0' : char;
      span.appendChild(letter);
    });

    link.textContent = '';
    link.appendChild(span);
  }
}
