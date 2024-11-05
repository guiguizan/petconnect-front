import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  contactForm: FormGroup;
  showMessage: boolean = false;
  successMessage: string = '';

  constructor(
    private viewportScroller: ViewportScroller,
    private metaService: Meta,
    private titleService: Title,
    private fb: FormBuilder
  ) {
    // Initialize contactForm in the constructor
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      comments: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Pet Connect');
    this.metaService.addTags([
      { name: 'description', content: 'Domu Cabinets offers top-notch carpentry services with over 20 years of experience. Contact us for your custom projects!' },
      { name: 'keywords', content: 'carpentry, custom cabinets, kitchen design, living room design, Domu Cabinets' },
      { name: 'author', content: 'Domu Cabinets' },
      { property: 'og:title', content: 'Home - Domu Cabinets' },
      { property: 'og:description', content: 'Domu Cabinets offers top-notch carpentry services with over 20 years of experience. Contact us for your custom projects!' },
      { property: 'og:image', content: 'assets/img/logo2.png' },
      { property: 'og:url', content: 'URL_da_home' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Home - Domu Cabinets' },
      { name: 'twitter:description', content: 'Domu Cabinets offers top-notch carpentry services with over 20 years of experience. Contact us for your custom projects!' },
      { name: 'twitter:image', content: 'assets/img/logo2.png' }
    ]);
  }

  scrollToSection(section: string): void {
    this.viewportScroller.scrollToAnchor(section);
  }

  onSendEmail(): void {

  }
}
