document.getElementById("public").innerHTML = StudySphere.publicNav();
document.getElementById("footer").innerHTML = StudySphere.footer();
document.querySelectorAll(".faq-q").forEach(q => q.onclick = () => q.parentElement.classList.toggle("open"));
