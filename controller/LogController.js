import { LogModel } from "../model/LogModel.js";
import {cropList, fieldList, logList, staffList} from "../Db/db.js";
let selectedFieldOfLog=[];
let selectedCropOfLog=[];
let selectedStaffOfLog=[];
$(document).ready(function () {


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

    // crop details

    $("#cropOfLog").on("input", function () {
        function populateDatalistCropInLog() {
            var datalistForCrop = $("#cropListForLog");
            datalistForCrop.empty();
            $.each(cropList, function(index, crop) {
                datalistForCrop.append($("<option>", { value: crop.name}));
            });
        }
        populateDatalistCropInLog();



    });
    $("#cropOfLog").on("keydown", function (event) {
        if (event.key === "Enter") {

            const selectedValue = $(this).val();
            let crop=isValidCrop(selectedValue);
            if ( crop!= null) {
                if (!selectedCropOfLog.includes(crop.code)) {
                    selectedCropOfLog.push(crop.code);
                    console.log("Selected crops:",selectedCropOfLog);
                } else {
                    console.log("Crop already selected:", selectedValue);
                }
            } else {
                console.error("Invalid crop selected:", selectedValue);
            }
            $(this).val("");
        }
    });
    function isValidCrop(cropName) {
        const crop = cropList.find(crop => crop.name === cropName);
        return crop || null;
    }

    // staff list

    $("#staffOfLog").on("input", function () {
        function populateDatalistStaffInLog() {
            var datalistForStaff= $("#staffListForLog");
            datalistForStaff.empty();
            $.each(staffList, function(index, staff) {
                datalistForStaff.append($("<option>", { value: staff.email}));
            });
        }
        populateDatalistStaffInLog();



    });
    $("#staffOfLog").on("keydown", function (event) {
        if (event.key === "Enter") {

            const selectedValue = $(this).val();
            let staff=isValidStaff(selectedValue);
            if ( staff!= null) {
                if (!selectedStaffOfLog.includes(staff.email)) {
                    selectedStaffOfLog.push(staff.id);
                    console.log("Selected staff:",selectedStaffOfLog);
                } else {
                    console.log("staff already selected:", selectedValue);
                }
            } else {
                console.error("Invalid staff selected:", selectedValue);
            }
            $(this).val("");
        }
    });
    function isValidStaff(staffEmail) {
        const staff = staffList.find(staff => staff.email === staffEmail);
        return staff || null;
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

    const formData = new FormData();
    formData.append('logDate', logDate);
    formData.append('activity', activity);
    formData.append('staff', JSON.stringify(selectedSatffOfLog));
    formData.append('season', season);
    formData.append('fieldDetails', JSON.stringify(selectedFieldListOfCrop)); // Send the field codes as JSON
    formData.append('file', file);

    const existingCropIndex = logList.findIndex(log => log.logCode === logCode);

    if (existingCropIndex !== -1) {
        updateCrop(cropCode,formData); // Update existing crop
    } else {
        saveCrop(formData); // Save new crop
    }
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


