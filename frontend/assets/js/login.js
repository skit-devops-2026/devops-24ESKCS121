if (StudySphere.auth()) location.href = "dashboard.html";
document.getElementById("form").onsubmit = e => {
    e.preventDefault(); const u = StudySphere.user(), email = document.getElementById("email").value.trim(), pass = document.getElementById("password").value;
    if (!u) { document.getElementById("error").textContent = "No demo account found. Please register first."; return }
    if (u.email !== email || u.password !== pass) { document.getElementById("error").textContent = "Invalid demo email or password."; return }
    localStorage.setItem("studySphereAuth", "true"); location.href = "dashboard.html";
};
