import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MenuComponent } from './menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
  template: ''
})
class DummyComponent { }

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MenuComponent,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DummyComponent },
          { path: 'movies', component: DummyComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with mobile menu closed', () => {
    expect(component.isMobileMenuOpen).toBeFalsy();
  });

  it('should toggle mobile menu', () => {
    expect(component.isMobileMenuOpen).toBeFalsy();
    
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeTruthy();
    
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalsy();
  });

  it('should close mobile menu', () => {
    component.isMobileMenuOpen = true;
    component.closeMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalsy();
  });

  it('should render mobile menu toggle button', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggleButton = compiled.querySelector('.mobile-menu-toggle');
    expect(toggleButton).toBeTruthy();
  });

  it('should render navigation links', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const dashboardLink = compiled.querySelector('a[routerLink="/dashboard"]');
    const moviesLink = compiled.querySelector('a[routerLink="/movies"]');
    
    expect(dashboardLink).toBeTruthy();
    expect(moviesLink).toBeTruthy();
    expect(dashboardLink?.textContent?.trim()).toBe('Dashboard');
    expect(moviesLink?.textContent?.trim()).toBe('List');
  });

  it('should have correct hamburger lines', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const hamburgerLines = compiled.querySelectorAll('.hamburger-line');
    expect(hamburgerLines.length).toBe(3);
  });

  it('should toggle mobile menu on button click', () => {
    const toggleSpy = vi.spyOn(component, 'toggleMobileMenu');
    fixture.detectChanges();
    
    const toggleButton = fixture.nativeElement.querySelector('.mobile-menu-toggle');
    toggleButton.click();
    
    expect(toggleSpy).toHaveBeenCalled();
  });

  it('should close mobile menu when clicking overlay', () => {
    const closeSpy = vi.spyOn(component, 'closeMobileMenu');
    fixture.detectChanges();
    
    const overlay = fixture.nativeElement.querySelector('.mobile-overlay');
    overlay.click();
    
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should close mobile menu when clicking navigation link', () => {
    const closeSpy = vi.spyOn(component, 'closeMobileMenu');
    fixture.detectChanges();
    
    const dashboardLink = fixture.nativeElement.querySelector('a[routerLink="/dashboard"]');
    dashboardLink.click();
    
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should apply open class to toggle button when menu is open', () => {
    component.isMobileMenuOpen = true;
    fixture.detectChanges();
    
    const toggleButton = fixture.nativeElement.querySelector('.mobile-menu-toggle');
    expect(toggleButton.classList).toContain('open');
  });

  it('should apply active class to overlay when menu is open', () => {
    component.isMobileMenuOpen = true;
    fixture.detectChanges();
    
    const overlay = fixture.nativeElement.querySelector('.mobile-overlay');
    expect(overlay.classList).toContain('active');
  });

  it('should apply mobile-open class to sidebar when menu is open', () => {
    component.isMobileMenuOpen = true;
    fixture.detectChanges();
    
    const sidebar = fixture.nativeElement.querySelector('.sidebar');
    expect(sidebar.classList).toContain('mobile-open');
  });
});