import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fampedia-event',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.scss']
})
export class MomentComponent implements OnInit {
  public id: string = '';
  public importances: number[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
    });

    this.importances = new Array(20)
      .fill(null)
      .map(() => Math.ceil(Math.random() * 3));
    this.importances.unshift(...[1, 1, 3, 1, 1, 1, 1, 2, 2, 1, 1]);
  }

}
