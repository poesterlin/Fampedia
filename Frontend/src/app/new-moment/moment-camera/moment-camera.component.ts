import { Component, ViewChild, AfterViewInit, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fampedia-moment-camera',
  templateUrl: './moment-camera.component.html',
  styleUrls: ['./moment-camera.component.scss']
})
export class MomentCameraComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video') private video?: ElementRef;
  @ViewChild('pic') private pic!: ElementRef;
  @ViewChild('canvas') private canvas?: ElementRef;
  @Output() output = new EventEmitter<string[]>();

  public mode: 'capture' | 'display' = 'capture';
  public width = 480;
  public height = 640;
  public allowed = true;
  private streaming = false;
  private stream?: MediaStream;
  private images: string[] = [];

  constructor() { }

  ngOnDestroy(): void {
    if (this.video && this.video.nativeElement) {
      const vid = this.video.nativeElement as HTMLVideoElement;
      vid.pause();
      vid.srcObject = null;
      if (this.stream) {
        for (const track of this.stream.getTracks()) {
          this.stream.removeTrack(track);
        }
      }
    }
  }

  ngAfterViewInit() {
    this.clearPhoto();
    this.initStream();
  }

  public initCanvas() {
    if (!this.video) { return; }
    if (!this.streaming) {
      this.streaming = true;
    }
  }

  public initStream() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }).then(stream => {
      if (!this.video) { return; }
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.play();
      this.stream = stream;

      const { width, height } = this.stream.getTracks()[0].getSettings();
      if (width && height) {
        this.width = width;
        this.height = height;
      }
    }).catch(() => this.allowed = false);
  }

  public takePicture() {
    if (!this.video) { return; }
    if (!this.canvas) { return; }
    if (!this.stream) { return; }

    const context = this.canvas.nativeElement.getContext('2d');
    if (this.width && this.height && context) {
      context.drawImage(this.video.nativeElement, 0, 0, this.width, this.height);

      const data = this.canvas.nativeElement.toDataURL('image/png');
      this.pic.nativeElement.setAttribute('src', data);
      this.mode = "display";
      this.streaming = false;
    } else {
      this.clearPhoto();
    }
  }

  public clearPhoto() {
    if (!this.canvas) { return; }
    if (!this.pic) { return; }
    this.streaming = false;
    this.initCanvas();
    const context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    if (context) {
      context.clearRect(0, 0, this.width, this.height);
    }
    this.mode = "capture";
    this.initCanvas();
    this.initStream();

  }

  public returnImages() {
    this.addImage();
    this.output.emit(this.images);
  }

  public addImage() {
    if (!this.canvas) { return; }

    const data: string = this.canvas.nativeElement.toDataURL('image/png');
    this.images.push(data);
    this.clearPhoto();
  }
}
