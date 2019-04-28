import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { StorageService } from './storage/storage.service';
import { Router, RouterState, ActivatedRoute, Scroll } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';

@Component({
    selector: 'fampedia-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private translate: TranslateService, private router: Router, private titleService: Title,
        storage: StorageService, viewportScroller: ViewportScroller) {
        console.log('%cfampedia', 'font-size:40px');

        this.updateTitle();

        // this language will be used as a fallback when a translation isn't found in the current language
        translate.addLangs(['de', 'en', 'pt']);

        // load language from the storage service
        translate.use(storage.getSetting('language', 'en'));

        translate.onLangChange.subscribe((changeLang: LangChangeEvent) => {
            storage.setSetting('language', changeLang.lang);
            this.updateTitle();
        });

        translate.missingTranslationHandler = {
            handle: (context) => {
                console.error('missing translation key: ' + context.key);
                const dotPosition = context.key.indexOf('.');
                if (dotPosition > -1 && dotPosition + 1 < context.key.length) {
                    return context.key.slice(dotPosition + 1);
                }
                return context.key;
            }
        };

        router.events.subscribe(() => {
            this.updateTitle();
        });

        router.events
            .pipe(filter((e) => e instanceof Scroll))
            .subscribe((e: any) => {
                const resetRoutes = /(moment\/(image\/\d+|\d+)|new)/
                // should match:
                //   /moment/5
                //   /new
                //   /moment/image/5
                
                if (resetRoutes.test(e.routerEvent.url)) {
                    viewportScroller.scrollToPosition([0, 0]);
                } else {
                    viewportScroller.scrollToPosition(e.position || [0, 0]);
                }
            });
    }

    private async updateTitle() {
        const title = await this.translate.get(
            'titles.' + this.getFirstModule(this.router.routerState, this.router.routerState.root)
        ).toPromise();
        this.titleService.setTitle('fampedia | ' + title);
    }

    private getFirstModule(state: RouterState, parent: ActivatedRoute | null): string | undefined {
        if (parent) {
            if (parent.snapshot && parent.snapshot.data && parent.snapshot.data.title) {
                return parent.snapshot.data.title;
            } else {
                return this.getFirstModule(state, parent.firstChild);
            }
        }
        return;
    }
}
