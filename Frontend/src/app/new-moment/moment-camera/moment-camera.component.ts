import { Component, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'fampedia-moment-camera',
  templateUrl: './moment-camera.component.html',
  styleUrls: ['./moment-camera.component.scss']
})
export class MomentCameraComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video') private video?: ElementRef;
  @ViewChild('pic') private pic!: ElementRef;
  @ViewChild('canvas') private canvas?: ElementRef;

  public mode: 'capture' | 'display' = 'capture';
  public width = 480;
  public height = 640;
  public allowed = true;
  private streaming = false;
  private stream?: MediaStream;

  constructor() { }

  ngOnDestroy(): void {
    if (this.video && this.video.nativeElement) {
      const vid = this.video.nativeElement as HTMLVideoElement;
      vid.pause();
      vid.srcObject = null;
      if(this.stream){
        for (const track of this.stream.getTracks()) {
          this.stream.removeTrack(track);
        }
      }
    }
  }

  ngAfterViewInit() {
    this.clearphoto();
    this.initStream();
  }

  public initCanvas() {
    if (!this.video) { return; }
    if (!this.streaming) {
      this.height = this.video.nativeElement.videoHeight / (this.video.nativeElement.videoWidth / this.width);

      if (isNaN(this.height)) {
        this.height = this.width / (4 / 3);
      }

      this.streaming = true;
    }
  }

  public initStream() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }).then(stream => {
      if (!this.video) { return; }
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.play();
      this.stream = stream;
    }).catch(() => this.allowed = false);
  }

  public takePicture() {
    if (!this.video) { return; }
    if (!this.canvas) { return; }

    const context = this.canvas.nativeElement.getContext('2d');
    if (this.width && this.height && context) {
      this.canvas.nativeElement.width = this.width;
      this.canvas.nativeElement.height = this.height;
      context.drawImage(this.video.nativeElement, 0, 0, this.width, this.height);

      const data = this.canvas.nativeElement.toDataURL('image/png');
      this.pic.nativeElement.setAttribute('src', data);
      this.mode = "display";
    } else {
      this.clearphoto();
    }
  }

  public clearphoto() {
    if (!this.canvas) { return; }
    if (!this.pic) { return; }

    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) { return; }
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    const data = this.canvas.nativeElement.toDataURL('image/png');
    this.pic.nativeElement.setAttribute('src', data);
    this.mode = "capture";
    this.initStream();
  }

}
