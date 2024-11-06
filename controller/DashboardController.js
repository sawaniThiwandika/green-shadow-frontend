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
    $('#dashboardSection').css('display', 'none');
    $('#fieldsSection').css('display', 'none');
    console.log("clicked");
});
$('#navDashboard').on('click', () => {
    $('#dashboardSection').css('display', 'block');
    $('#cropsSection').css('display', 'none');
    $('#fieldsSection').css('display', 'none');
    console.log("clicked");
});
$('#navFields').on('click', () => {
    $('#fieldsSection').css('display', 'block');
    $('#dashboardSection').css('display', 'none');
    $('#cropsSection').css('display', 'none');
    console.log("clicked");
});

