export interface IMoment {
    title: string;
    description: string;
    momentID: number;
    images: IMomentImage[];
}

export interface IMomentImage{
    description: string;
    imageID: string;
}