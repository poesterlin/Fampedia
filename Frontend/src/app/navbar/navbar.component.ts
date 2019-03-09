import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

type helperKeys = 'settings' | 'account' | 'translate' | 'help';
interface HeaderButton {
    key: string;
    tip?: string;
    icon?: string;
    onClick: OnClickOptions;
}

interface OnClickOptions {
    internalRoute?: string;
    externalRoute?: string;
    emit?: string;
}
export interface HeaderMode {
    color?: string;
    sticky?: boolean;
    buttons: HeaderButton[];
    helpers: { key: helperKeys }[];
}

@Component({
    selector: 'fampedia-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    @Output() buttonEvent = new EventEmitter<string>();
    @Input() config: HeaderMode = {
        color: 'accent',
        buttons: [],
        helpers: [
            { key: 'translate' },
        ]
    };

    public readonly cognitiveCreatorUrl: string = '/gui.html';
    public readonly androidInstallationUrl: string = '/android.html';
    public showNavbar = true;
    public language: string;
    public hideAccount: boolean = true;
    public isLicensed = true;

    public constructor(private router: Router, private translate: TranslateService) {
        this.language = this.translate.currentLang;
    }

    ngOnInit() { }

    public goToExternalPage(url: string) {
        window.location.href = url;
    }

    public changeLanguage(value: string) {
        this.translate.use(value);
        this.language = value;
    }

    public clickAction(option: OnClickOptions) {
        if (option.emit) {
            this.buttonEvent.emit(option.emit);
            return;
        }
        if (option.internalRoute) {
            this.router.navigate([option.internalRoute]);
            return;
        }
        if (option.externalRoute) {
            this.goToExternalPage(option.externalRoute);
            return;
        }
    }

    get mode() {
        return this.config;
    }
}
