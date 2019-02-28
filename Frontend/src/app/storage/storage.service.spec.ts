import { TestBed, inject } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StorageService]
        });
    });

    it('should be created', inject([StorageService], (service: StorageService) => {
        expect(service).toBeTruthy();
    }));

    it(`I'm starving... more tests, please \u{1F635}`, inject([StorageService], (_service: StorageService) => {
        expect(false).toBeTruthy();
    }));
});
