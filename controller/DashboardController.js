$(document).ready(function () {
    $('#logOutBtn').on('click', handleLogOut);

});

function handleLogOut() {
    window.location.href = 'index.html';
}
$(document).ready(function() {
    function updateDateTime() {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        $('#date').text(` ${currentDate}`);
        $('#time').text(` ${currentTime}`);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
});


// Side navigation open close
$('#toggleSidebar').on('click', function () {
    $('#sidebar').addClass('show');
    $('#closeSidebar').addClass('show').css('color', 'black');
});

$('#closeSidebar').on('click', function () {
    $('#sidebar').removeClass('show');
});
// navigate to pages
$('#navCrops').on('click', () => {
    $('#cropsSection').css('display', 'block');
    $('#logsSection').css('display', 'none');
    $('#dashboardSection').css('display', 'none');
    $('#fieldsSection').css('display', 'none');
    $('#staffSection').css('display', 'none');
    $('#vehicleSection').css('display', 'none');
    $('#equipmentSection').css('display', 'none');
    $('#userSection').css('display', 'none');
    $('#dashboardSection').css('display', 'none');
    console.log("clicked");
});
$('#navDashboard').on('click', () => {
    $('#dashboardSection').css('display', 'block');
    $('#logsSection').css('display', 'none');
    $('#cropsSection').css('display', 'none');
    $('#fieldsSection').css('display', 'none');
    $('#staffSection').css('display', 'none');
    $('#vehicleSection').css('display', 'none');
    $('#equipmentSection').css('display', 'none');
    $('#userSection').css('display', 'none');
    console.log("clicked");
});
$('#navFields').on('click', () => {
    $('#fieldsSection').css('display', 'block');
    $('#logsSection').css('display', 'none');
    $('#dashboardSection').css('display', 'none');
    $('#cropsSection').css('display', 'none');
    $('#staffSection').css('display', 'none');
    $('#vehicleSection').css('display', 'none');
    $('#equipmentSection').css('display', 'none');
    $('#userSection').css('display', 'none');
    console.log("clicked");
});
$('#navStaff').on('click', () => {
    $('#staffSection').css('display', 'block');
    $('#fieldsSection').css('display', 'none');
    $('#logsSection').css('display', 'none');
    $('#dashboardSection').css('display', 'none');
    $('#cropsSection').css('display', 'none');
    $('#vehicleSection').css('display', 'none');
    $('#equipmentSection').css('display', 'none');
    $('#userSection').css('display', 'none');
    console.log("clicked");
});
$('#navLogs').on('click', () => {
    $('#logsSection').css('display', 'block');
    $('#staffSection').css('display', 'none');
    $('#fieldsSection').css('display', 'none');
    $('#dashboardSection').css('display', 'none');
    $('#cropsSection').css('display', 'none');
    $('#vehicleSection').css('display', 'none');
    $('#equipmentSection').css('display', 'none');
    $('#userSection').css('display', 'none');
    console.log("clicked");
});
$('#navVehicle').on('click', () => {
    $('#vehicleSection').css('display', 'block');
    $('#logsSection').css('display', 'none');
    $('#staffSection').css('display', 'none');
    $('#fieldsSection').css('display', 'none');
    $('#dashboardSection').css('display', 'none');
    $('#cropsSection').css('display', 'none');
    $('#equipmentSection').css('display', 'none');
    $('#userSection').css('display', 'none');
    console.log("clicked");
});
$('#navEquipment').on('click', () => {
    $('#equipmentSection').css('display', 'block');
    $('#vehicleSection').css('display', 'none');
    $('#logsSection').css('display', 'none');
    $('#staffSection').css('display', 'none');
    $('#fieldsSection').css('display', 'none');
    $('#dashboardSection').css('display', 'none');
    $('#cropsSection').css('display', 'none');
    $('#userSection').css('display', 'none');

    console.log("clicked");
});
$('#navUser').on('click', () => {
    $('#userSection').css('display', 'block');
    $('#equipmentSection').css('display', 'none');
    $('#vehicleSection').css('display', 'none');
    $('#logsSection').css('display', 'none');
    $('#staffSection').css('display', 'none');
    $('#fieldsSection').css('display', 'none');
    $('#dashboardSection').css('display', 'none');
    $('#cropsSection').css('display', 'none');


    console.log("clicked");
});

