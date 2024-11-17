import {StaffModel} from "../model/StaffModel.js";
import {staffList} from "../Db/db.js";
getStaffList();
function getStaffList(){
    const http = new XMLHttpRequest();
    staffList.length = 0;

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                let contentType = http.getResponseHeader("Content-Type");
                console.log("Content type: " + contentType);

                if (contentType && contentType.includes("application/json")) {
                    try {
                        let response = JSON.parse(http.responseText);
                        console.log("Response:", response);

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
                       // loadId(); // Assuming this function loads some ID related data
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
    http.open("GET", "http://localhost:5050/api/v1/staff", true);
    http.send();
}
function loadTable() {
    // Empty the table before loading new data
    $('#staffContainer').empty();

    // Loop through the staff data and append rows to the table
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
$('#staffForm').on('submit', function(event) {
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

    const existingRow = $(`#staffContainer tr[data-staff-id="${staffId}"]`);

    //Update staff
    if (existingRow.length > 0) {
        existingRow.find('td').eq(1).text(`${firstName} ${lastName}`);
        existingRow.find('td').eq(2).text(contactNo);
        existingRow.find('td').eq(3).text(email);

        let existingStaff = staffList.find(staff => staff.staffId === staffId);
        if (existingStaff) {
            existingStaff.firstName = firstName;
            existingStaff.lastName = lastName;
            existingStaff.designation = designation;
            existingStaff.gender = gender;
            existingStaff.joinedDate = joinedDate;
            existingStaff.dob = dob;
            existingStaff.addressLine1 = addressLine1;
            existingStaff.addressLine2 = addressLine2;
            existingStaff.addressLine3 = addressLine3;
            existingStaff.addressLine4 = addressLine4;
            existingStaff.addressLine5 = addressLine5;
            existingStaff.contactNo = contactNo;
            existingStaff.email = email;
            existingStaff.role = role;
            existingStaff.fields = fields;
            existingStaff.vehicle = vehicle;





        }
    }
    // add new staff
    else {
        //let validateStaff = validateStaff();

        //if(validateStaff){
        staffList.push(new StaffModel(staffId, firstName, lastName, designation, gender, joinedDate, dob, contactNo, email, addressLine1, addressLine2, addressLine3,
            addressLine4, addressLine5, role, fields, vehicle));


        // Append to staff table
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
        }
    `);
    }

   //}


    $('#staffForm')[0].reset();
    $('#addStaffModal').modal('hide');

    // Create JSON payload
    const jsonData = JSON.stringify(new StaffModel(
        staffId, firstName, lastName, designation, gender, joinedDate, dob,
        contactNo, email, addressLine1, addressLine2, addressLine3,
        addressLine4, addressLine5, role, fields, vehicle
    ));

    // Create and configure XMLHttpRequest
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 201) {
                console.log("Staff saved successfully");
                console.log("Response Text: ", http.responseText);
            } else {
                console.error("Request failed with status: ", http.status);
            }
        }
    };

    // Open a connection and set the Content-Type header
    http.open("POST", "http://localhost:5050/api/v1/staff", true);
    http.setRequestHeader("Content-Type", "application/json");

    // Send the JSON data
    http.send(jsonData);



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
