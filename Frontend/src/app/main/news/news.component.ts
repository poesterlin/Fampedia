import { Component, OnInit } from '@angular/core';
import { INews } from 'src/app/core/Interfaces/IEvent';
import { MainService } from '../main.service';
import { Router } from '@angular/router';


@Component({
  selector: 'fampedia-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  public news: INews[] = [];
  constructor(private service: MainService, private router: Router) {
    this.service.news$.subscribe(news => this.news = news);
  }

  ngOnInit() {

  }

  public goToMoment(imageId: string) {
    const moments = this.service.moments$.getValue();
    const moment = moments.find(m => m.images.includes(imageId));
    if (moment) {
      this.router.navigate(['/moment/', moment.momentId]);
    }
  }
}
