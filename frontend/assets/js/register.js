if (StudySphere.auth()) location.href = "dashboard.html";
document.getElementById("form").onsubmit = e => {
    e.preventDefault(); const name = document.getElementById("name").value.trim(), email = document.getElementById("email").value.trim(), p = document.getElementById("password").value, c = document.getElementById("confirm").value;
    if (p !== c) { document.getElementById("error").textContent = "Passwords do not match."; return }
    localStorage.setItem("studySphereUser", JSON.stringify({ name, email, password: p })); localStorage.setItem("studySphereAuth", "true"); location.href = "dashboard.html";
};
