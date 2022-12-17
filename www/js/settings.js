import * as common from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
    common.enableBackBtnTo("../index.html");
    common.initDialogInteraction();

    const profileBtn = document.querySelector("#profileBtn");
    const passwordBtn = document.querySelector("#passwordBtn");
    const logoutBtn = document.querySelector("#logout");

    profileBtn.addEventListener("click", () => {
        location.href = "modify_profile.html";
    });

    passwordBtn.addEventListener("click", () => {
        location.href = "change_password.html";
    });

    logoutBtn.addEventListener("click", showLogoutPopup);

    function showLogoutPopup() {
        const popupInfo = {
            title: "로그아웃 하시겠어요?",
            desc: "",
            action_btn_label: "로그아웃",
            action_btn_color: "red",
            action_btn_event: sendLogoutRequest,
        };

        common.givePopup(popupInfo);
    }

    function sendLogoutRequest() {
        var hr = new XMLHttpRequest();
        hr.onreadystatechange = () => {
            if (hr.readyState == XMLHttpRequest.DONE) {
                if (hr.status == 200) {
                    location.href = "login.html";
                } else {
                    common.giveToastNoti(
                        "네트워크 문제로 로그아웃을 처리할 수 없습니다."
                    );
                }
            }
        };
        hr.open("POST", `http://${common.env.SERVER_HOST_PORT}/api/logout`);
        hr.setRequestHeader("Authorization", common.getAccessToken());
        hr.send();
    }
});
