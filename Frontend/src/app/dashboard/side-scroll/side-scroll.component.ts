import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fampedia-side-scroll',
  templateUrl: './side-scroll.component.html',
  styleUrls: ['./side-scroll.component.scss']
})
export class SideScrollComponent implements OnInit {
  public rand = Math.random();
  constructor() { }

  ngOnInit() {
  }

}
