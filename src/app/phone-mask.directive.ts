import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {
  constructor(public ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any): void {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      value = value.replace(/^(\d*)/, '($1');
    }

    this.ngControl.control?.setValue(value);
  }
}
