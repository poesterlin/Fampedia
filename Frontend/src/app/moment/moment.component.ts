import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Moment } from '../core/Entitys/Moment';
import { MomentService } from './moment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fampedia-event',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.scss']
})
export class MomentComponent implements OnInit {
  public id: number = 0;
  public moment?: Moment;

  constructor(private route: ActivatedRoute, private service: MomentService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = parseInt(params.id);
      this.service.moments$.subscribe(() => {
        this.moment = this.service.getMoment(this.id);
      });
    });
  }

  update() {
    const t = document.querySelector('#header')!;
    const image = document.querySelector('#image')! as any;
    const top = t.getClientRects()[0].top;
    image.style.height = 250 + top + "px";
    image.style.marginTop = -top + "px";
  }

  get imageUrl() {
    if (this.moment) {
      return `url("${environment.url}/momentimage/getImage/640/${this.moment.images[0]}")`
    }
    return '';
  }
}
