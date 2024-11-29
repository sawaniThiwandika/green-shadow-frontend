import { LogModel } from "../model/LogModel.js";
import {fieldList, logList} from "../Db/db.js";
$(document).ready(function () {
    let selectedFieldOfLog=[];

    $("#fieldOfLog").on("input", function () {
        function populateDatalistFieldInLog() {
            var datalistForFields = $("#fieldListForLog");
            datalistForFields.empty();
            $.each(fieldList, function(index, field) {
                datalistForFields.append($("<option>", { value: field.fieldName}));
            });
        }
        populateDatalistFieldInLog();



    });
    $("#fieldOfLog").on("keydown", function (event) {
        if (event.key === "Enter") {

            const selectedValue = $(this).val();
            let field=isValidField(selectedValue);
            if ( field!= null) {
                if (!selectedFieldOfLog.includes(field.fieldCode)) {
                    selectedFieldOfLog.push(field.fieldCode);
                    console.log("Selected fields:", selectedFieldOfLog);
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


});

// Add New Log Button
$('#addNewLog').on('click', function() {
    $('#logModalLabel').text('Add New Log');
    $('#submitLog').text('Add Log');
    $('#logForm')[0].reset();
    $('#logModal').modal('show');
});

// Handle log form submission (add or update)


$('#logForm').on('submit', function(event) {
    event.preventDefault();

    const logCode = $('#logId').val();
    const logDate = $('#logDate').val();
    const activity = $('#activity').val();
    const staff = $('#staffOfLog').val();
    const crops = $('#cropOfLog').val();
    const fields = $('#fieldOfLog').val();
    const details = $('#details').val();
    const observedImage = $('#observedImage')[0].files[0];  // Optional

    const existingRow = $(`#logsContainer tr[data-log-code="${logCode}"]`);

    // Update existing log
    if (existingRow.length > 0) {
        existingRow.find('td').eq(1).text(logDate);
        existingRow.find('td').eq(2).text(activity);
        existingRow.find('td').eq(3).text(staff);
        existingRow.find('td').eq(4).text(details);

        // Find and update the log in the logList
        let existingLog = logList.find(log => log.getLogCode() === logCode);
        if (existingLog) {
            existingLog.setLogDate(logDate);
            existingLog.setLogDetails(details);
            existingLog.setRelevantStaff(staff);
            existingLog.setObservedImage(observedImage ? observedImage.name : existingLog.getObservedImage());
            existingLog.setRelevantFields(fields);
            existingLog.setRelevantCrops(crops);
        }
    }
    // Add new log
    else {
        //if (validateLog()) {
            logList.push(new LogModel(logCode, logDate, details, observedImage, fields, crops, staff));

            // Append to logs table
            $('#logsContainer').append(`
                <tr data-log-code="${logCode}">
                    <td>${logCode}</td>
                    <td>${logDate}</td>
                    <td>${activity}</td>
                    <td>${staff}</td>
                    <td>${details}</td>
                    <td>
                        <button class="btn btn-info btn-sm view-details-log" data-bs-toggle="modal" data-bs-target="#logModal">Update</button>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-log">Delete</button>
                    </td>
                </tr>
            `);
        }
    //}

    // Reset the form and close the modal
    $('#logForm')[0].reset();
    $('#logModal').modal('hide');
});

// View Full Details (Populate the modal for update)
$(document).on('click', '.view-details-log', function() {
    // Ensure the row is properly selected
    const row = $(this).closest('tr');
    if (row.length === 0) {
        console.error('Row not found!');
        return;
    }

    const logCode = row.data('log-code');
    if (!logCode) {
        console.error('Log code not found!');
        return;
    }

    const selectedLog = logList.find(log => log.getLogCode() === logCode);
    if (!selectedLog) {
        console.error('Selected log not found!');
        return;
    }

    // Populate the form with data
    $('#logId').val(selectedLog.getLogCode());
    $('#logDate').val(selectedLog.getLogDate());
    $('#activity').val(selectedLog.getLogDetails());
    $('#staffOfLog').val(selectedLog.getRelevantStaff());
    $('#details').val(selectedLog.getLogDetails());
    $('#cropOfLog').val(selectedLog.getRelevantCrops());
    $('#fieldOfLog').val(selectedLog.getRelevantFields());
    $('#observedImage').val(selectedLog.getObservedImage());

    $('#logModalLabel').text('Update Log');
    $('#submitLog').text('Update Log');
    $('#logModal').modal('show');
});

// Delete Log
$(document).on('click', '.delete-log', function() {
    const row = $(this).closest('tr');
    const logCode = row.data('log-code');
    const confirmDelete = confirm("Are you sure you want to delete this log?");
    if (confirmDelete) {
        row.remove();
        const logIndex = logList.findIndex(log => log.getLogCode() === logCode);
        if (logIndex !== -1) {
            logList.splice(logIndex, 1);
        }
        console.log("Log deleted with code:", logCode);
    }
});


