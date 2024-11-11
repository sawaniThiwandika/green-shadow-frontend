export class UserModel {
    constructor(email, password, role) {
        this.userEmail = email;
        this.userPassword = password;
        this.userRole = role;
    }

    get email() {
        return this.userEmail;
    }

    set email(value) {
        this.userEmail= value;
    }

    get password() {
        return this.userPassword;
    }

    set password(value) {
        this.userPassword= value;
    }

    get role() {
        return this.userRole;
    }

    set role(value) {
        this.userRole = value;
    }
}
