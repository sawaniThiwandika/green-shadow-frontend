export class EquipmentModel {
    set id(value) {
        this.equipmentId = value;
    }

    set name(value) {
        this.equipmentName = value;
    }

    set type(value) {
        this.equipmentType = value;
    }

    set status(value) {
        this.equipmentStatus = value;
    }

    set assignedStaff(value) {
        this.equipmentAssignedStaff = value;
    }

    set assignedField(value) {
        this.equipmentAssignedField = value;
    }
    get id() {
        return this.equipmentId;
    }

    get name() {
        return this.equipmentName;
    }

    get type() {
        return this.equipmentType;
    }

    get status() {
        return this.equipmentStatus;
    }

    get assignedStaff() {
        return this.equipmentAssignedStaff;
    }

    get assignedField() {
        return this.equipmentAssignedField;
    }
    constructor(id, name, type, status, assignedStaff, assignedField) {
        this.equipmentId = id;
        this.equipmentName = name;
        this.equipmentType = type;
        this.equipmentStatus = status;
        this.equipmentAssignedStaff = assignedStaff;
        this.equipmentAssignedField = assignedField;

    }
}
