 
 import { CommonModule, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-image-zoom',
  imports: [CommonModule, NgIf],
  templateUrl: './image-zoom.html',
  styleUrl: './image-zoom.scss',
})
export class ImageZoom implements AfterViewInit, OnInit, OnDestroy {
  @Input() thumbImage!: string;
  @Input() fullImage!: string;
  @Input() magnification: number = 1.5;
  @Input() enableScrollZoom: boolean = true;
  @Input() lensWidth: number = 200;
  @Input() lensHeight: number = 200;
  @Input() enableLens: boolean = true;

  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('zoomLens') zoomLens!: ElementRef<HTMLDivElement>;
  @ViewChild('zoomResult') zoomResult!: ElementRef<HTMLDivElement>;

  isZoomActive = false;
  lensVisible = false;
  scrollZoomLevel = 1;
  private destroy$ = new Subject<void>();
 
  ngOnInit(): void {
    console.log('ImageZoom component initialized');
    
  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      if (this.enableLens && this.imageContainer) {
        this.setupZoom();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupZoom(): void {
    if (!this.enableLens || !this.imageContainer) return;

    const container = this.imageContainer.nativeElement;
    const lens = this.zoomLens.nativeElement;
    const result = this.zoomResult.nativeElement;
 
    if (!lens || !result) return;
 
    const cx = result.offsetWidth / lens.offsetWidth;
    const cy = result.offsetHeight / lens.offsetHeight;

    result.style.backgroundSize = `${container.offsetWidth * cx}px ${container.offsetHeight * cy}px`;
 
    container.addEventListener('mousemove', this.moveLens.bind(this));
    lens.addEventListener('mousemove', this.moveLens.bind(this));
    
    container.addEventListener('mouseenter', () => {
      this.lensVisible = true;
      result.style.display = 'block';
    });
    
    container.addEventListener('mouseleave', () => {
      this.lensVisible = false;
      result.style.display = 'none';
    });
  }

  private moveLens(e: MouseEvent): void {
    e.preventDefault();

    if (!this.imageContainer || !this.zoomLens || !this.zoomResult) return;

    const container = this.imageContainer.nativeElement;
    const lens = this.zoomLens.nativeElement;
    const result = this.zoomResult.nativeElement;

    const pos = this.getCursorPos(e);
    let x = pos.x - (lens.offsetWidth / 2);
    let y = pos.y - (lens.offsetHeight / 2);

    // Prevent lens from being positioned outside the image
    if (x > container.offsetWidth - lens.offsetWidth) x = container.offsetWidth - lens.offsetWidth;
    if (x < 0) x = 0;
    if (y > container.offsetHeight - lens.offsetHeight) y = container.offsetHeight - lens.offsetHeight;
    if (y < 0) y = 0;
 
    lens.style.left = x + 'px';
    lens.style.top = y + 'px';
 
    result.style.backgroundPosition = `-${x * this.magnification}px -${y * this.magnification}px`;
  }

  private getCursorPos(e: MouseEvent): { x: number; y: number } {
    const container = this.imageContainer.nativeElement;
    const a = container.getBoundingClientRect();
    let x = e.pageX - a.left;
    let y = e.pageY - a.top;
 
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;

    return { x, y };
  }

  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent): void {
    if (!this.enableScrollZoom || !this.isZoomActive) return;

    event.preventDefault();
    
    if (event.deltaY < 0) {
     
      this.scrollZoomLevel = Math.min(this.scrollZoomLevel + 0.1, 3);
    } else {
    
      this.scrollZoomLevel = Math.max(this.scrollZoomLevel - 0.1, 1);
    }

    this.updateZoomLevel();
  }

  private updateZoomLevel(): void {
    const container = this.imageContainer.nativeElement;
    const img = container.querySelector('img') as HTMLImageElement;
    
    if (img) {
      img.style.transform = `scale(${this.scrollZoomLevel})`;
      img.style.transformOrigin = 'center center';
    }
  }

  toggleZoom(): void {
    this.isZoomActive = !this.isZoomActive;
    this.scrollZoomLevel = 1;
    this.updateZoomLevel();
  }

  zoomIn(): void {
    this.scrollZoomLevel = Math.min(this.scrollZoomLevel + 0.25, 3);
    this.updateZoomLevel();
  }

  zoomOut(): void {
    this.scrollZoomLevel = Math.max(this.scrollZoomLevel - 0.25, 1);
    this.updateZoomLevel();
  }

  resetZoom(): void {
    this.scrollZoomLevel = 1;
    this.updateZoomLevel();
  }
}