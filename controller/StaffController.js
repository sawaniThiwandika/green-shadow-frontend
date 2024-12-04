import {StaffModel} from "../model/StaffModel.js";
import {staffList} from "../Db/db.js";
getStaffList();
console.log("jwt token : ",localStorage.getItem("jwtToken"))
function getStaffList() {
    const token = localStorage.getItem("jwtToken");
    staffList.length = 0;

    if (!token) {
        alert("Authentication token not found. Please log in.");
        window.location.href = "/login.html";
        return;
    }

    $.ajax({
        url: "http://localhost:5050/api/v1/staff",
        type: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: function(response) {
            // Check if the response is valid
            if (Array.isArray(response)) {
                response.forEach((staffData) => {
                    const staffM = new StaffModel(
                        staffData.id,
                        staffData.firstName,
                        staffData.lastName,
                        staffData.designation,
                        staffData.gender,
                        staffData.joinedDate,
                        staffData.dob,
                        staffData.contactNo,
                        staffData.email,
                        staffData.addressLine1,
                        staffData.addressLine2,
                        staffData.addressLine3,
                        staffData.addressLine4,
                        staffData.addressLine5,
                        staffData.role,
                        staffData.fields,
                        staffData.vehicle
                    );
                    staffList.push(staffM);
                });

                console.log(staffList);
                loadTable(); // Populate table with staff data
            } else {
                console.error("Invalid response format:", response);
            }
        },
        error: function(xhr, status, error) {
            console.error("Request failed with status:", status);
            console.error("Error:", error);
            console.error("Response text:", xhr.responseText);

            if (xhr.status === 401) {
                alert("Unauthorized access. Please log in again.");
                window.location.href = "/login.html";
            }
        }
    });
}

function loadTable() {

    $('#staffContainer').empty();

    staffList.forEach(staff => {
        $('#staffContainer').append(`
            <tr data-staff-id="${staff.staffId}">
                <td>${staff.staffId}</td>
                <td>${staff.firstName} ${staff.lastName}</td>
                <td>${staff.contactNo}</td>
                <td>${staff.email}</td>
                <td>
                    <button class="btn btn-info btn-sm view-details" data-bs-toggle="modal" data-bs-target="#addStaffModal">Update</button>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm delete-staff" data-bs-toggle="modal">Delete</button>
                </td>
            </tr>
        `);
    });
}
$('#staffForm').on('submit', function (event) {
    event.preventDefault();

    const staffId = $('#staffId').val();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const designation = $('#designation').val();
    const gender = $('#gender').val();
    const joinedDate = $('#joinedDate').val();
    const dob = $('#dob').val();
    const addressLine1 = $('#addressLine1').val().trim();
    const addressLine2 = $('#addressLine2').val().trim();
    const addressLine3 = $('#addressLine3').val().trim();
    const addressLine4 = $('#addressLine4').val().trim();
    const addressLine5 = $('#addressLine5').val().trim();
    const contactNo = $('#contactNo').val();
    const email = $('#email').val();
    const role = $('#role').val();
    const fields = $('#fields').val();
    const vehicle = $('#vehicle').val();

    const jsonData = JSON.stringify(new StaffModel(
        staffId, firstName, lastName, designation, gender, joinedDate, dob,
        contactNo, email, addressLine1, addressLine2, addressLine3,
        addressLine4, addressLine5, role, fields, vehicle
    ));

    const existingRow = $(`#staffContainer tr[data-staff-id="${staffId}"]`);

    // Update staff
    if (existingRow.length > 0) {
        // Update table row
        existingRow.find('td').eq(1).text(`${firstName} ${lastName}`);
        existingRow.find('td').eq(2).text(contactNo);
        existingRow.find('td').eq(3).text(email);

        // Update staff in the staffList array
        const existingStaff = staffList.find(staff => staff.id === staffId);
        if (existingStaff) {
            Object.assign(existingStaff, {
                firstName, lastName, designation, gender, joinedDate, dob,
                contactNo, email, addressLine1, addressLine2, addressLine3,
                addressLine4, addressLine5, role, fields, vehicle
            });
        }

        // Send PUT request
        $.ajax({
            url: "http://localhost:5050/api/v1/staff",
            type: "PUT",
            contentType: "application/json",
            data: jsonData,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken')

            },
            success: function (response) {
                console.log("Staff updated successfully:", response);
            },
            error: function (xhr, status, error) {
                console.error("Error updating staff:", status, error, xhr.responseText);
            }
        });

    } else {

        staffList.push(new StaffModel(staffId, firstName, lastName, designation, gender, joinedDate, dob,
            contactNo, email, addressLine1, addressLine2, addressLine3,
            addressLine4, addressLine5, role, fields, vehicle));


        $('#staffContainer').append(`
            <tr data-staff-id="${staffId}">
                <td>${staffId}</td>
                <td>${firstName} ${lastName}</td>
                <td>${contactNo}</td>
                <td>${email}</td>
                <td>
                    <button class="btn btn-info btn-sm view-details" data-bs-toggle="modal" data-bs-target="#addStaffModal">Update</button>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm delete-staff" data-bs-toggle="modal">Delete</button>
                </td>
            </tr>
        `);

        // Send POST request
        $.ajax({
            url: "http://localhost:5050/api/v1/staff",
            type: "POST",
            contentType: "application/json",
            data: jsonData,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken')

            },
            success: function (response) {
                console.log("Staff added successfully:", response);
            },
            error: function (xhr, status, error) {
                console.error("Error adding staff:", status, error, xhr.responseText);
            }
        });
    }


    $('#staffForm')[0].reset();
    $('#addStaffModal').modal('hide');
});

