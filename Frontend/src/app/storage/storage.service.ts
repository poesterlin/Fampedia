import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public static readonly version = {
        key: 'storageService.version',
        value: 1.0
    };

    public constructor() {
        const version = this.getSettingAsNumber(StorageService.version.key);
        if (version === undefined) {
            // no versioning -> clears all stored keys
            localStorage.clear();
            this.setSetting(StorageService.version.key, StorageService.version.value);
            return;
        }
        if (version !== StorageService.version.value) {
            throw new Error('converter is missing');
        }
    }

    public getSettingAsBoolean(key: string): boolean | undefined;
    public getSettingAsBoolean(key: string, defaultValue: boolean): boolean;
    public getSettingAsBoolean(key: string, defaultValue?: boolean): boolean | undefined {
        const value = localStorage.getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return value === 'true';
    }
    public getSettingAsNumber(key: string): number | undefined;
    public getSettingAsNumber(key: string, defaultValue: number): number;
    public getSettingAsNumber(key: string, defaultValue?: number): number | undefined {
        const value = localStorage.getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return Number(value);
    }
    public getSettingAsString(key: string): string | undefined;
    public getSettingAsString(key: string, defaultValue: string): string;
    public getSettingAsString(key: string, defaultValue?: string): string | undefined {
        const value = localStorage.getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return value;
    }
    public getSettingAsObject<T extends object>(key: string): T | undefined;
    public getSettingAsObject<T extends object>(key: string, defaultValue: T): T;
    public getSettingAsObject<T extends object>(key: string, defaultValue?: T): T | undefined {
        const value = localStorage.getItem(key);
        let retVal: T | null = null;
        try {
            retVal = JSON.parse(value!);
        } catch { }

        if (retVal === null) {
            return defaultValue;
        }
        return retVal;
    }

    public getSetting(key: string, defaultValue: boolean): boolean;
    public getSetting(key: string, defaultValue: number): number;
    public getSetting(key: string, defaultValue: string): string;
    public getSetting<T extends object>(key: string, defaultValue: T): T;
    public getSetting<T>(key: string, defaultValue: T): T;
    public getSetting(key: string, defaultValue: boolean | number | string | object): boolean | number | string | object {
        switch (typeof defaultValue) {
            case 'boolean':
                return this.getSettingAsBoolean(key, defaultValue as boolean);
            case 'number':
                return this.getSettingAsNumber(key, defaultValue as number);
            case 'string':
                return this.getSettingAsString(key, defaultValue as string);
            case 'object':
                return this.getSettingAsObject(key, defaultValue as object);
            default:
                throw new Error(`unsupported type`);
        }
    }

    public setSetting(key: string, value: boolean | number | string): void;
    public setSetting<T extends object>(key: string, defaultValue: T): void;
    public setSetting(key: string, value: boolean | number | string | object): void {
        switch (typeof value) {
            case 'boolean':
            case 'number':
            case 'string':
                localStorage.setItem(key, value.toString());
                break;
            case 'object':
                localStorage.setItem(key, JSON.stringify(value));
                break;
            default:
                throw new Error(`unsupported type`);
        }
    }

    public removeSetting(key: string): void {
        localStorage.removeItem(key);
    }
}
