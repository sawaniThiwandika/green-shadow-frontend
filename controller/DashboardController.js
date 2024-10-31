document.querySelector('#logOutBtn').addEventListener('click', handleLogOut);
document.querySelector('#navCrops').addEventListener('click', navigateCrops);
function handleLogOut(){
    window.location.href = 'index.html';
}
function navigateCrops(){
    window.location.href = 'crops.html';
}
