import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/error/shared/error.service';

@Component({
  selector: 'fampedia-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  constructor(private error: ErrorService) { }

  ngOnInit() {
  }


  public notImplemented() {
    this.error.showMessage('not implemented yet');
  }
}
