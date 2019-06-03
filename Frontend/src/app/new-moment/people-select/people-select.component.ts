import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { Member } from 'src/app/core/Interfaces/IUser';
import { NewMomentService } from '../new-moment.service';


@Component({
  selector: 'fampedia-people-select',
  templateUrl: './people-select.component.html',
  styleUrls: ['./people-select.component.scss']
})
export class PeopleSelectComponent {
  @ViewChild('queryInput') inputEl?: ElementRef;

  public query = "";
  public people: Member[] = [];
  public input = false;
  private peps: Member[] = [];

  constructor(private userService: LoginService, private service: NewMomentService) {
    this.userService.user$.subscribe((user) => {
      if (user && user.familyMembers) {
        this.peps = user.familyMembers;
      }
    })
  }

  select(pep: Member) {
    if (!this.people.includes(pep)) {
      this.people.push(pep);
    }
    this.input = false;
    this.query = "";
    this.service.moment.tags = this.people.map(user => user.id);
  }

  remove(pep: Member) {
    const ind = this.people.findIndex(p => p === pep);
    if (ind > -1) {
      this.people.splice(ind, 1);
    }
    this.service.moment.tags = this.people.map(user => user.id);
  }

  search(): Member[] | undefined {
    let fitQuery: Member[];
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
