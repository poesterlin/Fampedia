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
  public cameraSelect = false;
  public frontCam = false;
  private stream?: MediaStream;
  private images: string[] = [];
  private torch = false;

  constructor() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => this.cameraSelect = devices.filter(dev => dev.kind === 'videoinput').length > 1);
  }

  ngOnDestroy() {
    if (this.video && this.video.nativeElement) {
      const vid = this.video.nativeElement as HTMLVideoElement;
      vid.pause();
      vid.srcObject = null;
      if (this.stream) {
        const track = this.stream.getTracks()[0];
        this.stream.removeTrack(track);
        if (track.stop) {
          track.stop();
        }
        // this.stream = undefined;
      }
    }
  }

  ngAfterViewInit() {
    this.clearPhoto();
  }

  public initStream() {
    navigator.mediaDevices.getUserMedia({ video: this.frontCam ? true : { facingMode: 'environment' }, audio: false }).then(stream => {
      if (!this.video || (this.stream && this.stream.active)) { return; }
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

    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) { return; }

    context.drawImage(this.video.nativeElement, 0, 0, this.width, this.height);

    const data = this.canvas.nativeElement.toDataURL('image/png');
    this.pic.nativeElement.setAttribute('src', data);
    this.mode = "display";
  }

  public clearPhoto() {
    if (!this.canvas) { return; }
    const context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    if (!context) { return; }
    context.clearRect(0, 0, this.width, this.height);
    this.mode = "capture";
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

  public flipCamera() {
    this.frontCam = !this.frontCam;
    this.ngOnDestroy();
    this.ngAfterViewInit();
  }

  public flash() {
    if (this.stream) {
      this.torch = !this.torch;
      this.stream.getTracks()[0].applyConstraints({
        advanced: [{ torch: this.torch } as any]
      })
        .catch(e => console.log(e));
    }
  }
  // track.applyConstraints({
  //   advanced: [{zoom: capabilities.zoom.max}]
  // })
}
