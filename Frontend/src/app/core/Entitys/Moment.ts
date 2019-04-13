import { IMoment, IMomentImage } from '../Interfaces/IMoment';

export class Moment implements IMoment {
    constructor(private json: IMoment) {

    }

    public update(){
        
    }

    get images() {
        return this.json.images;
    }

    set images(val: IMomentImage[]){
        this.json.images = val;
    }
}