export interface IUser {
  familyMembers?: Member[];
  expireDate: Date;
  token: string;
  username: string;
  familyID: string;
}

export interface Member {
  name: string;
  id: string;
}