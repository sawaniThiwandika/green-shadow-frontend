export class  LogModel {
    constructor(logCode, logDate, logDetails, observedImage, relevantFields, relevantCrops, relevantStaff) {
        this.logCode = logCode;
        this.logDate = logDate;
        this.logDetails = logDetails;
        this.observedImage = observedImage;
        this.relevantFields = relevantFields;
        this.relevantCrops = relevantCrops;
        this.relevantStaff = relevantStaff;
    }

    // Getters
    getLogCode() {
        return this.logCode;
    }

    getLogDate() {
        return this.logDate;
    }

    getLogDetails() {
        return this.logDetails;
    }

    getObservedImage() {
        return this.observedImage;
    }

    getRelevantFields() {
        return this.relevantFields;
    }

    getRelevantCrops() {
        return this.relevantCrops;
    }

    getRelevantStaff() {
        return this.relevantStaff;
    }

    // Setters
    setLogCode(value) {
        this.logCode = value;
    }

    setLogDate(value) {
        this.logDate = value;
    }

    setLogDetails(value) {
        this.logDetails = value;
    }

    setObservedImage(value) {
        this.observedImage = value;
    }

    setRelevantFields(value) {
        this.relevantFields = value;
    }

    setRelevantCrops(value) {
        this.relevantCrops = value;
    }

    setRelevantStaff(value) {
        this.relevantStaff = value;
    }
}
