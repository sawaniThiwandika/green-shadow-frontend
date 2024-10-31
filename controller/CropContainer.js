$('#cropForm').on('submit', function(event) {
    event.preventDefault();

    const cropCode = $('#cropCode').val();
    const commonName = $('#commonName').val();
    const scientificName = $('#scientificName').val();
    const cropImage = $('#cropImage').val();
    const category = $('#category').val();
    const season = $('#season').val();
    const fieldDetails = $('#fieldDetails').val();

    /* Create crop card */
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
