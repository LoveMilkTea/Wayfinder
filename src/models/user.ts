export interface Roles {
    reader: boolean;
    author?: boolean;
    admin?:  boolean;
}
export class User {
    displayName: string;
    email:    string;
    photoURL: string;
    roles:    Roles;
    firstName: string;
    lastName: string;

    constructor(authData, firstName, lastName) {
        this.email    = authData.email
        this.photoURL = authData.photoURL
        this.displayName = authData.displayName
        this.roles    = { reader: true, author: true }
        this.firstName = firstName;
        this.lastName = lastName;
    }

}