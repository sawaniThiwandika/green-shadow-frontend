document.getElementById('cropForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cropCode = document.getElementById('cropCode').value;
    const commonName = document.getElementById('commonName').value;
    const scientificName = document.getElementById('scientificName').value;
    const cropImage = document.getElementById('cropImage').value;
    const category = document.getElementById('category').value;
    const season = document.getElementById('season').value;
    const fieldDetails = document.getElementById('fieldDetails').value;

/*    Create crop card*/
    const cropContainer = document.getElementById('cropContainer');
    const cropCard = document.createElement('div');
    cropCard.className = 'col-md-4';
    cropCard.innerHTML = `
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
    `;


    cropContainer.appendChild(cropCard);
    document.getElementById('cropForm').reset();
    const addCropModal = bootstrap.Modal.getInstance(document.getElementById('addCropModal'));
    addCropModal.hide();
});
