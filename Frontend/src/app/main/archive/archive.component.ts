import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../error/shared/error.service';
import { LoginService } from '../../login/login.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fampedia-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  constructor(private error: ErrorService, private loginService: LoginService) { }

  ngOnInit() {
  }


  public notImplemented() {
    this.error.showMessage('not implemented yet');
  }


  public get qrcodeUrl() {
    return `${environment.url}/QRCode?token=${this.loginService.user$.getValue()!.token}`
  }
}
