import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-dynamic-dropdowns',
  templateUrl: './dynamic-dropdowns.component.html',
  styleUrls: ['./dynamic-dropdowns.component.scss']
})
export class DynamicDropdownsComponent implements OnInit {
  @Output() firstDropdownComplete = new EventEmitter<string>();
  @Output() secondDropdownComplete = new EventEmitter<string>();

  firstDropdownOptions = [
    { value: '3', label: 'Domu' },
    { value: '1', label: 'Plus' },
    { value: '2', label: 'Premium' },
    { value: '4', label: 'High End' }
  ];

  secondDropdownOptions: any[] = [];
  selectedFirstDropdown: string | null = null;
  selectedSecondDropdown: any | null = null;
  dropdownOpen = false;

  optionsMapping: { [key: string]: any[] } = {
    '1': [
      { label: 'Cashmere Grey', image: '/assets/img/materials/Egger/U702ST9 Cashmere Grey.png' },
      { label: 'Fog Grey', image: '/assets/img/materials/Egger/U779 ST9 Fog grey.jpg' },
      { label: 'Stone Grey', image: '/assets/img/materials/Egger/U727 ST9 Stone Grey.jpg' },
      { label: 'Dust Grey', image: '/assets/img/materials/Egger/U732 PM or ST9.webp' },
      { label: 'Diamond Grey', image: '/assets/img/materials/Egger/U963 ST9 Diamant Grey.webp' },
      { label: 'Natural Maple', image: '/assets/img/materials/Egger/Eurodekor H1816 ST Natural Maple.jpg' },
      { label: 'Hadrock Maple', image: '/assets/img/materials/Egger/H1815 Hardrock maple.jpg' },
      { label: 'White Havana Pine', image: '/assets/img/materials/Egger/H3078 White Havana Pine.jpg' },
      { label: 'Black Havana Pine', image: '/assets/img/materials/Egger/H3081 Black Havana Pine.jpg' },
      { label: 'Fox Grey Tossini Elm', image: '/assets/img/materials/Egger/H1222 Fox Grey Tossini Elm.jpg' },
      { label: 'Honey Carini Walnut', image: '/assets/img/materials/Egger/h3790 Honey Carini.webp' },
      { label: 'Auburn Carini Walnut', image: '/assets/img/materials/Egger/H3791 Auburni Carini Walnut.jpg' },
      { label: 'Natural Carini Walnut', image: '/assets/img/materials/Natural Carini Walnut.webp' },
      { label: 'Vicenza Oak', image: '/assets/img/materials/Vicenza Oak.webp' },
      { label: 'Chromix Silver', image: '/assets/img/materials/Chromix Silver.webp' }
    ],
    '2': [
      { label: 'MDF White High Gloss', image: '/assets/img/materials/Imeca/MDS White High Gloss.jpg' },
      { label: 'MDF White Matte Soft Touch', image: '/assets/img/materials/Imeca/MDF White Matte Soft Touch.jpg' },
      { label: 'MDF Mocaccino High Gloss', image: '/assets/img/materials/Imeca/MDF Mocaccino High Gloss.jpg' },
      { label: 'MDF Dark Grey High Gloss', image: '/assets/img/materials/Imeca/MDF Dark Grey High Gloss.jpg' },
      { label: 'MDF Black High Gloss', image: '/assets/img/materials/Imeca/MDF Black High Gloss.jpg' },
      { label: 'MDF Mocaccino Matte', image: '/assets/img/materials/Imeca/MDF Mocaccino Matte.jpg' },
      { label: 'MDF Black Matte', image: '/assets/img/materials/Imeca/MDF Black Matte.jpg' },
      { label: 'MDF Dark Grey Matte', image: '/assets/img/materials/Imeca/MDF Dark Grey Matte.jpg' }
    ],
    '3': [
      { label: 'Melamine Natu Caramelo', image: '/assets/img/materials/Imeca/Melamine Natu Caramelo.jpg' },
      { label: 'Melamine Natu Cenizo', image: '/assets/img/materials/Imeca/Melamine Natu Cenizo.jpg' },
      { label: 'Melamine Black', image: '/assets/img/materials/Imeca/Melamine Black.jpg' },
      { label: 'Melamine Sandalo Rustic Finish', image: '/assets/img/materials/Imeca/Melamine Sandalo Rustic.jpg' },
      { label: 'Melamine White', image: '/assets/img/materials/Imeca/Melamine White.jpg' },
      { label: 'Melamine Natu Expresso', image: '/assets/img/materials/Imeca/Natu Expresso.jpg' },
      { label: 'Melamine Queens Rustic Finish', image: '/assets/img/materials/Imeca/Queens Rustic.jpg' },
      { label: 'Birch Plywood, Plain Sliced Veneer', image: '/assets/img/materials/Imeca/Birch Plywood.png' }
    ],
    '4': [
      { label: 'Antracita Solid Wood', image: '/assets/img/materials/Lioher/atracita-solid-wood.jpg' },
      { label: 'Supermatt Antracita', image: '/assets/img/materials/Lioher/ZMD-antracita-con-efecto.jpg' },
      { label: 'Supermatt Azul índigo', image: '/assets/img/materials/Lioher/azul-indigo-square.png' },
      { label: 'SuperMatt Azul Marino', image: '/assets/img/materials/Lioher/ZSM-AZUL-marino.jpg' },
      { label: 'SuperMatt Blanco Polar', image: '/assets/img/materials/Lioher/BLANCO-POLAR-SM.jpg' },
      { label: 'Supermatt Verde Salvia', image: '/assets/img/materials/Lioher/VERDE-SALVIA-sq-2048x2048.png' },
      { label: 'Rojo', image: '/assets/img/materials/Lioher/LSC-rojo.jpg' }
    ]
  };

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  ngOnInit(): void {
    this.loadState();
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.elRef.nativeElement.contains(e.target)) {
        this.dropdownOpen = false;
      }
    });
  }

  onFirstDropdownChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.secondDropdownOptions = this.optionsMapping[selectedValue] || [];
    this.selectedFirstDropdown = selectedValue;
    if (this.selectedFirstDropdown && this.secondDropdownOptions.length > 0) {
      this.firstDropdownComplete.emit(this.selectedFirstDropdown);
      this.saveState();
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: any) {
    this.selectedSecondDropdown = option;
    this.dropdownOpen = false;
    this.secondDropdownComplete.emit(option.label);
    this.saveState();
  }

  saveState() {
    const state = {
      selectedFirstDropdown: this.selectedFirstDropdown,
      selectedSecondDropdown: this.selectedSecondDropdown,
      secondDropdownOptions: this.secondDropdownOptions
    };
    localStorage.setItem('dynamicDropdownState', JSON.stringify(state));
  }

  loadState() {
    const state = localStorage.getItem('dynamicDropdownState');
    if (state) {
      const savedState = JSON.parse(state);
      this.selectedFirstDropdown = savedState.selectedFirstDropdown;
      this.selectedSecondDropdown = savedState.selectedSecondDropdown;
      this.secondDropdownOptions = savedState.secondDropdownOptions;

      // Emit the loaded values if they exist
      if (this.selectedFirstDropdown) {
        this.firstDropdownComplete.emit(this.selectedFirstDropdown);
      }
      if (this.selectedSecondDropdown) {
        this.secondDropdownComplete.emit(this.selectedSecondDropdown.label);
      }
    }
  }

}
