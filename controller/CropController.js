import {cropList,fieldList} from "../Db/db.js";
let selectedFieldListOfCrop = [];
let editCropId = null;
$(document).ready(function () {

    $("#fieldDetailsCrop").on("input", function () {
        populateDatalistFields();
        console.log("Clicked on search  Field");

    });
    $("#fieldDetailsCrop").on("keydown", function (event) {
        if (event.key === "Enter") {

            const selectedValue = $(this).val();
            let field=isValidField(selectedValue);
            if ( field!= null) {
                if (!selectedFieldListOfCrop.includes(field.fieldCode)) {
                    selectedFieldListOfCrop.push(field.fieldCode);
                    console.log("Selected fields:", selectedFieldListOfCrop);
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
    function populateDatalistFields() {
        var datalistForFields = $("#fieldListForCrop");
        datalistForFields.empty();
        $.each(fieldList, function(index, field) {
            datalistForFields.append($("<option>", { value: field.fieldName}));
        });
    }

    // When a field is selected by the user
    $("#fieldDetailsCrop").on("keydown", function (event) {
        if (event.key === "Enter") {
            const selectedValue = $(this).val();
            let field = isValidField(selectedValue);
            if (field != null) {
                // Add the field code, not the whole field object
                if (!selectedFieldListOfCrop.includes(field.fieldCode)) {
                    selectedFieldListOfCrop.push(field.fieldCode); // Push fieldCode
                    console.log("Selected fields:", selectedFieldListOfCrop);
                } else {
                    console.log("Field already selected:", selectedValue);
                }
            } else {
                console.error("Invalid field selected:", selectedValue);
            }
            $(this).val(""); // Clear input after selection
        }
    });

// On form submit
    $('#cropForm').on('submit', function (event) {
        event.preventDefault();
        console.log("Selected fields when submit btn clicked:", selectedFieldListOfCrop);

        const cropCode = $('#cropCode').val();
        const commonName = $('#commonName').val();
        const scientificName = $('#scientificName').val();
        const category = $('#category').val();
        const season = $('#season').val();
        const file = $('#cropImage')[0].files[0];

        if (!file) {
            alert("Please upload an image");
            return;
        }

        const formData = new FormData();
        formData.append('commonName', commonName);
        formData.append('scientificName', scientificName);
        formData.append('category', category);
        formData.append('season', season);
        formData.append('fieldDetails', JSON.stringify(selectedFieldListOfCrop)); // Send the field codes as JSON
        formData.append('file', file);

        // Check if the crop already exists
        const existingCropIndex = cropList.findIndex(crop => crop.code === cropCode);

        if (existingCropIndex !== -1) {
            updateCrop(formData); // Update existing crop
        } else {
            saveCrop(formData); // Save new crop
        }
    });

    function saveCrop(formData) {
        console.log("Selected fields in saveCrop:", selectedFieldListOfCrop);

        $.ajax({
            url: `http://localhost:5050/api/v1/crop`,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Crop saved successfully", response);
                $('#cropForm')[0].reset(); // Reset form after saving
                $('#addCropModal').modal('hide');
                $('#submitCrop').text('Add Crop');
            },
            error: function (xhr, status, error) {
                console.error("Error saving crop:", error);
                console.error("Response text:", xhr.responseText);
            }
        });
    }

    function updateCrop(formData) {
        $.ajax({
            url: `http://localhost:5050/api/v1/crop`,
            type: "PUT",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Crop updated successfully", response);
                $('#cropForm')[0].reset(); // Reset form after updating
                $('#addCropModal').modal('hide');
                $('#submitCrop').text('Add Crop');
            },
            error: function (xhr, status, error) {
                console.error("Error updating crop:", error);
                console.error("Response text:", xhr.responseText);
            }
        });
    }

});


/*
$('#cropForm').on('submit', function(event) {


    event.preventDefault();
    console.log("Selected feld when submit btn clicked :"+selectedFieldListOfCrop);
    const cropCode = $('#cropCode').val();
    const commonName = $('#commonName').val();
    const scientificName = $('#scientificName').val();
    const category = $('#category').val();
    const season = $('#season').val();
    //const fieldDetails = $('#fieldDetails').val();
    const file = $('#cropImage')[0].files[0];
    if (!file) {
        alert("Please upload  image");
        return;
    }
    const formData = new FormData();
    //formData.append('cropCode', cropCode);
    formData.append('commonName', commonName);
    formData.append('scientificName', scientificName);
    formData.append('category', category);
    formData.append('season', season);
    formData.append('fieldDetails',JSON.stringify(selectedFieldListOfCrop));
    formData.append('file', file);

    // Check if fieldCode already exists
    const existingCropIndex =cropList.findIndex(crop => crop.code === cropCode);

    if (existingCropIndex !== -1) {
        updateCrop(formData); // Call updateField for existing field
    } else {
        saveCrop(formData); // Call saveField for new field
    }

    /!*
        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const cropImage = e.target.result;

                if (editCropId !== null) {
                    // Update existing crop
                    const crop = cropList.find(c => c.code === editCropId);
                    crop.code = cropCode;
                    crop.name = commonName;
                    crop.ScientificName = scientificName;
                    crop.category = category;
                    crop.season = season;
                    crop.fields = fieldDetails;
                    crop.image = cropImage;

                    // Update the crop card in the DOM
                    const cropCard = $(`[data-crop-id="${editCropId}"]`);
                    cropCard.find('.card-img-top').attr('src', cropImage);
                    cropCard.find('.card-title').text(commonName);
                    cropCard.find('p:nth-child(3)').text(`Code: ${cropCode}`);
                    cropCard.find('p:nth-child(4)').text(`Scientific Name: ${scientificName}`);
                    cropCard.find('p:nth-child(5)').text(`Category: ${category}`);
                    cropCard.find('p:nth-child(6)').text(`Season: ${season}`);
                    cropCard.find('p:nth-child(7)').text(`Field Details: ${fieldDetails}`);

                    editCropId = null;  // Reset edit mode
                } else {
                    // Add new crop
                    cropList.push(new CropModel(cropCode, commonName, scientificName, category, season, cropImage,fieldDetails));

                    const cropContainer = $('#cropContainer');
                    const cropCard = `
                        <div class="col-md-4" data-crop-id="${cropCode}">
                            <div class="card">
                                <img src="${cropImage}" alt="${commonName}" class="card-img-top crop-img">
                                <div class="card-body">
                                    <h5 class="card-title">${commonName}</h5>
                                    <p><strong>Code:</strong> ${cropCode}</p>
                                    <p><strong>Scientific Name:</strong> ${scientificName}</p>
                                    <p><strong>Category:</strong> ${category}</p>
                                    <p><strong>Season:</strong> ${season}</p>
                                    <p><strong>Field Details:</strong> ${fieldDetails}</p>
                                    <button class="btn btn-primary btn-sm update-crop">Update</button>
                                    <button class="btn btn-danger btn-sm delete-crop">Delete</button>
                                </div>
                            </div>
                        </div>
                    `;

                    cropContainer.append(cropCard);
                }

                // Reset the form and hide the modal
                $('#cropForm')[0].reset();
                $('#addCropModal').modal('hide');
            };

            reader.readAsDataURL(file);
        } else {
            alert("Please upload an image.");
        }*!/
});



function saveCrop(formData) {

    console.log("Field list "+selectedFieldListOfCrop[0]);
    $.ajax({
        url: `http://localhost:5050/api/v1/crop`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("Crop saved successfully", response);

            $('#cropForm')[0].reset();
            $('#addCropModal').modal('hide');
            $('#submitCrop').text('Add Field');

        },
        error: function(xhr, status, error) {
            console.error("Error saving crop: ", error);
            console.error("Response text: ", xhr.responseText);
        }
    });
}

// AJAX for update
function updateCrop(formData) {
    //const fieldManager = new GetAllField('fieldContainer');
    $.ajax({
        url: `http://localhost:5050/api/v1/crop`,
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("Crop updated successfully", response);
            //fieldManager.loadFields();


            $('#cropForm')[0].reset();
            $('#addCropModal').modal('hide');
            $('#submitCrop').text('Add Crop');

        },
        error: function(xhr, status, error) {
            console.error("Error updating crop: ", error);
            console.error("Response text: ", xhr.responseText);
        }
    });
}
*/


// Update Crop - Button Click Event
$(document).on('click', '.update-crop', function() {
    const cropId = $(this).closest('.col-md-4').data('crop-id');
    const cropData = cropList.find(crop => crop.code === cropId);

    $('#cropCode').val(cropData.code);
    $('#commonName').val(cropData.name);
    $('#scientificName').val(cropData.scientificName);
    $('#category').val(cropData.category);
    $('#season').val(cropData.season);
    $('#fieldDetails').val(cropData.fields);

    // Set the edit mode with the crop ID
    editCropId = cropId;

    // Show the modal with pre-filled information
    $('#addCropModal').modal('show');
});


// Delete Crop
$(document).on('click', '.delete-crop', function() {
    const cropId = $(this).closest('.col-md-4').data('crop-id');

    // Remove from cropList
    //cropList = cropList.filter(crop => crop.code !== cropId);
    const index = cropList.findIndex(crop => crop.code === cropId);
    if (index !== -1) cropList.splice(index, 1);

    // Remove crop card from the page
    $(this).closest('.col-md-4').remove();
});

function validateForm() {
    let isValid = true;


    const cropCode = $('#cropCode').val();
    if (cropCode.trim() === '') {
        alert("Crop Code is required");
        isValid = false;
    }


    const commonName = $('#commonName').val();
    if (commonName.trim() === '') {
        alert("Common Name is required");
        isValid = false;
    }


    const scientificName = $('#scientificName').val();
    if (scientificName.trim() === '') {
        alert("Scientific Name is required");
        isValid = false;
    }


    const cropImage = $('#cropImage').val();
    if (cropImage.trim() === '') {
        alert("Image URL is required");
        isValid = false;
    } else if (!isValidUrl(cropImage)) {
        alert("Please enter a valid URL for the image");
        isValid = false;
    }


    const category = $('#category').val();
    if (category.trim() === '') {
        alert("Category is required");
        isValid = false;
    }


    const season = $('#season').val();
    if (season.trim() === '') {
        alert("Season is required");
        isValid = false;
    }


    const fieldDetails = $('#fieldDetails').val();
    if (fieldDetails.trim() === '') {
        alert("Field Details are required");
        isValid = false;
    }

    return isValid;
}


function isValidUrl(url) {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
    return urlPattern.test(url);
}
