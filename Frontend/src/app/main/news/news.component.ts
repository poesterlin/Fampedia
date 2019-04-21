import { Component, OnInit } from '@angular/core';


interface NewsItem {
  type: 'Comment' | 'Image';
  user: {
    img: string;
    name: string;
  }
  data: {
    img?: string;
    desc?: string;
  },
  date: string;
}

@Component({
  selector: 'fampedia-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  public news: NewsItem[] = [];
  constructor() {
  }

  ngOnInit() {
    const user = { img: 'https://randomuser.me/api/portraits/women/10.jpg', name: 'Anne Wurst' };
    this.news.push({ type: "Comment", user, data: { desc: 'What a nice day!' }, date: 'two weeks ago' });
    this.news.push({ type: "Image", user, data: { img: 'https://source.unsplash.com/200x200/?water,' + Math.random() }, date: 'one week ago' });
    this.news.push({ type: "Image", user, data: { img: 'https://source.unsplash.com/200x200/?water,' + Math.random() }, date: 'one week ago' });
    this.news.push({ type: "Comment", user, data: { desc: 'What a nice day!' }, date: 'one week ago' });
    this.news.push({ type: "Image", user, data: { img: 'https://source.unsplash.com/200x200/?water,' + Math.random() }, date: 'two days ago' });
    this.news.push({ type: "Comment", user, data: { desc: 'What a nice day!' }, date: 'two days ago' });

    this.news = this.news.reverse();
  }

}
