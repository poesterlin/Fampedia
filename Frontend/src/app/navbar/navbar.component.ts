import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Member } from '../core/Interfaces/IUser';
import { CoreService } from '../core/core.service';

@Component({
    selector: 'fampedia-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    @ViewChild('queryInput') inputEl?: ElementRef;

    public image = 'https://randomuser.me/api/portraits/men/10.jpg';

    public query = "";
    public people: Member[] = [];
    public input = false;
    private peps: Member[] = [];

    constructor(private login: LoginService, private core: CoreService) {
        this.login.user$.subscribe((user) => {
            if (user && user.familyMembers) {
                this.peps = user.familyMembers;
            }
        })
    }

    ngOnInit() { }

    logout() {
        this.login.logout();
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

    select(memb: Member) {
        this.core.filterFor(memb);
        this.query = memb.name;
        this.input = false;
    }

    clear() {
        this.input = false;
        this.query = '';
        this.core.getMoments().subscribe();
    }
}
