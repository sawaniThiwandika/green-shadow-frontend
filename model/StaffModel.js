export class StaffModel {
constructor(staffId, staffFirstName, staffLastName, staffDesignation,staffGender,staffJoinedDate,staffDob,staffContactNo,staffEmail
,staffAddressLine1, staffAddressLine2, staffAddressLine3, staffAddressLine4, staffAddressLine5,staffRole,staffFields,staffVehicle) {
    this.id = staffId;
    this.firstName = staffFirstName;
    this.lastName = staffLastName;
    this.designation = staffDesignation;
    this.gender = staffGender;
    this.joinedDate = new Date(staffJoinedDate);
    this.dob = new Date(staffDob);
    this.contactNo = staffContactNo;
    this.email = staffEmail;
    this.addressLine1 = staffAddressLine1;
    this.addressLine2 = staffAddressLine2;
    this.addressLine3 = staffAddressLine3;
    this.addressLine4 = staffAddressLine4;
    this.addressLine5 = staffAddressLine5;
    this.role = staffRole;
    this.fields = staffFields;
    this.vehicle = staffVehicle;
}


    get staffId() {
        return this.id;
    }

    set staffId(value) {
        this.id = value;
    }

    get staffFirstName() {
        return this.firstName;
    }

    set staffFirstName(value) {
        this.firstName = value;
    }

    get staffLastName() {
        return this.lastName;
    }

    set staffLastName(value) {
        this.lastName = value;
    }

    get staffDesignation() {
        return this.designation;
    }

    set staffDesignation(value) {
        this.designation = value;
    }

    get staffGender() {
        return this.gender;
    }

    set staffGender(value) {
        this.gender = value;
    }

    get staffJoinedDate() {
        return this.joinedDate;
    }

    set staffJoinedDate(value) {
        this.joinedDate = new Date(value);
    }

    get staffDob() {
        return this.dob;
    }

    set staffDob(value) {
        this.dob = new Date(value);
    }

    get staffContactNo() {
        return this.contactNo;
    }

    set staffContactNo(value) {
        this.contactNo = value;
    }

    get staffEmail() {
        return this.email;
    }

    set staffEmail(value) {
        this.email = value;
    }

    get staffAddressLine1() {
        return this.addressLine1;
    }

    set staffAddressLine1(value) {
        this.addressLine1 = value;
    }

    get staffAddressLine2() {
        return this.addressLine2;
    }

    set staffAddressLine2(value) {
        this.addressLine2 = value;
    }

    get staffAddressLine3() {
        return this.addressLine3;
    }

    set staffAddressLine3(value) {
        this.addressLine3 = value;
    }

    get staffAddressLine4() {
        return this.addressLine4;
    }

    set staffAddressLine4(value) {
        this.addressLine4 = value;
    }

    get staffAddressLine5() {
        return this.addressLine5;
    }

    set staffAddressLine5(value) {
        this.addressLine5 = value;
    }

    get staffRole() {
        return this.role;
    }

    set staffRole(value) {
        this.role = value;
    }

    get staffFields() {
        return this.fields;
    }

    set staffFields(value) {
        this.fields = value;
    }

    get staffVehicle() {
        return this.vehicle;
    }

    set staffVehicle(value) {
        this.vehicle = value;
    }

}
