import {fieldList} from "../Db/db.js";
document.addEventListener("DOMContentLoaded", () => {
    const fieldManager = new GetAllField('fieldContainer');
    fieldManager.loadFields();
});
document.getElementById('fieldContainer').addEventListener('click', (event) => {
    if (event.target.classList.contains('update-field')) {
        const fieldCode = event.target.dataset.fieldCode;
        populateFieldForm(fieldCode);
    }
});
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

    // Prepare FormData
    const formData = new FormData();
    formData.append('fieldCode', fieldCode);
    formData.append('fieldName', fieldName);
    formData.append('fieldLocation', fieldLocation);
    formData.append('fieldSize', fieldSize);
    formData.append('fieldImage1', file1);
    formData.append('fieldImage2', file2);
    // formData.append('crops', JSON.stringify(crops));
    // formData.append('staff', JSON.stringify(staff));

    // Check if fieldCode already exists
    const existingFieldIndex = fieldList.findIndex(field => field.fieldCode === fieldCode);

    if (existingFieldIndex !== -1) {
        updateField(formData); // Call updateField for existing field
    } else {
        saveField(formData); // Call saveField for new field
    }
});
// AJAX for save
function saveField(formData) {
    $.ajax({
        url: "http://localhost:5050/api/v1/field",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("Field saved successfully", response);

            $('#fieldForm')[0].reset();
            $('#addFieldModal').modal('hide');
            $('#submitField').text('Add Field');

        },
        error: function(xhr, status, error) {
            console.error("Error saving field: ", error);
            console.error("Response text: ", xhr.responseText);
        }
    });
}

// AJAX for update
function updateField(formData) {
    $.ajax({
        url: `http://localhost:5050/api/v1/field`,
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("Field updated successfully", response);


            $('#fieldForm')[0].reset();
            $('#addFieldModal').modal('hide');
            $('#submitField').text('Add Field');

        },
        error: function(xhr, status, error) {
            console.error("Error updating field: ", error);
            console.error("Response text: ", xhr.responseText);
        }
    });
}

//AJAX for delete

function deleteField(fieldCode){

}

function populateFieldForm(fieldCode){
    console.log("fieldCode"+fieldCode);
    console.log(fieldList);

    const field = fieldList.find(f => f.fieldCode === fieldCode);

    console.log("Field    "+field);

    if (field != null) {
        document.getElementById("fieldCode").value = field.fieldCode;
        document.getElementById("fieldName").value = field.fieldName;
        document.getElementById("location").value = field.fieldLocation;
        document.getElementById("extent").value = field.fieldSize;
       // document.getElementById("crops").value = field.crops?.join(', ') || '';
       // document.getElementById("staff").value = field.staff?.join(', ') || '';
       // document.getElementById("fieldImage1").value = field.fieldImage1;
        //document.getElementById("fieldImage2").value = field.fieldImage2;
    }
}


export class GetAllField {
    constructor(containerId) {
        this.containerId = containerId;
    }

    //Ajax for get all
    async loadFields() {
        try {
            const response = await fetch("http://localhost:5050/api/v1/field", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch fields: ${response.statusText}`);
            }

            const fields = await response.json();
            console.log("Fields fetched:", fields);

            fieldList.length = 0;
            fieldList.push(...fields);

            this.renderFieldCards();
        } catch (error) {
            console.error("Error loading fields:", error);
        }
    }


    renderFieldCards() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = '';

        fieldList.forEach(field => {
            const card = document.createElement('div');
            card.className = 'col-lg-4 col-md-6 col-sm-12 mb-4'; // Grid layout for responsiveness
            console.log(field.fieldCode);

            let image1Data = `data:image/jpeg;base64,${field.fieldImage1}`;
            let image2Data = `data:image/jpeg;base64,${field.fieldImage2}`;

            card.innerHTML = `
            <div class="card">
                <!-- Bootstrap Carousel for Image Slide -->
                <div id="carouselFieldImages${field.fieldCode}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="${image1Data}" class="d-block w-100" alt="Field Image 1">
                        </div>
                        <div class="carousel-item">
                            <img src="${image2Data}" class="d-block w-100" alt="Field Image 2">
                        </div>
                    </div>
                    <!-- Carousel Controls -->
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselFieldImages${field.fieldCode}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselFieldImages${field.fieldCode}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${field.fieldName}</h5>
                    <p class="card-text"><strong>Code:</strong> ${field.fieldCode}</p>
                    <p class="card-text"><strong>Location:</strong> ${field.fieldLocation}</p>
                    <p class="card-text"><strong>Size:</strong> ${field.fieldSize} Sq. m</p>
                    <p class="card-text"><strong>Crops:</strong> ${field.crops?.join(', ') || 'N/A'}</p>
                    <p class="card-text"><strong>Staff:</strong> ${field.staff?.join(', ') || 'N/A'}</p>
                   <button class="btn btn-warning btn-sm update-field" data-bs-toggle="modal" data-bs-target="#addFieldModal" data-field-code="${field.fieldCode}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-vehicle">Delete</button>
                </div>
            </div>
        `;

            container.appendChild(card);
        });
    }

}




