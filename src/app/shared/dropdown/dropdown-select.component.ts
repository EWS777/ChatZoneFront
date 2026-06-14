import {Component, ElementRef, forwardRef, HostListener, Input, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-dropdown-select',
  imports: [],
  templateUrl: './dropdown-select.component.html',
  styleUrl: './dropdown-select.component.css',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownSelectComponent),
      multi: true
    }
  ]
})
export class DropdownSelectComponent{
  @Input() items: Array<{ value: any, label: string }> = [];
  @Input() placeholder: string = 'Choose options';

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  isOpen = false;
  selectedValue: any = null;

  get selectedLabel(): string {
    const found = this.items.find(item => item.value === this.selectedValue);
    return found ? found.label : '';
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDropdown(event: Event) {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: any) {
    this.selectedValue = item.value;
    this.onChange(item.value);
    this.onTouched();
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.dropdownContainer) return;

    const target = event.target as HTMLElement;
    if (!this.dropdownContainer.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }
}
