import { Component, OnInit } from '@angular/core';
import { NewMomentService } from '../new-moment.service';

@Component({
  selector: 'fampedia-new-moment-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {

  constructor(public service: NewMomentService) { }

  ngOnInit() {
  }

}
