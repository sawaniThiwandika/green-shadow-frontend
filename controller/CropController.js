import {cropList,fieldList} from "../Db/db.js";
let selectedFieldListOfCrop = [];
let editCropId = null;
$(document).ready(function () {
    const fieldManager = new GetAllCrop('cropContainer');
    fieldManager.loadCrop();

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
            updateCrop(cropCode,formData); // Update existing crop
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

    function updateCrop(cropCode,formData) {

        $.ajax({
            url: `http://localhost:5050/api/v1/crop/${cropCode}`,
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
    document.getElementById('cropContainer').addEventListener('click', (event) => {
        if (event.target.classList.contains('update-crop')) {
            selectedFieldListOfCrop.length=0;
            const cropCode = event.target.dataset.cropCode;
            console.log("Crop code:",cropCode)
            populateCropForm(cropCode);
        }
        if (event.target.classList.contains('delete-crop')) {
            const cropCode = event.target.dataset.cropCode;
            deleteCrop(cropCode);
        }
    });
    function populateCropForm(cropCode){
        selectedFieldListOfCrop.length=0;
        console.log("cropCode"+cropCode);
        console.log(cropList);

        const crop = cropList.find(c => c.code=== cropCode);

        console.log("Crop   "+crop);
        if (crop!= null) {
            document.getElementById("cropCode").value = crop.code;
            document.getElementById("commonName").value = crop.name;
            document.getElementById("scientificName").value =crop.scientificName;
            document.getElementById("category").value =crop.category;
            document.getElementById("season").value = crop.season;
            //document.getElementById("cropImage").value = crop.image;
            document.getElementById("fieldDetailsCrop").value = crop.fields;
            if (crop.fields && typeof crop.fields === "object") {
                selectedFieldListOfCrop.push(...Object.values(crop.fields));
            }
        }
    }
    async function deleteCrop(cropCode){

        console.log("Delete crop code:"+cropCode);
        const fieldManager = new GetAllCrop('cropContainer');
        const confirmDelete = confirm("Are you sure you want to delete this crop?");
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5050/api/v1/crop/${cropCode}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete crop: ${response.statusText}`);
            }
            console.log(`Field with code ${cropCode} deleted successfully.`);

            cropList = cropList.filter(crop => crop.cropCode!== cropCode);

            await fieldManager.loadFields();

            alert("Crop deleted successfully!");
        } catch (error) {
            console.error("Error deleting crop:", error);
            alert("Failed to delete the crop. Please try again later.");
        }

    }

});

export class GetAllCrop {
    constructor(containerId) {
        this.containerId = containerId;
    }
    async loadCrop() {
        try {
            const response = await fetch("http://localhost:5050/api/v1/crop", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch crops: ${response.statusText}`);
            }

            const crops = await response.json();
            console.log("Crops fetched:", crops);

           cropList.length = 0;
            cropList.push(...crops);

            this.renderCropCards();
        } catch (error) {
            console.error("Error loading crops:", error);
        }
    }

    renderCropCards() {

        console.log("")
        const container = document.getElementById(this.containerId);
        container.innerHTML = '';

        cropList.forEach(crop => {
            const card = document.createElement('div');
            card.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';

            const cropImageSrc = crop.image
                ? `data:image/jpeg;base64,${crop.image}`
                : 'default-image-path.jpg';

            card.innerHTML = `
            <div class="card h-100">
                <img src="${cropImageSrc}" class="card-img-top" alt="${crop.name}">
                <div class="card-body">
                    <h5 class="card-title">${crop.name}</h5>
                    <p class="card-text"><strong>Scientific Name:</strong> ${crop.scientificName}</p>
                    <p class="card-text"><strong>Category:</strong> ${crop.category}</p>
                    <p class="card-text"><strong>Season:</strong> ${crop.season}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-warning btn-sm update-crop" data-bs-toggle="modal" 
                        data-bs-target="#addCropModal" data-crop-code="${crop.code}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-crop" data-crop-code="${crop.code}"> Delete </button>
                </div>
            </div>
        `;

            container.appendChild(card);
        });
    }

}

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
