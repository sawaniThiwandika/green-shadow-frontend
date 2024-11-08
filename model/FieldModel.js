export class FieldModel{
    constructor(fieldCode, fieldName, fieldLocation, fieldSize, crops, staff, fieldImage1, fieldImage2) {
        this.fieldCode = fieldCode;
        this.fieldName = fieldName;
        this.fieldLocation = fieldLocation;
        this.fieldSize = fieldSize;
        this.crops = crops || [];
        this.staff = staff || [];
        this.fieldImage1 = fieldImage1;
        this.fieldImage2 = fieldImage2;
    }

    getFieldCode() {
        return this.fieldCode;
    }

    getFieldName() {
        return this.fieldName;
    }

    getFieldLocation() {
        return this.fieldLocation;
    }

    getFieldSize() {
        return this.fieldSize;
    }

    getCrops() {
        return this.crops;
    }

    getStaff() {
        return this.staff;
    }

    getFieldImage1() {
        return this.fieldImage1;
    }

    getFieldImage2() {
        return this.fieldImage2;
    }

    setFieldCode(value) {
        this.fieldCode = value;
    }

    setFieldName(value) {
        this.fieldName = value;
    }

    setFieldLocation(value) {
        this.fieldLocation = value;
    }

    setFieldSize(value) {
        this.fieldSize = value;
    }

    setCrops(value) {
        this.crops = value;
    }

    setStaff(value) {
        this.staff = value;
    }

    setFieldImage1(value) {
        this.fieldImage1 = value;
    }

    setFieldImage2(value) {
        this.fieldImage2 = value;
    }

}
