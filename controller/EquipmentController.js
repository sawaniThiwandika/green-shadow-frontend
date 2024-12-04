import { EquipmentModel } from "../model/EquipmentModel.js";
import {equipmentList, fieldList, staffList} from "../Db/db.js";
let selectedFieldOfEquipment=[];
let selectedStaffOfEquipment=[];
$(document).ready(function () {

    $("#equipmentAssignedStaff").on("input", function () {
        function populateDatalistStaffInEquipment() {
            var datalistForEquipment = $("#staffListForEquipment");
            datalistForEquipment.empty();
            $.each(staffList, function(index, staff) {
                datalistForEquipment.append($("<option>", { value:staff.email}));
            });
        }
        populateDatalistStaffInEquipment();



    });
    $("#equipmentAssignedStaff").on("keydown", function (event) {
        if (event.key === "Enter") {

            const selectedValue = $(this).val();
            let staff=isValidStaffMem(selectedValue);
            if ( staff!= null) {
                if (!selectedStaffOfEquipment.includes(staff.id)) {
                    selectedStaffOfEquipment.push(staff.id);
                    console.log("Selected staff:", selectedStaffOfEquipment);
                } else {
                    console.log("Equipment already selected:", selectedValue);
                }
            } else {
                console.error("Invalid Equipment selected:", selectedValue);
            }
            $(this).val("");
        }
    });
    function isValidStaffMem(email) {
        const staff = staffList.find(staff => staff.email === email);
        return staff || null;
    }
    //populate field data list in equipment modal
    $("#equipmentAssignedField").on("input", function () {
        function populateDatalistFieldInEquipment() {
            var datalistForFields = $("#fieldListForEquipment");
            datalistForFields.empty();
            $.each(fieldList, function(index, field) {
                datalistForFields.append($("<option>", { value: field.fieldName}));
            });
        }
        populateDatalistFieldInEquipment();



    });
    $("#equipmentAssignedField").on("keydown", function (event) {
        if (event.key === "Enter") {

            const selectedValue = $(this).val();
            let field=isValidField(selectedValue);
            if ( field!= null) {
                if (!selectedFieldOfEquipment.includes(field.fieldCode)) {
                    selectedFieldOfEquipment.push(field.fieldCode);
                    console.log("Selected fields:", selectedFieldOfEquipment);
                } else {
                    console.log("Field already selected:", selectedValue);
                }
            } else {
                console.error("Invalid field selected:", selectedValue);
            }
            $(this).val("");
        }
    });
    function isValidField(fieldName) {
        const field = fieldList.find(field => field.fieldName === fieldName);
        return field || null;
    }


    // Handle equipment form submission (Add or Update)
    $('#equipmentForm').on('submit', function (event) {
        event.preventDefault();

        // Collect equipment form data
        const equipmentId = $('#equipmentId').val();
        const name = $('#equipmentName').val();
        const type = $('#equipmentType').val();
        const status = $('#equipmentStatus').val();
        const assignedStaff = $('#equipmentAssignedStaff').val();
        const assignedField = $('#equipmentAssignedField').val();

        const jsonData = JSON.stringify(new EquipmentModel(
            equipmentId, name, type, status, assignedStaff, assignedField
        ));

        // Check if equipment ID already exists for update, else add new
        const existingEquipment = equipmentList.find(eq => eq.equipmentId === equipmentId);

        if (existingEquipment) {
            // Update existing equipment in equipmentList
            existingEquipment.equipmentName = name;
            existingEquipment.equipmentType = type;
            existingEquipment.equipmentStatus = status;
            existingEquipment.equipmentAssignedStaff = assignedStaff;
            existingEquipment.equipmentAssignedField = assignedField;

            // Update row in table
            const row = $(`#equipmentContainer tr[data-id="${equipmentId}"]`);
            row.find('td:eq(1)').text(name);
            row.find('td:eq(2)').text(type);
            row.find('td:eq(3)').text(status);
            row.find('td:eq(4)').text(assignedStaff);
            row.find('td:eq(5)').text(assignedField);

            // Send PUT request to backend
            $.ajax({
                url: `http://localhost:5050/api/v1/equipment/${equipmentId}`,
                type: "PUT",
                contentType: "application/json",
                data: jsonData,
                success: function (response) {
                    console.log("Equipment updated successfully:", response);
                },
                error: function (xhr, status, error) {
                    console.error("Error updating equipment:", status, error, xhr.responseText);
                }
            });

        } else {
            // Add new equipment to equipmentList
            const newEquipment = new EquipmentModel(equipmentId, name, type, status, assignedStaff, assignedField);
            equipmentList.push(newEquipment);

            // Append new row to equipment table
            $('#equipmentContainer').append(`
                <tr data-id="${equipmentId}">
                    <td>${equipmentId}</td>
                    <td>${name}</td>
                    <td>${type}</td>
                    <td>${status}</td>
                    <td>${assignedStaff}</td>
                    <td>${assignedField}</td>
                    <td>
                        <button class="btn btn-info btn-sm view-details-equipment">View</button>
                        <button class="btn btn-warning btn-sm update-equipment">Update</button>
                        <button class="btn btn-danger btn-sm delete-equipment">Delete</button>
                    </td>
                </tr>
            `);

            // Send POST request to backend
            $.ajax({
                url: "http://localhost:5050/api/v1/equipment",
                type: "POST",
                contentType: "application/json",
                data: jsonData,
                success: function (response) {
                    console.log("Equipment added successfully:", response);
                },
                error: function (xhr, status, error) {
                    console.error("Error adding equipment:", status, error, xhr.responseText);
                }
            });
        }

        // Reset form and close modal
        $('#equipmentForm')[0].reset();
        $('#addEquipmentModal').modal('hide');
    });

    // View full details of equipment for updating
    $(document).on('click', '.update-equipment', function () {
        const row = $(this).closest('tr');
        const equipmentId = row.data('id');
        const equipment = equipmentList.find(eq => eq.equipmentId === equipmentId);

        // Fill form with existing details for update
        $('#equipmentId').val(equipment.equipmentId).prop('readonly', true);
        $('#equipmentName').val(equipment.equipmentName);
        $('#equipmentType').val(equipment.equipmentType);
        $('#equipmentStatus').val(equipment.equipmentStatus);
        $('#equipmentAssignedStaff').val(equipment.equipmentAssignedStaff);
        $('#equipmentAssignedField').val(equipment.equipmentAssignedField);

        $('#addEquipmentModal').modal('show');
    });

    // Delete equipment entry
    $(document).on('click', '.delete-equipment', function () {
        const row = $(this).closest('tr');
        const equipmentId = row.data('id');

        // Remove from equipmentList
        const index = equipmentList.findIndex(eq => eq.equipmentId === equipmentId);
        if (index !== -1) equipmentList.splice(index, 1);

        // Remove row from table
        row.remove();

        // Send DELETE request to backend
        $.ajax({
            url: `http://localhost:5050/api/v1/equipment/${equipmentId}`,
            type: "DELETE",
            success: function (response) {
                console.log("Equipment deleted successfully:", response);
            },
            error: function (xhr, status, error) {
                console.error("Error deleting equipment:", status, error, xhr.responseText);
            }
        });
    });
});
