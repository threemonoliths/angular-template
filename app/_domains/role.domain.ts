export class Role {
    id: number;
    rolename: string;
    permissions: Permission[];
}

export class Permission {
    id: number;
    pname: string;
}