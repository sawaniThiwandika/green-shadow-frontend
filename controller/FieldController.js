import {FieldModel} from "../model/FieldModel.js";
import {fieldList} from "../Db/db.js";
//import {VehicleModel} from "../model/VehicleModel";

$('#fieldForm').on('submit', function(event) {
    event.preventDefault();

    const fieldCode = $('#fieldCode').val();
    const fieldName = $('#fieldName').val();
    const fieldLocation = $('#location').val();
    const fieldSize = $('#extent').val();
    const crops = $('#crops').val().split(',');
    const staff = $('#staff').val().split(',');

    const file1 = $('#fieldImage1')[0].files[0];
    const file2 = $('#fieldImage2')[0].files[0];

    if (!file1 || !file2) {
        alert("Please upload both images.");
        return;
    }

    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function(e1) {
        const fieldImage1 = e1.target.result;

        reader2.onload = function(e2) {
            const fieldImage2 = e2.target.result;

            const existingFieldIndex = fieldList.findIndex(field => field.getFieldCode() === fieldCode);

            if (existingFieldIndex !== -1) {
                fieldList[existingFieldIndex] = new FieldModel(fieldCode, fieldName, fieldLocation, fieldSize,  fieldImage1, fieldImage2,crops, staff,[],[]);
            } else {
                const newField = new FieldModel(fieldCode, fieldName, fieldLocation, fieldSize, fieldImage1, fieldImage2, crops, staff,[],[]);
                fieldList.push(newField);
                console.log(newField);
           // send new field to the backend

                const jsonData = JSON.stringify(new FieldModel(
                    fieldCode, fieldName, fieldLocation, fieldSize, fieldImage1, fieldImage2, crops, staff,[],[]
                ));
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
                http.open("POST", "http://localhost:5050/api/v1/field", true);
                http.setRequestHeader("Content-Type", "application/json");

                // Send the JSON data
                http.send(jsonData);



            }

            updateFieldTable();

            // Reset the form
            $('#fieldForm')[0].reset();
            $('#addFieldModal').modal('hide');
            $('#submitField').text('Add Field'); // Reset button text
        };

        reader2.readAsDataURL(file2);
    };

    reader1.readAsDataURL(file1);
});

// Function to update the field table dynamically
function updateFieldTable() {
    const fieldContainer = $('#fieldContainer');
    fieldContainer.empty(); // Clear existing table rows

    fieldList.forEach(field => {
        const row = `
            <tr data-field-code="${field.getFieldCode()}">
                <td>${field.getFieldCode()}</td>
                <td>${field.getFieldName()}</td>
                <td>${field.getFieldLocation()}</td>
                <td>${field.getFieldSize()} sq.m</td>
                <td>${field.getCrops().join(', ')}</td>
                <td>${field.getStaff().join(', ')}</td>
                <td><img src="${field.getFieldImage1()}" alt="Field Image 1" class="img-thumbnail" width="100"></td>
                <td><img src="${field.getFieldImage2()}" alt="Field Image 2" class="img-thumbnail" width="100"></td>
                <td>
                    <button class="btn btn-primary btn-sm update-field">Update</button>
                    <button class="btn btn-danger btn-sm delete-field">Delete</button>
                </td>
            </tr>
        `;
        fieldContainer.append(row);
    });
}

//Update
$(document).on('click', '.update-field', function() {
    const fieldCode = $(this).closest('tr').data('field-code');
    const field = fieldList.find(f => f.getFieldCode() === fieldCode);

    if (field) {
        $('#fieldCode').val(field.getFieldCode());
        $('#fieldName').val(field.getFieldName());
        $('#location').val(field.getFieldLocation());
        $('#extent').val(field.getFieldSize());
        $('#crops').val(field.getCrops().join(', '));
        $('#staff').val(field.getStaff().join(', '));

        $('#addFieldModal').modal('show');
        $('#submitField').text('Update Field');
    }
});

//Delete
$(document).on('click', '.delete-field', function() {
    const fieldCode = $(this).closest('tr').data('field-code');
    const fieldIndex = fieldList.findIndex(f => f.getFieldCode() === fieldCode);

    if (fieldIndex !== -1) {
        fieldList.splice(fieldIndex, 1);
        updateFieldTable();
    }
});
