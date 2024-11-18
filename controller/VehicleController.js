import { VehicleModel } from "../model/VehicleModel.js";
import { vehicleList} from "../Db/db.js";

getVehicleList();
function getVehicleList(){
    const http = new XMLHttpRequest();
    vehicleList.length = 0;

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                let contentType = http.getResponseHeader("Content-Type");
                console.log("Content type: " + contentType);

                if (contentType && contentType.includes("application/json")) {
                    try {
                        let response = JSON.parse(http.responseText);
                        console.log("Response:", response);

                        response.forEach((vehicleData) => {
                            const staffId = vehicleData.staff ? vehicleData.staff.staffId : null; // Safely access staffId

                            const vehicle = new VehicleModel(
                                vehicleData.vehicleCode,
                                vehicleData.vehicleLicensePlateNumber,
                                vehicleData.vehicleCategory,
                                vehicleData.vehicleFuelType,
                                vehicleData.vehicleStatus,
                                staffId,
                                vehicleData.vehicleRemarks,

                            );
                            vehicleList.push(vehicle);
                        });

                        console.log(vehicleList);
                        loadTable(); // Assuming this function populates a table with customer data

                    } catch (e) {
                        console.error("Failed to parse JSON response: ", e);
                        console.error("Response text: ", http.responseText);
                    }
                } else {
                    console.error("Unexpected content type: ", contentType);
                    console.error("Response is not JSON: ", http.responseText);
                }
            } else {
                console.error("Request failed with status: ", http.status);
                console.error("Response text: ", http.responseText);
            }
        } else {
            console.log("Processing stage: ", http.readyState);
        }
    };


    // Use GET method to fetch customer list
    http.open("GET", "http://localhost:5050/api/v1/vehicle", true);
    http.send();
}
function loadTable() {
    $('#vehicleContainer').empty();

    // Loop through the staff data and append rows to the table
    vehicleList.forEach(vehicle => {
        $('#vehicleContainer').append(`
                <tr data-code="${vehicle.vehicleCode}">
                    <td>${vehicle.vehicleCode}</td>
                    <td>${vehicle.vehicleLicensePlateNumber}</td>vehicleCode, licensePlate, vehicleCategory, fuelType, status, allocatedStaff, remarks
                    <td>${vehicle.vehicleCategory}</td>
                    <td>${vehicle.vehicleStatus}</td>
                    <td>${vehicle.allocatedStaff}</td>
                    <td>
                        <button class="btn btn-info btn-sm view-details-vehicle">View</button>
                        <button class="btn btn-warning btn-sm update-vehicle">Update</button>
                        <button class="btn btn-danger btn-sm delete-vehicle">Delete</button>
                    </td>
                </tr>
            `);
    })
}
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
                vehicle.staffId = allocatedStaff;
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
                    <td>${licensePlate}</td>vehicleCode, licensePlate, vehicleCategory, fuelType, status, allocatedStaff, remarks
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


            // Create JSON payload
            //const jsonData = JSON.stringify(new VehicleModel(vehicleCode, licensePlate, vehicleCategory, fuelType, status, allocatedStaff, remarks));

            const formData = new FormData();
            formData.append("vehicleCode", vehicleCode);
            formData.append("vehicleLicensePlateNumber", licensePlate);
            formData.append("vehicleCategory", vehicleCategory);
            formData.append("vehicleFuelType", fuelType);
            formData.append("vehicleStatus", status);
            formData.append("staffId", allocatedStaff);
            formData.append("vehicleRemarks", remarks);
            // Create and configure XMLHttpRequest
            const http = new XMLHttpRequest();
            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    if (http.status === 201) {
                        console.log("Vehicle saved successfully");
                        console.log("Response Text: ", http.responseText);
                    } else {
                        console.error("Request failed with status: ", http.status);
                    }
                }
            };

            // Open a connection and set the Content-Type header
            http.open("POST", "http://localhost:5050/api/v1/vehicle", true);
           // http.setRequestHeader("Content-Type", "multipart/form-data");

            // Send the Form data
            http.send(formData);

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
            $('#licensePlate').val(vehicle.vehicleLicensePlateNumber);
            $('#vehicleCategory').val(vehicle.vehicleCategory);
            $('#fuelType').val(vehicle.vehicleFuelType);
            $('#status').val(vehicle.vehicleStatus);
            $('#allocatedStaff').val(vehicle.staffId);
            $('#remarks').val(vehicle.vehicleRemarks);
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
            $('#licensePlate').val(vehicle.vehicleLicensePlateNumber);
            $('#vehicleCategory').val(vehicle.vehicleCategory);
            $('#fuelType').val(vehicle.vehicleFuelType);
            $('#status').val(vehicle.vehicleStatus);
            $('#allocatedStaff').val(vehicle.staffId);
            $('#remarks').val(vehicle.vehicleRemarks);
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
