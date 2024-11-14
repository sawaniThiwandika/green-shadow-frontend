

export class CropModel {
    constructor(cropCode, cropName, cropScientificName, cropCategory, cropSeason, cropImage,fields) {
        this.code = cropCode;
        this.name = cropName;
        this.scientificName = cropScientificName;
        this.category = cropCategory;
        this.season = cropSeason;
        this.image = cropImage;
        this.fields=fields;

    }

    get cropCode() {
        return this.code;
    }

    get cropName() {
        return this.name;
    }

    get cropScientificName() {
        return this.scientificName;
    }

    get cropCategory() {
        return this.category;
    }

    get cropSeason() {
        return this.season;
    }

    set cropCode(value) {
        this.code = value;
    }

    set cropName(value) {
        this.name = value;
    }

    set cropScientificName(value) {
        this.scientificName = value;
    }

    set cropCategory(value) {
        this.category = value;
    }

    set cropSeason(value) {
        this.season = value;
    }

    set cropImage(value) {
        this.image = value;
    }

    get cropImage() {
        return this.image;
    }
    set cropFields(value) {
        this.fields = value;
    }

    get cropFields() {
        return this.fields;
    }

}
