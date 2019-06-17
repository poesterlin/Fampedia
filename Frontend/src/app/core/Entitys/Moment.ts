import { IMoment } from '../Interfaces/IMoment';

export class Moment {

    constructor(private json: IMoment) {
    }

    public get images() {
        return this.json.images;
    }

    public set images(val: string[]) {
        this.json.images = val;
    }

    public get title() {
        return this.json.momenttitle;
    }

    public set title(val: string) {
        this.json.momenttitle = val;
    }

    public get description() {
        return this.json.momentdescription;
    }

    public set description(val: string) {
        this.json.momentdescription = val;
    }

    public get date() {
        return this.json.date;
    }

    public get momentId() {
        return this.json.momentID;
    }
}