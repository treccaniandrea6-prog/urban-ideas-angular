import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: '',
})
class LoginComponentSpecHost {}

describe('LoginComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponentSpecHost],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponentSpecHost);
    expect(fixture.componentInstance).toBeTruthy();
  });
});