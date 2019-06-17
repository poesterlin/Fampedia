export interface INews {
    type: 'Comment' | 'Image';
    userID: string;
    userName: string;
    data: {
      imageID?: string;
      comment?: string;
    },
    date: string;
}
