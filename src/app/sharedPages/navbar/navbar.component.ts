import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userLogado: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {

    const token = localStorage.getItem('token');
    this.userLogado = token != null;

      console.log(token)
      console.log(this.userLogado)
    this.initNavbarLinks();
    this.initScrollTo();
    this.initMobileDropdowns(); // Adicione esta linha para inicializar os dropdowns
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = document.getElementById('header') as HTMLElement;
    if (window.pageYOffset > 100) {
      element.classList.add('header-scrolled');
    } else {
      element.classList.remove('header-scrolled');
    }
  }

  private select(el: string, all: boolean = false): Element | NodeList | null {
    el = el.trim();
    if (all) {
      return document.querySelectorAll(el);
    } else {
      return document.querySelector(el);
    }
  }

  private on(type: string, el: string, listener: EventListenerOrEventListenerObject, all: boolean = false): void {
    let selectEl = this.select(el, all);
    if (selectEl instanceof NodeList) {
      selectEl.forEach((e: Node) => {
        if (e instanceof HTMLElement) {
          e.addEventListener(type, listener);
        }
      });
    } else if (selectEl instanceof HTMLElement) {
      selectEl.addEventListener(type, listener);
    }
  }

  private onscroll(listener: EventListener): void {
    document.addEventListener('scroll', listener);
  }

  private initNavbarLinks(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbarLinksActive();
      }
    });
    window.addEventListener('load', () => this.updateNavbarLinksActive());
    this.onscroll(() => this.updateNavbarLinksActive());
  }

  private updateNavbarLinksActive(): void {
    const navbarlinks = this.select('#navbar .scrollto', true) as NodeList;
    const currentRoute = this.router.url;

    navbarlinks.forEach((node: Node) => {
      if (node instanceof HTMLAnchorElement) {
        if (currentRoute === node.getAttribute('href')) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      }
    });
  }

  private initScrollTo(): void {
    this.on('click', '.scrollto', (e: Event) => {
      let target = e.currentTarget as HTMLElement;
      if (target instanceof HTMLAnchorElement && this.select(target.hash) instanceof HTMLElement) {
        e.preventDefault();
        this.scrollto(target.hash);
      }
    }, true);
  }

  private scrollto(el: string): void {
    const target = document.querySelector(el);
    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - 100,
        behavior: 'smooth'
      });
    }
  }

  // Mobile nav toggle
  toggleMobileNav(): void {
    const navbar = this.select('#navbar') as HTMLElement;
    const toggleButton = this.select('.mobile-nav-toggle') as HTMLElement;
    navbar.classList.toggle('navbar-mobile');
    toggleButton.classList.toggle('bi-list');
    toggleButton.classList.toggle('bi-x');
  }

  // Mobile nav dropdowns activate
  private initMobileDropdowns(): void {
    this.on('click', '.navbar .dropdown > a', (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const navbar = this.select('#navbar') as HTMLElement;
      if (navbar.classList.contains('navbar-mobile')) {
        e.preventDefault();
        const dropdownMenu = target.nextElementSibling as HTMLElement;
        if (dropdownMenu.classList.contains('dropdown-active')) {
          dropdownMenu.classList.remove('dropdown-active');
          dropdownMenu.classList.add('dropdown-active-hide');
          setTimeout(() => {
            dropdownMenu.classList.remove('dropdown-active-hide');
            dropdownMenu.style.display = 'none';
          }, 300);
        } else {
          dropdownMenu.style.display = 'block';
          dropdownMenu.classList.add('dropdown-active');
        }
      }
    }
)}}
