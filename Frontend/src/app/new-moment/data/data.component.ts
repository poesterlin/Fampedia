import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fampedia-new-moment-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  public today = `${this.two(new Date().getDate())} / ${this.two(new Date().getMonth())} / ${new Date().getFullYear()}`;

  constructor() { }

  ngOnInit() {
  }

  private two(n: number) {
    return n < 10 ? "0" + n : n;
  }

}
