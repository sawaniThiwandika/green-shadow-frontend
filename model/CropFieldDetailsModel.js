export class CropFieldDetailsModel{
    get cropCode() {
        return this.cropCode;
    }

    set cropCode(value) {
        this.cropCode = value;
    }

    get fieldCode() {
        return this.fieldCode;
    }

    set fieldCode(value) {
        this.fieldCode = value;
    }
    constructor(cropCode, fieldCode) {
        this.cropCode = cropCode;
        this.fieldCode = fieldCode;


    }
}
