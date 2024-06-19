document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('back-button');

    if (backButton) {
        backButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/';
        });
    }
});
