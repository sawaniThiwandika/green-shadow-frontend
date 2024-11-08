import {CropModel} from "../model/CropModel.js";
import {cropList} from "../Db/db.js";
$('#cropForm').on('submit', function(event) {
    event.preventDefault();


    if (!validateForm()) {
        return;
    }


    const cropCode = $('#cropCode').val();
    const commonName = $('#commonName').val();
    const scientificName = $('#scientificName').val();
    const cropImage = $('#cropImage').val();
    const category = $('#category').val();
    const season = $('#season').val();
    const fieldDetails = $('#fieldDetails').val();
    cropList.push(new CropModel(cropCode,commonName,scientificName,category,season,cropImage));


    const cropContainer = $('#cropContainer');
    const cropCard = `
      <div class="col-md-4">
        <div class="card">
          <img src="${cropImage}" alt="${commonName}" class="card-img-top crop-img">
          <div class="card-body">
            <h5 class="card-title">${commonName}</h5>
            <p><strong>Code:</strong> ${cropCode}</p>
            <p><strong>Scientific Name:</strong> ${scientificName}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Season:</strong> ${season}</p>
            <p><strong>Field Details:</strong> ${fieldDetails}</p>
          </div>
        </div>
      </div>
    `;

    cropContainer.append(cropCard);
    $('#cropForm')[0].reset();
    $('#addCropModal').modal('hide');
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
