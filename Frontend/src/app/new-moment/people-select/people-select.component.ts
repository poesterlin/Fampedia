import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'fampedia-people-select',
  templateUrl: './people-select.component.html',
  styleUrls: ['./people-select.component.scss']
})
export class PeopleSelectComponent {
  @Output() output = new EventEmitter<string[]>();
  @ViewChild('queryInput') inputEl?: ElementRef;

  public query = "";
  public people: { name: string, id: number }[] = [];
  public input = false;
  private peps = ["Inga Innes", "Cathrine Chism", "Johnnie Jone", "Margarite Mcdavis", "Beryl Bame", "Dahlia Down",
    "Valentina Vandiver", "Su Said", "Darci Desimone", "Meggan Mcpartland"].map((n, id) => ({ name: n, id }));

  constructor() { }

  select(pep: { name: string, id: number }) {
    if (!this.people.includes(pep)) {
      this.people.push(pep);
    }
    this.output.emit(this.people.map(pep => pep.name));
    this.input = false;
    this.query = "";
  }

  remove(pep: { name: string, id: number }) {
    const ind = this.people.findIndex(p => p === pep);
    if (ind > -1) {
      this.people.splice(ind, 1);
    }
    this.output.emit(this.people.map(pep => pep.name));
  }

  search(): { name: string, id: number }[] | undefined {
    let fitQuery: { name: string, id: number }[];
    if (this.query) {
      fitQuery = this.peps
        .filter(pep =>
          pep.name.toLowerCase()
            .split(' ')
            .some(s => s.startsWith(this.query.toLowerCase())))
    } else {
      fitQuery = this.peps;
    }
    return fitQuery.filter(p => !this.people.includes(p));;
  }

  public inputMode() {
    this.input = true;
    if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
      return;
    }
    if (!this.inputEl) {
      setTimeout(() => this.inputMode(), 10);
    } else {
      (this.inputEl.nativeElement as HTMLInputElement).focus();
    }
  }

}
