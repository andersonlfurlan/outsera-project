import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headerTitle = compiled.querySelector('.header-title');
    expect(headerTitle).toBeTruthy();
    expect(headerTitle?.textContent?.trim()).toBe('Frontend Angular Test');
  });

  it('should have correct CSS classes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headerElement = compiled.querySelector('.header');
    expect(headerElement).toBeTruthy();
    expect(headerElement?.classList).toContain('header');
  });

  it('should contain header container', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headerContainer = compiled.querySelector('.header-container');
    expect(headerContainer).toBeTruthy();
  });
});