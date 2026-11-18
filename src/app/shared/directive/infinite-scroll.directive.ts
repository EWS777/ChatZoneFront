import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
  host: {
    style: 'display: block; min-height: 4px;'
  }
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Output() scrolled = new EventEmitter<void>();
  @Input() set busy(value: boolean) {
    if (this.wasBusy && !value && this.observer) {
      this.observer.unobserve(this.el.nativeElement);
      this.observer.observe(this.el.nativeElement);
    }
    this.wasBusy = value;
  }

  private wasBusy = false;

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.scrolled.emit();
        }
      },
      {
        root: this.findScrollParent(this.el.nativeElement),
        rootMargin: '150px 0px',
        threshold: 0
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private findScrollParent(node: HTMLElement): HTMLElement | null {
    let el = node.parentElement;
    while (el) {
      const { overflowY } = getComputedStyle(el);
      if (overflowY === 'auto' || overflowY === 'scroll') {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }
}
