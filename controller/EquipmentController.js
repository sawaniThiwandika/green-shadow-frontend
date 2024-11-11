import { EquipmentModel } from "../model/EquipmentModel.js";
import { equipmentList } from "../Db/db.js";

$(document).ready(function() {

    // Handle equipment form submission (Add or Update)
    $('#equipmentForm').on('submit', function(event) {
        event.preventDefault();
        // Collect equipment form data
        const equipmentId = $('#equipmentId').val();
        const name = $('#equipmentName').val();
        const type = $('#equipmentType').val();
        const status = $('#equipmentStatus').val();
        const assignedStaff = $('#equipmentAssignedStaff').val();
        const assignedField = $('#equipmentAssignedField').val();

        // Check if equipment ID already exists for update, else add new
        const existingEquipment = equipmentList.find(eq => eq.equipmentId === equipmentId);

        if (existingEquipment) {
            // Update existing equipment
            existingEquipment.equipmentId = equipmentId;
            existingEquipment.equipmentName = name;
            existingEquipment.equipmentType= type;
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
        } else {
            // Add new equipment
            const newEquipment = new EquipmentModel(equipmentId,name,type,status,assignedStaff,assignedField);
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
        }

        // Reset form and close modal
        $('#equipmentForm')[0].reset();
        $('#addEquipmentModal').modal('hide');
    });

    // View full details of equipment for updating
    $(document).on('click', '.update-equipment', function() {
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
    $(document).on('click', '.delete-equipment', function() {
        const row = $(this).closest('tr');
        const equipmentId = row.data('id');

        // Remove from equipmentList
        const index = equipmentList.findIndex(eq => eq.equipmentId === equipmentId);
        if (index !== -1) equipmentList.splice(index, 1);

        // Remove row from table
        row.remove();
    });
});
