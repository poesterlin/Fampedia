import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fampedia-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public importances: number[] = []
  constructor() {
    this.importances = new Array(20).fill(null).map(() => Math.ceil(Math.random() * 3));
  }

  ngOnInit() {
  }

}
