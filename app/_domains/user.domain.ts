import {Role} from './role.domain';

export class User {
    id: number;
    username: string;
    password: string;
    email:string;
    fullname: string;
    position: string;
    roles: Role[];
}