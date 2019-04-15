import { IMoment, IMomentImage } from '../Interfaces/IMoment';

export class Moment implements IMoment {
    public dirtyFlag = false;
    public title = "test Moment";
    public description = "test descriptiontest descriptiontest descriptiontest description";
    public momentID = 1;
    public oldImages: IMomentImage[] = [];


    constructor(private json: IMoment) { 
        // TODO: remove
        this.images = [];
        this.images = [{imageID: "", description: "image description"}]
        this.oldImages = this.images;
        setInterval(()=>this.compare(this.oldImages, this.images), 1000);
    }


    // TODO: implement more property getter/setter with change detection


    public get images() {
        return this.json.images;
    }

    public set images(val: IMomentImage[]) {
        this.compare(this.json.images, val);
        this.json.images = val;
    }

    private compare(oldVal: any, newVal: any) {
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
            this.dirtyFlag = true;
        }
    }
}