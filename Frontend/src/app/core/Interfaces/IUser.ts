export interface IUser {
  familyMembers?: Member[];
  expireDate: Date;
  token: string;
  username: string;
}

export interface Member {
  name: string;
  id: string;
}