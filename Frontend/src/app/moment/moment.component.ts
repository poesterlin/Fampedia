import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'fampedia-event',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.scss']
})
export class MomentComponent implements OnInit {
  public id: string = '';
  public importances: number[] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
    });

    this.importances = new Array(20)
      .fill(null)
      .map(() => Math.ceil(Math.random() * 3));
    this.importances.unshift(...[1, 1, 3, 1, 1, 1, 1, 2, 2, 1, 1]);
  }

  update(){
    const t = document.querySelector('#header')!;
    const image = document.querySelector('#image')! as any;
    const top = t.getClientRects()[0].top;
    image.style.height = 250 + top + "px";
    image.style.marginTop = -top + "px";
  }

  fullscreen(){
    this.router.navigate(['/moment/image/5']);
  }

}