import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class DropdownSelectComponent {
  @Input() set items(value: Array<{ value: any, label: string }> | null) {
    this._items = value ?? [];
    this._items.forEach(item => this.labelCache.set(item.value, item.label));
  }
  get items(): Array<{ value: any, label: string }> {
    return this._items;
  }
  @Input() placeholder: string = 'Choose options';
  @Input() searchable: boolean = false;
  @Input() remoteSearch: boolean = false;
  @Input() clearLabel: string | null = null;
  @Output() searchChange = new EventEmitter<string>();

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  isOpen = false;
  disabled = false;
  selectedValue: any = null;
  searchTerm = '';
  private _items: Array<{ value: any, label: string }> = [];
  private labelCache = new Map<any, string>();

  get selectedLabel(): string {
    if (this.selectedValue === null || this.selectedValue === undefined) return '';
    return this.labelCache.get(this.selectedValue) ?? '';
  }

  get visibleItems(): Array<{ value: any, label: string }> {
    const term = this.searchTerm.trim().toLowerCase();
    if (!this.searchable || this.remoteSearch || !term) return this.items;
    return this.items.filter(item => item.label.toLowerCase().includes(term));
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) this.isOpen = false;
  }

  toggleDropdown(event: Event) {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.searchable) {
      if (this.searchTerm) this.onSearch('');
      setTimeout(() => this.searchInput?.nativeElement.focus());
    }
  }

  onSearch(term: string) {
    this.searchTerm = term;
    if (this.remoteSearch) this.searchChange.emit(term);
  }

  selectItem(item: { value: any, label: string }) {
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
