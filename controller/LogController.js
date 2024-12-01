import {cropList, fieldList, logList, staffList} from "../Db/db.js";

let selectedFieldOfLog=[];
let selectedCropOfLog=[];
let selectedStaffOfLog=[];

$(document).ready(function () {
    const logManager = new GetAllLog('logsContainer');
    logManager.loadLog();


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
    // const staff = $('#staffOfLog').val();
    // const crops = $('#cropOfLog').val();
    // const fields = $('#fieldOfLog').val();
    const details = $('#details').val();
    const observedImage = $('#observedImage')[0].files[0];  // Optional

    const formData = new FormData();
    formData.append('logDate', logDate);
    formData.append('activity', activity);
    formData.append('staff', JSON.stringify(selectedStaffOfLog));
    formData.append('crops', JSON.stringify(selectedCropOfLog));
    formData.append('fields', JSON.stringify(selectedFieldOfLog)); // Send the field codes as JSON
    formData.append('image', observedImage);

    const existingCropIndex = logList.findIndex(log => log.logCode === logCode);

    if (existingCropIndex !== -1) {
        updateLog(logCode, formData); // Update existing crop
    } else {
        saveLog(formData); // Save new crop
    }
    // Reset the form and close the modal
    $('#logForm')[0].reset();
    $('#logModal').modal('hide');
});

function saveLog(formData) {


    $.ajax({
        url: `http://localhost:5050/api/v1/log`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("log saved successfully", response);
            $('#logForm')[0].reset(); // Reset form after saving
            $('#logModal').modal('hide');
            $('#submitLog').text('Add Log');
        },
        error: function (xhr, status, error) {
            console.error("Error saving log:", error);
            console.error("Response text:", xhr.responseText);
        }
    });
}

function updateLog(logCode, formData) {

    $.ajax({
        url: `http://localhost:5050/api/v1/log/${logCode}`,
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("Log updated successfully", response);
            $('#logForm')[0].reset(); // Reset form after updating
            $('#logModal').modal('hide');
            $('#submitLog').text('Add Log');
        },
        error: function (xhr, status, error) {
            console.error("Error updating Log:", error);
            console.error("Response text:", xhr.responseText);
        }
    });
}

// View Full Details (Populate the modal for update)
$(document).on('click', '.view-details-log', function () {
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

export class GetAllLog {
    constructor(containerId) {
        this.containerId = containerId;
    }

    // Fetch and load logs into the table
    async loadLog() {
        try {
            const response = await fetch("http://localhost:5050/api/v1/log", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch logs: ${response.statusText}`);
            }

            const logs = await response.json();
            console.log("Logs fetched:", logs);
            logList.length = 0;
            logList.push(...logs);

            this.renderLogTable(logs);
        } catch (error) {
            console.error("Error loading logs:", error);
        }
    }

    // Render the logs into the table
    renderLogTable(logs) {
        const logsContainer = document.getElementById(this.containerId);

        // Clear existing rows
        logsContainer.innerHTML = '';

        logs.forEach((log) => {
            const row = document.createElement("tr");
            const image = log.observedImage
                ? `<img src="data:image/jpeg;base64,${log.observedImage}" 
                   alt="Observed Image" 
                   style="max-width: 100px; max-height: 100px; object-fit: cover; cursor: pointer;" 
                   class="log-image" 
                   data-bs-toggle="modal" 
                   data-bs-target="#imageModal" 
                   data-image-src="data:image/jpeg;base64,${log.observedImage}">`
                : "No Image";

            row.innerHTML = `
                <td>${log.logCode}</td>
                <td>${log.logDate}</td>
                <td>${log.logDetails}</td>
                <td>${image}</td>
                <td>${log.staff}</td>
                <td>${log.details}</td>
                <td>
                    <button class="btn btn-warning btn-sm update-log" data-log-id="${log.logCode}">Update</button>
                    <button class="btn btn-danger btn-sm delete-log" data-log-id="${log.logCode}">Delete</button>
                </td>
            `;

            logsContainer.appendChild(row);
        });
        this.attachImageClickHandler();

        this.addActionListeners();

    }
    //open image modal
    attachImageClickHandler() {
        const images = document.querySelectorAll('.log-image');

        images.forEach((img) => {
            img.addEventListener('click', (event) => {
                const imageSrc = event.target.getAttribute('data-image-src');
                const modalImage = document.getElementById('modalImage');
                modalImage.src = imageSrc;
            });
        });
    }

    // Add event listeners for Update and Delete buttons
    addActionListeners() {
        const updateButtons = document.querySelectorAll(".update-log");
        const deleteButtons = document.querySelectorAll(".delete-log");

        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => this.handleUpdate(event));
        });

        deleteButtons.forEach((button) => {
            button.addEventListener("click", (event) => this.handleDelete(event));
        });
    }

    // Handle Update button click
    handleUpdate(event) {
        const logId = event.target.getAttribute("data-log-id");
        console.log(`Update log with ID: ${logId}`);

        // Fetch the log details and populate the modal form
        const log = logList.find((log) => log.logCode === logId); // Assuming logList is globally available
        if (log) {
            document.getElementById("logId").value = log.logCode;
            document.getElementById("logDate").value = log.logDate;
            document.getElementById("activity").value = log.logDetails;
           // document.getElementById("staffOfLog").value = log.staff;
           // document.getElementById("cropOfLog").value = log.c; // Adjust as per your data
            //document.getElementById("fieldOfLog").value = log.field; // Adjust as per your data
            document.getElementById("details").value = log.logDetails;
            document.getElementById("logModalLabel").textContent = "Update Log";
            document.getElementById("submitLog").textContent = "Update Log";

            // Show the modal
            const logModal = new bootstrap.Modal(document.getElementById("logModal"));
            logModal.show();
        } else {
            console.error("Log not found for update:", logId);
        }
    }

    // Handle Delete button click
    async handleDelete(event) {
        const logId = event.target.getAttribute("data-log-id");
        console.log(`Delete log with ID: ${logId}`);

        if (confirm("Are you sure you want to delete this log?")) {
            try {
                const response = await fetch(`http://localhost:5050/api/v1/log/${logId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete log: ${response.statusText}`);
                }

                console.log(`Log with ID ${logId} deleted successfully.`);
                this.loadLog(); // Reload the table
            } catch (error) {
                console.error("Error deleting log:", error);
            }
        }
    }
}


