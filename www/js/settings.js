import { backButton } from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
    backButton();

    const profileBtn = document.querySelector("#profileBtn");
    const passwordBtn = document.querySelector("#passwordBtn");

    profileBtn.addEventListener("click", () => {
        location.href = "http://127.0.0.1:5500/www/pages/modify_profile.html";
    });

    passwordBtn.addEventListener("click", () => {
        location.href = "http://127.0.0.1:5500/www/pages/change_password.html";
    });
});
