import * as common from "./common.js";
import errorCode from "./errorCode.js";

const sendBtnDOM = document.querySelector("#sendBtn");

const sendBtn = new common.ButtonManager(sendBtnDOM, trySend);

const emailInput = document.querySelector("input[name='email']");

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function init() {
    inputInteraction();
    common.backButton();
}

function inputInteraction() {
    emailInput.addEventListener("keyup", (e) => {
        common.updateInputValue(e);
        if (emailInput.value == "") sendBtn.disableBtn();
        else sendBtn.enableBtn();
    });
}

function trySend() {
    showCompletePage();
    // sendRequest();
}

function sendRequest() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            const responseBody = JSON.parse(hr.responseText);
            if (hr.status == 200) {
                requestSuccess();
            } else if (hr.status == 400) {
                if (responseBody.errorCode == errorCode.USER.EMAIL_NOT_EXISTS) {
                    ommon.giveToastNoti("존재하지 않는 이메일입니다");
                } else {
                    common.giveToastNoti(
                        "알 수 없는 이유로 전송할 수 없습니다"
                    );
                }
            } else {
                common.giveToastNoti("알 수 없는 이유로 전송할 수 없습니다");
            }
        }
    };

    hr.open(
        "POST",
        `http://localhost:8060/api/users/send_temp_pw?email=${emailInput.value}`
    );
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(JSON.stringify(data));
}

function requestSuccess() {
    showCompletePage();
}

function showCompletePage() {
    const completePage = document.querySelector("#complete");
    completePage.classList.add("active");

    // 완료 버튼
    const completeBtn = document.querySelector("#complete .full_floating_btn");
    completeBtn.addEventListener("click", (e) => {
        location.href = "login.html";
    });
}