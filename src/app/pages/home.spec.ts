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
class HomeComponentSpecHost {}

describe('HomeComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponentSpecHost],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponentSpecHost);
    expect(fixture.componentInstance).toBeTruthy();
  });
});