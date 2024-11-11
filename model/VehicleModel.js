export class VehicleModel {

    constructor(code, licensePlateNumber, category, fuelType, status, allocatedStaff, remarks) {
        this.vehicleCode = code;
        this.vehiclelicensePlateNumber = licensePlateNumber;
        this.vehicleCategory = category;
        this.vehicleFuelType = fuelType;
        this.vehicleStatus = status;
        this.vehicleAllocatedStaff = allocatedStaff;
        this.vehicleRemarks = remarks;
    }
    set code(value) {
        this.vehicleCode = value;
    }

    set licensePlate(value) {
        this.vehicleLicensePlateNumber = value;
    }

    set category(value) {
        this.vehicleCategory = value;
    }

    set fuelType(value) {
        this.vehicleFuelType = value;
    }

    set status(value) {
        this.vehicleStatus = value;
    }

    set allocatedStaff(value) {
        this.vehicleAllocatedStaff = value;
    }

    set remarks(value) {
        this.vehicleRemarks = value;
    }
    get code() {
        return this.vehicleCode;
    }

    get licensePlate() {
        return this.vehiclelicensePlateNumber;
    }

    get category() {
        return this.vehicleCategory;
    }

    get fuelType() {
        return this.vehicleFuelType;
    }

    get status() {
        return this.vehicleStatus;
    }

    get allocatedStaff() {
        return this.vehicleAllocatedStaff;
    }

    get remarks() {
        return this.vehicleRemarks;
    }

}
