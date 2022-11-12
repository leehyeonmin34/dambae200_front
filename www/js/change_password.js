import * as common from "./common.js";
import errorCode from "./errorCode.js";

const bottomBtn = document.querySelector("#sendBtn");
const prevInput = document.querySelector("input[name='prev_pw']");
const newInput = document.querySelector("input[name='new_pw']");
const confirmInput = document.querySelector("input[name='new_pw_confirm']");
// const ButtonManager = common.ButtonManager;
const btnManager = new common.ButtonManager(bottomBtn, trySend);

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function init() {
    inputInteraction();
    common.backButton();
}

function inputInteraction() {
    common.addEventListenerToDOMbySelector("input", "keyup", (e) => {
        common.updateInputValue(e);
        if (checkEmpty()) btnManager.disableBtn();
        else btnManager.enableBtn();
    });
}

function checkEmpty() {
    return (
        prevInput.value == "" ||
        newInput.value == "" ||
        confirmInput.value == ""
    );
}

function trySend() {
    if (validateForm()) sendRequest();
}

function sendRequest() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            const responseBody = JSON.parse(hr.responseText);
            if (hr.status == 200) {
                requestSuccess();
            } else if (hr.status == 400) {
                if (
                    responseBody.errorCode == errorCode.USER.LOGIN_INPUT_INVALID
                )
                    prevPwFail();
                else
                    common.giveToastNoti(
                        "알 수 없는 이유로 수정할 수 없습니다"
                    );
            } else if (hr.status == 401) {
                common.redirectToLogin();
            } else {
                common.giveToastNoti("알 수 없는 이유로 수정할 수 없습니다");
            }
        }
    };

    const data = getData();
    hr.open(
        "PUT",
        `http://localhost:8060/api/users/${common.getUserId()}/change_pw`
    );
    hr.setRequestHeader("Content-Type", "application/json");
    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send(JSON.stringify(data));
}

function getData() {
    return {
        oldPw: prevInput.value,
        newPw: newInput.value,
    };
}

function clearInputs() {
    prevInput.value = "";
    newInput.value = "";
    confirmInput.value = "";
}

function validateForm() {
    // 조건 비밀번호 조건 충족하는지 필요
    const reg = /^[A-Za-z0-9]{6,20}$/;

    if (newInput.value == prevInput.value) {
        samePwFail();
        return false;
    } else if (newInput.value != confirmInput.value) {
        confirmPwFail();
        return false;
    } else if (!reg.test(newInput.value)) {
        invalidNewPwFail();
    } else return true;
}

function requestSuccess() {
    btnManager.disableBtn();
    common.giveToastNoti("비밀번호가 변경되었습니다.");
    clearInputs();
}

function prevPwFail() {
    inputFail(prevInput, "이전 비밀번호가 정확하지 않습니다.");
}

function confirmPwFail() {
    inputFail(confirmInput, "비밀번호 확인이 일치하지 않습니다.");
}

function invalidNewPwFail() {
    inputFail(newInput, "비밀번호는 영문과 숫자를 포함한 6-20자여야 합니다");
}

function samePwFail() {
    inputFail(
        newInput,
        "이전 비밀번호와 동일한 비밀번호로 변경할 수 없습니다."
    );
}

function inputFail(inputDOM, msg) {
    btnManager.disableBtn();
    common.giveToastNoti(msg);
    inputDOM.focus();
}
