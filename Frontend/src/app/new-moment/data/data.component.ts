import { Component, OnInit } from '@angular/core';
import { NewMomentService } from '../new-moment.service';

@Component({
  selector: 'fampedia-new-moment-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  public dateError = false;
  public dateVal: string = '';

  constructor(public service: NewMomentService) { }

  ngOnInit() {
    this.getDate();
    this.service.showButton.next(true);
  }
  
  public setDate(input: string) {
    const dateRegex = /(?<day>[0-3]{0,1}[1-9])\s*\/*\s*(?<month>[0-1]{0,1}[1-9])\s*\/*\s*((?<year>[0-9]{4})|(?<shortYear>[0-9]{2}))/;
    if (!dateRegex.test(input)) {
      this.dateError = true;
      return;
    }
    this.dateError = false;
    const { groups: { day, month, year, shortYear } } = dateRegex.exec(input) as any;
    let y: string = year;
    if (shortYear && !year) {
      y = shortYear <= new Date().getFullYear() - 2000 ? '20' + shortYear : '19' + shortYear;
    }
    const date = new Date();
    date.setFullYear(parseInt(y), month - 1, day);
    this.service.moment.date = date;
    this.getDate();
  }

  private stringifyDate(d: Date) {
    return `${this.two(d.getDate())} / ${this.two(d.getMonth() + 1)} / ${d.getFullYear()}`
  }

  private two(n: number) {
    return n < 10 ? "0" + n : n;
  }

  public getDate() {
    this.dateVal = this.stringifyDate(this.service.moment.date || new Date());
  }

}
