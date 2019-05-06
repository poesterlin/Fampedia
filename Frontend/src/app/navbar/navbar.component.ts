import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
    selector: 'fampedia-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    @Output() buttonEvent = new EventEmitter<string>();
    public image = 'https://randomuser.me/api/portraits/men/10.jpg';

    constructor(private login: LoginService) {
    }

    ngOnInit() { }


    logout() {
        this.login.logout();
    }
}
