import { VehicleModel } from "../model/VehicleModel.js";
import { vehicleList } from "../Db/db.js";
$(document).on('click', 'addNewVehicle', function () {
    $('#addVehicleModalLabel').text('Add Vehicle');
    $('#submitVehicle').text('Add Vehicle');
});
$(document).ready(function () {

    // Handle vehicle form submission
    $('#vehicleForm').on('submit', function (event) {
        event.preventDefault();

        // Collect vehicle form data
        const vehicleCode = $('#vehicleCode').val();
        const licensePlate = $('#licensePlate').val();
        const vehicleCategory = $('#vehicleCategory').val();
        const fuelType = $('#fuelType').val();
        const status = $('#status').val();
        const allocatedStaff = $('#allocatedStaff').val();
        const remarks = $('#remarks').val();

        // Check if we're updating an existing entry
        const isUpdating = $('#vehicleCode').prop('readonly');
        if (isUpdating) {
            // Find and update the entry in vehicleList
            const vehicle = vehicleList.find(v => v.vehicleCode === vehicleCode);
            if (vehicle) {
                vehicle.vehicleLicensePlateNumber = licensePlate;
                vehicle.vehicleCategory = vehicleCategory;
                vehicle.vehicleFuelType = fuelType;
                vehicle.vehicleStatus = status;
                vehicle.vehicleAllocatedStaff = allocatedStaff;
                vehicle.vehicleRemarks = remarks;
            }

            // Update the table row
            const row = $('#vehicleContainer').find(`tr[data-code="${vehicleCode}"]`);
            row.find('td:eq(1)').text(licensePlate);
            row.find('td:eq(2)').text(vehicleCategory);
            row.find('td:eq(3)').text(status);
            row.find('td:eq(4)').text(allocatedStaff);

        } else {
            // Add new vehicle to the list
            const newVehicle = new VehicleModel(vehicleCode, licensePlate, vehicleCategory, fuelType, status, allocatedStaff, remarks);
            vehicleList.push(newVehicle);

            // Append new row to vehicle table
            $('#vehicleContainer').append(`
                <tr data-code="${vehicleCode}">
                    <td>${vehicleCode}</td>
                    <td>${licensePlate}</td>
                    <td>${vehicleCategory}</td>
                    <td>${status}</td>
                    <td>${allocatedStaff}</td>
                    <td>
                        <button class="btn btn-info btn-sm view-details-vehicle">View</button>
                        <button class="btn btn-warning btn-sm update-vehicle">Update</button>
                        <button class="btn btn-danger btn-sm delete-vehicle">Delete</button>
                    </td>
                </tr>
            `);
        }

        // Reset form and close modal
        $('#vehicleForm')[0].reset();
        $('#addVehicleModal').modal('hide');
        $('#vehicleCode').prop('readonly', false); // Make vehicleCode editable again
    });

    // View full details of a vehicle
    $(document).on('click', '.view-details-vehicle', function () {
        const row = $(this).closest('tr');
        const vehicleCode = row.find('td:eq(0)').text();
        const vehicle = vehicleList.find(v => v.vehicleCode === vehicleCode);

        if (vehicle) {
            // Fill modal with details for viewing/updating
            $('#vehicleCode').val(vehicle.vehicleCode).prop('readonly', true);
            $('#licensePlate').val(vehicle.licensePlate);
            $('#vehicleCategory').val(vehicle.vehicleCategory);
            $('#fuelType').val(vehicle.fuelType);
            $('#status').val(vehicle.status);
            $('#allocatedStaff').val(vehicle.allocatedStaff);
            $('#remarks').val(vehicle.remarks);
            $('#addVehicleModal').modal('show');
        }
    });

    // Update vehicle entry (update button)
    $(document).on('click', '.update-vehicle', function () {
        const row = $(this).closest('tr');
        const vehicleCode = row.find('td:eq(0)').text();
        const vehicle = vehicleList.find(v => v.vehicleCode === vehicleCode);

        if (vehicle) {
            // Populate form for editing
            $('#vehicleCode').val(vehicle.vehicleCode).prop('readonly', true);
            $('#licensePlate').val(vehicle.licensePlate);
            $('#vehicleCategory').val(vehicle.vehicleCategory);
            $('#fuelType').val(vehicle.fuelType);
            $('#status').val(vehicle.status);
            $('#allocatedStaff').val(vehicle.allocatedStaff);
            $('#remarks').val(vehicle.remarks);
            $('#addVehicleModalLabel').text('Update Vehicle');
            $('#submitVehicle').text('Update Vehicle');
            $('#addVehicleModal').modal('show');
        }
    });

    // Delete vehicle entry
    $(document).on('click', '.delete-vehicle', function () {
        const row = $(this).closest('tr');
        const vehicleCode = row.find('td:eq(0)').text();

        // Remove from vehicleList
        const vehicleIndex = vehicleList.findIndex(v => v.vehicleCode === vehicleCode);
        if (vehicleIndex !== -1) vehicleList.splice(vehicleIndex, 1);

        // Remove from table
        row.remove();
    });
});
