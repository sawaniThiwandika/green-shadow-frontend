import {EquipmentModel} from "../model/EquipmentModel.js";
import {equipmentList, fieldList, staffList} from "../Db/db.js";

let selectedFieldOfEquipment=[];
let selectedStaffOfEquipment=[];
$(document).ready(function () {
    // Initialize the table on page load
    fetchAllEquipment();

    $("#equipmentAssignedStaff").on("input", function () {
        function populateDatalistStaffInEquipment() {
            var datalistForEquipment = $("#staffListForEquipment");
            datalistForEquipment.empty();
            $.each(staffList, function (index, staff) {
                datalistForEquipment.append($("<option>", {value: staff.email}));
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

        // Create FormData object
        const formData = new FormData();
        formData.append("equipmentId", equipmentId);
        formData.append("equipmentName", name);
        formData.append("equipmentType", type);
        formData.append("equipmentStatus", status);
        formData.append("equipmentAssignedStaff", JSON.stringify(selectedStaffOfEquipment));
        formData.append("equipmentAssignedField", JSON.stringify(selectedFieldOfEquipment));


        const existingEquipment = equipmentList.find(eq => eq.equipmentId === equipmentId);

        if (existingEquipment) {
            existingEquipment.equipmentName = name;
            existingEquipment.equipmentType = type;
            existingEquipment.equipmentStatus = status;
            existingEquipment.equipmentAssignedStaff = selectedStaffOfEquipment;
            existingEquipment.equipmentAssignedField = selectedFieldOfEquipment;

            // Update row in table
            const row = $(`#equipmentContainer tr[data-id="${equipmentId}"]`);
            row.find('td:eq(1)').text(name);
            row.find('td:eq(2)').text(type);
            row.find('td:eq(3)').text(status);

            // Send PUT request to backend with FormData
            $.ajax({
                url: `http://localhost:5050/api/v1/equipment`,
                type: "PUT",
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwtToken')

                },
                success: function (response) {
                    console.log("Equipment updated successfully:", response);
                },
                error: function (xhr, status, error) {
                    console.error("Error updating equipment:", status, error, xhr.responseText);
                }
            });
        } else {
            // Add new equipment to equipmentList
            const newEquipment = new EquipmentModel(equipmentId, name, type, status, selectedStaffOfEquipment, selectedFieldOfEquipment);
            equipmentList.push(newEquipment);

            // Append new row to equipment table
            $('#equipmentContainer').append(`
                <tr data-id="${equipmentId}">
                    <td>${equipmentId}</td>
                    <td>${name}</td>
                    <td>${type}</td>
                    <td>${status}</td>
                    <td>${selectedStaffOfEquipment}</td>
                    <td>${selectedFieldOfEquipment}</td>
                    <td>
                        <button class="btn btn-info btn-sm view-details-equipment">View</button>
                        <button class="btn btn-warning btn-sm update-equipment">Update</button>
                        <button class="btn btn-danger btn-sm delete-equipment">Delete</button>
                    </td>
                </tr>
            `);

            // Send POST request to backend with FormData
            $.ajax({
                url: "http://localhost:5050/api/v1/equipment",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwtToken')

                },
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


    // Delete equipment
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
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken')

            },
            success: function (response) {
                console.log("Equipment deleted successfully:", response);
            },
            error: function (xhr, status, error) {
                console.error("Error deleting equipment:", status, error, xhr.responseText);
            }
        });
    });

    // Fetch all equipment records
    async function fetchAllEquipment() {
        try {
            const response = await fetch("http://localhost:5050/api/v1/equipment", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('jwtToken')

                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch equipments: ${response.statusText}`);
            }

            const equipments = await response.json();
            console.log("Equipments fetched:", equipments);
            equipmentList.length = 0;
            equipmentList.push(...equipments);

            populateEquipmentTable(equipments);
        } catch (error) {
            console.error("Error loading equipments:", error);
        }
    }

    // Populate the equipment table
    function populateEquipmentTable(equipments) {
        const tableBody = $('#equipmentContainer');
        tableBody.empty();

        equipments.forEach((equipment) => {

            const assignedFields = equipment.fieldEquipmentDetails
                ? equipment.fieldEquipmentDetails.map(field => field.fieldId).join(", ")
                : "None";
            const assignedStaff = equipment.staffEquipmentDetails
                ? equipment.staffEquipmentDetails.map(staff => staff.staffId).join(", ")
                : "None";

            const row = `
            <tr>
                <td>${equipment.equipmentId}</td>
                <td>${equipment.equipmentName}</td>
                <td>${equipment.equipmentType}</td>
                <td>${equipment.equipmentStatus}</td>
                <td>${assignedStaff}</td>
                <td>${assignedFields}</td>
                <td>
                    <button class="btn btn-info btn-sm view-details-equipment" data-id="${equipment.equipmentId}">View</button>
                    <button class="btn btn-warning btn-sm update-equipment" data-id="${equipment.equipmentId}">Update</button>
                    <button class="btn btn-danger btn-sm delete-equipment" data-id="${equipment.equipmentId}">Delete</button>
                </td>
            </tr>
        `;
            tableBody.append(row);
        });
    }

    $(document).on('click', '.view-details-equipment', function () {
        const equipmentId = $(this).data('id');
        const equipment = equipmentList.find(eq => eq.equipmentId === equipmentId);

        if (equipment) {

            $('#viewEquipmentId').text(equipment.equipmentId);
            $('#viewEquipmentName').text(equipment.equipmentName);
            $('#viewEquipmentType').text(equipment.equipmentType);
            $('#viewEquipmentStatus').text(equipment.equipmentStatus);

            $('#viewAssignedStaff').text(
                equipment.staffEquipmentDetails.map(staff => staff.staffId).join(", ") || "None"
            );
            $('#viewAssignedFields').text(
                equipment.fieldEquipmentDetails.map(field => field.fieldId).join(", ") || "None"
            );

            $('#viewEquipmentModal').modal('show');
        } else {
            console.error("Equipment not found for viewing.");
        }
    });

    $(document).on('click', '.update-equipment', function () {
        const equipmentId = $(this).data('id');
        console.log('Clicked equipment ID:', equipmentId);
        const equipment = equipmentList.find(eq => eq.equipmentId === equipmentId);

        if (equipment) {

            document.getElementById("equipmentId").value = equipment.equipmentId;
            document.getElementById("equipmentName").value = equipment.equipmentName;
            document.getElementById("equipmentType").value = equipment.equipmentType;
            document.getElementById("equipmentStatus").value = equipment.equipmentStatus;

            document.getElementById("equipmentAssignedStaff").value = equipment.staffEquipmentDetails.map(staff => staff.staffId).join(", ");
            document.getElementById("equipmentAssignedField").value = equipment.fieldEquipmentDetails.map(field => field.fieldId).join(", ");

            document.getElementById('addEquipmentModalLabel').innerText = 'Update Equipment';
            const submitButton = document.getElementById('submitEquipment');
            submitButton.innerText = 'Update Equipment'

            $('#addEquipmentModal').modal('show');
        } else {
            console.error('Equipment not found with ID:', equipmentId);
        }
    });


});
