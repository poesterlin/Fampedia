import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import QrScanner from 'qr-scanner';

@Component({
  selector: 'fampedia-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements AfterViewInit {
  @ViewChild('video') private video!: ElementRef;
  @Output() familyId = new EventEmitter();
  private qrScanner?: QrScanner;

  constructor() { }

  ngAfterViewInit() {
    QrScanner.WORKER_PATH = './qr-scanner-worker.min.js';
    this.qrScanner = new QrScanner(this.video.nativeElement, (result: string) => {
      this.foundCode(result);
    });
    this.qrScanner.start();
  }

  private foundCode(result: string) {
    this.familyId.next(result.slice(38));
    navigator.vibrate(300);
  }

  ngOnDestroy(): void {
    if (this.qrScanner) {
      this.qrScanner.destroy();
    }
  }

}
