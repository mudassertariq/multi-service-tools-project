
(function () {
    const token = localStorage.getItem('token');
    const user  = JSON.parse(localStorage.getItem('user') || 'null');

    // Agar token ya user nahi hai toh login page par bhejo
    if (!token || !user) {
        window.location.href = 'login.html';
    }
})();