import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'fampedia-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    @Output() buttonEvent = new EventEmitter<string>();
    public image = 'https://randomuser.me/api/portraits/men/10.jpg';

    // constructor(private _router: Router, private _translate: TranslateService) {
    // }

    ngOnInit() { }

    public clickAction() {
        // if (option.internalRoute) {
        //     this.router.navigate([option.internalRoute]);
        //     return;
        // }
    }
}
