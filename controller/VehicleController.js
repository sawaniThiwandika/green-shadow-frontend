import { VehicleModel } from "../model/VehicleModel.js";
import { vehicleList} from "../Db/db.js";

getVehicleList();
function getVehicleList() {
    vehicleList.length = 0;
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("Authentication token not found. Please log in.");
        window.location.href = "/login.html";
        return;
    }

    $.ajax({
        url: "http://localhost:5050/api/v1/vehicle",
        type: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: function(response) {
            // Check if the response is valid
            if (Array.isArray(response)) {
                response.forEach((vehicleData) => {
                    const staffId = vehicleData.staff ? vehicleData.staff.staffId : null;

                    const vehicle = new VehicleModel(
                        vehicleData.vehicleCode,
                        vehicleData.vehicleLicensePlateNumber,
                        vehicleData.vehicleCategory,
                        vehicleData.vehicleFuelType,
                        vehicleData.vehicleStatus,
                        staffId,
                        vehicleData.vehicleRemarks
                    );
                    vehicleList.push(vehicle);
                });

                console.log(vehicleList);
                loadTable();
            } else {
                console.error("Invalid response format:", response);
            }
        },
        error: function(xhr, status, error) {
            console.error("Request failed with status:", status);
            console.error("Error:", error);
            console.error("Response text:", xhr.responseText);
        }
    });
}

function loadTable() {
    $('#vehicleContainer').empty();


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

            // Prepare FormData
            const formData = new FormData();
            formData.append("vehicleCode", vehicleCode);
            formData.append("vehicleLicensePlateNumber", licensePlate);
            formData.append("vehicleCategory", vehicleCategory);
            formData.append("vehicleFuelType", fuelType);
            formData.append("vehicleStatus", status);
            formData.append("staffId", allocatedStaff);
            formData.append("vehicleRemarks", remarks);

            // Check if we're updating an existing entry
            const isUpdating = $('#vehicleCode').prop('readonly');
            const ajaxOptions = {
                url: isUpdating ? `http://localhost:5050/api/v1/vehicle` : `http://localhost:5050/api/v1/vehicle`,
                type: isUpdating ? 'PUT' : 'POST',
                data: formData,
                processData: false, // Necessary for FormData
                contentType: false, // Necessary for FormData
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                success: function (response) {
                    console.log(isUpdating ? "Vehicle updated successfully" : "Vehicle saved successfully");
                    console.log("Response:", response);

                    if (isUpdating) {
                        // Update the table row
                        const row = $('#vehicleContainer').find(`tr[data-code="${vehicleCode}"]`);
                        row.find('td:eq(1)').text(licensePlate);
                        row.find('td:eq(2)').text(vehicleCategory);
                        row.find('td:eq(3)').text(status);
                        row.find('td:eq(4)').text(allocatedStaff);

                        // Update the vehicleList entry
                        const vehicle = vehicleList.find(v => v.vehicleCode === vehicleCode);
                        if (vehicle) {
                            vehicle.vehicleLicensePlateNumber = licensePlate;
                            vehicle.vehicleCategory = vehicleCategory;
                            vehicle.vehicleFuelType = fuelType;
                            vehicle.vehicleStatus = status;
                            vehicle.staffId = allocatedStaff;
                            vehicle.vehicleRemarks = remarks;
                        }
                    } else {
                        // Add a new row to the table
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

                        // Add to vehicleList
                        const newVehicle = new VehicleModel(vehicleCode, licensePlate, vehicleCategory, fuelType, status, allocatedStaff, remarks);
                        vehicleList.push(newVehicle);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Request failed:", textStatus, errorThrown);
                    console.error("Status:", jqXHR.status);
                    console.error("Response Text:", jqXHR.responseText);
                }
            };


            $.ajax(ajaxOptions);


            $('#vehicleForm')[0].reset();
            $('#addVehicleModal').modal('hide');
            $('#vehicleCode').prop('readonly', false);
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

        // Confirm deletion
        const confirmDelete = confirm("Are you sure you want to delete this vehicle?");
        if (!confirmDelete) {
            return;
        }

        // Remove from vehicleList
        const vehicleIndex = vehicleList.findIndex(v => v.vehicleCode === vehicleCode);
        if (vehicleIndex !== -1) vehicleList.splice(vehicleIndex, 1);

        // Remove from table
        row.remove();

        console.log("Vehicle deleted with ID:", vehicleCode);

        // Perform AJAX DELETE request
        $.ajax({
            url: `http://localhost:5050/api/v1/vehicle/${vehicleCode}`,
            type: 'DELETE',
            contentType: 'application/json',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },

            data: JSON.stringify({ id: vehicleCode }),
            success: function (response) {
                console.log("Vehicle deleted successfully.");
                console.log("Response:", response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed:", textStatus, errorThrown);
                console.error("Failed with status:", jqXHR.status);
                console.error("Response Text:", jqXHR.responseText);
            },
            complete: function (jqXHR, textStatus) {
                console.log("AJAX call completed with status:", textStatus);
            }
        });
    });

});