$('#addNewStaff').on('click', function() {
    $('#addStaffModalLabel').text('Add Staff');
    $('#submitBtnModal').text('Add Staff');
    $('#staffForm')[0].reset();
    $('#addStaffModal').modal('show');
});
// Delete Staff Mem
$(document).on('click', '.delete-staff', function() {
    const row = $(this).closest('tr');
    const staffId = row.data('staff-id');
    const confirmDelete = confirm("Are you sure you want to delete this staff member?");
    if (confirmDelete) {
        row.remove();
        if (staffList[staffId]) {
            delete staffList[staffId];
        }

        console.log("Staff member deleted with ID:", staffId);

        $.ajax({
            url: `http://localhost:5050/api/v1/staff/${staffId}`,
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id: staffId }),
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken')

            },
            success: function(response, textStatus, jqXHR) {
                console.log("Staff member successfully deleted.");
                if (jqXHR.getResponseHeader("Content-Type").includes("application/json")) {
                    console.log("Response:", response);
                } else {
                    console.error("Unexpected content type:", jqXHR.getResponseHeader("Content-Type"));
                    console.error("Response is not JSON:", response);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error during deletion:", textStatus, errorThrown);
                console.error("Failed with status:", jqXHR.status);
                console.error("Response text:", jqXHR.responseText);
            },
            complete: function(jqXHR, textStatus) {
                console.log("Ajax call completed with status:", textStatus);
            }
        });
    }
});
// View full details
$(document).on('click', '.view-details', function() {
    const row = $(this).closest('tr');

    console.log("row: " + row.index());
    let selectedStaff = staffList[row.index()];
    $('#staffId').val(selectedStaff.id);
    $('#firstName').val(selectedStaff.firstName);
    $('#lastName').val(selectedStaff.lastName);
    $('#designation').val(selectedStaff.designation);
    $('#gender').val(selectedStaff.gender);
    const joinedDate = new Date(selectedStaff.joinedDate).toISOString().split('T')[0];
    const dob = new Date(selectedStaff.dob).toISOString().split('T')[0];

    $('#joinedDate').val(joinedDate);
    $('#dob').val(dob);

    $('#addressLine1').val(selectedStaff.addressLine1);
    $('#addressLine2').val(selectedStaff.addressLine2);
    $('#addressLine3').val(selectedStaff.addressLine3);
    $('#addressLine4').val(selectedStaff.addressLine4);
    $('#addressLine5').val(selectedStaff.addressLine5);
    $('#contactNo').val(selectedStaff.contactNo);
    $('#email').val(selectedStaff.email);
    $('#role').val(selectedStaff.role);
    $('#fields').val(selectedStaff.fields);
    $('#vehicle').val(selectedStaff.vehicle);

    $('#addStaffModalLabel').text('Update Staff');
    $('#submitBtnModal').text('Update Staff');


    $('#addStaffModal').modal('show');
});

//Validation

function validateStaff() {

    let isValid = true;
    const errorMessage = [];

    const staffId = $('#staffId').val();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const designation = $('#designation').val();
     const gender = $('#gender').val();
     const joinedDate = $('#joinedDate').val();
     const dob = $('#dob').val();
    const addressLine1 = $('#addressLine1').val().trim();
    const addressLine2 = $('#addressLine2').val().trim();
    const addressLine3 = $('#addressLine3').val().trim();
    const addressLine4 = $('#addressLine4').val().trim();
    const addressLine5 = $('#addressLine5').val().trim();
     const contactNo = $('#contactNo').val();
     const email = $('#email').val();
     const role = $('#role').val();
     const fields = $('#fields').val();
     const vehicle = $('#vehicle').val();



     if (!staffId) {
         errorMessage.push("Staff ID is required.");
         isValid = false;
     }


     if (!firstName || !/^[a-zA-Z]+$/.test(firstName)) {
         errorMessage.push("First name is required and should contain only letters.");
         isValid = false;
     }
     if (!lastName || !/^[a-zA-Z]+$/.test(lastName)) {
         errorMessage.push("Last name is required and should contain only letters.");
         isValid = false;
     }

     if (!contactNo || !/^\d{10}$/.test(contactNo)) {
         errorMessage.push("Contact number must be 10 digits.");
         isValid = false;
     }

     if (!email || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
         errorMessage.push("Valid email is required.");
         isValid = false;
     }

     if (!joinedDate) {
         errorMessage.push("Joined date is required.");
         isValid = false;
     }
     if (!dob) {
         errorMessage.push("Date of birth is required.");
         isValid = false;
     }

     if (addressLine1) {
         errorMessage.push("At least one line of the address is required.");
         isValid = false;
     }
    if (addressLine2) {
        errorMessage.push("At least one line of the address is required.");
        isValid = false;
    }
    if (addressLine3) {
        errorMessage.push("At least one line of the address is required.");
        isValid = false;
    }
    if (addressLine4) {
        errorMessage.push("At least one line of the address is required.");
        isValid = false;
    }
    if (addressLine5) {
        errorMessage.push("At least one line of the address is required.");
        isValid =  false;
    }


    return isValid;

 }
