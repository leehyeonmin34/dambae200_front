import * as common from "./common.js";
import errorCode from "./errorCode.js";

const emailValidDOM = document.querySelector("#email_valid_btn");
const nicknameValidDOM = document.querySelector("#nickname_valid_btn");
const sendBtnDOM = document.querySelector("#sendBtn");

const emailValidBtn = new common.ButtonManager(emailValidDOM, validateEmail);
const nicknameValidBtn = new common.ButtonManager(
    nicknameValidDOM,
    validateNickname
);

const sendBtn = new common.ButtonManager(sendBtnDOM, trySend);

const emailInput = document.querySelector("input[name='email']");
const nicknameInput = document.querySelector("input[name='nickname']");
const pwInput = document.querySelector("input[name='pw']");
const pwConfirmInput = document.querySelector("input[name='pw_confirm']");

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
        if (checkEmpty()) sendBtn.disableBtn();
        else sendBtn.enableBtn();
    });

    emailInput.addEventListener("keyup", (e) => {
        common.updateInputValue(e);
        if (emailValidDOM.classList.contains("disabled"))
            emailValidBtn.enableBtn();
    });

    nicknameInput.addEventListener("keyup", (e) => {
        common.updateInputValue(e);
        if (nicknameValidDOM.classList.contains("disabled"))
            nicknameValidBtn.enableBtn();
    });

    emailValidBtn.enableBtn();
    nicknameValidBtn.enableBtn();
}

function checkEmpty() {
    return (
        emailInput.value == "" ||
        nicknameInput.value == "" ||
        pwInput.value == "" ||
        pwConfirmInput.value == ""
    );
}

function trySend() {
    if (validateForm()) {
        sendRequest();
    }
}

function sendRequest() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                requestSuccess();
            } else common.giveToastNoti("알 수 없는 이유로 수정할 수 없습니다");
        }
    };

    const data = getData();
    hr.open("POST", `http://${common.env.SERVER_HOST_PORT}/api/users`);
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(JSON.stringify(data));
}

function getData() {
    return {
        email: emailInput.value,
        nickname: nicknameInput.value,
        pw: pwInput.value,
        pw_confirm: pwConfirmInput.value,
    };
}

function validateEmail() {
    const reg = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;

    if (!reg.test(emailInput.value)) {
        inputFail(emailInput, "이메일 형식에 맞게 입력해주세요");
        emailValidBtn.enableBtn();
    } else inputDuplicate("email", emailInput, "exists_by_email");
}

function enableValidBtn(btnDOM) {}

function validateNickname() {
    if (nicknameInput.value == "") {
        inputFail(nicknameInput, "닉네임을 입력해주세요");
        nicknameValidBtn.enableBtn();
    } else inputDuplicate("nickname", nicknameInput, "exists_by_nickname");
}

function inputDuplicate(field, inputDOM, api) {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            // const response = hr.responseText;
            const responseBody = JSON.parse(hr.responseText);
            const data = responseBody.data;
            console.log(responseBody);
            if (responseBody.status == 200) {
                if (field == "nickname") {
                    if (data == false) nicknameValidBtn.disableBtn();
                    else {
                        console.log(data);
                        nicknameValidBtn.enableBtn();
                        inputFail(nicknameInput, "중복된 닉네임입니다.");
                    }
                } else if (field == "email") {
                    if (data == false) emailValidBtn.disableBtn();
                    else {
                        emailValidBtn.enableBtn();
                        inputFail(emailInput, "중복된 이메일입니다.");
                    }
                } else {
                    common.giveToastNoti(
                        "알 수 없는 이유로 확인할 수 없습니다."
                    );
                }
            } else {
                console.log(10);
                common.giveToastNoti("알 수 없는 이유로 확인할 수 없습니다.");
            }
        }
    };

    const data = getData();
    hr.open(
        "GET",
        `http://${common.env.SERVER_HOST_PORT}/api/users/${api}?${field}=${inputDOM.value}`
    );
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(JSON.stringify(data));
}

function validateForm() {
    // 조건 비밀번호 조건 충족하는지 필요
    const reg = /^[A-Za-z0-9]{6,20}$/;

    if (!emailValidDOM.classList.contains("disabled")) {
        inputFail(emailInput, "이메일 중복확인을 해주세요");
    } else if (!nicknameValidDOM.classList.contains("disabled")) {
        inputFail(nicknameInput, "닉네임 중복확인을 해주세요");
    } else if (pwInput.value != pwConfirmInput.value) {
        confirmPwFail();
        return false;
    } else if (!reg.test(pwInput.value)) {
        invalidNewPwFail();
    } else return true;
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

function confirmPwFail() {
    inputFail(pwConfirmInput, "비밀번호 확인이 일치하지 않습니다.");
}

function invalidNewPwFail() {
    inputFail(pwInput, "비밀번호는 영문과 숫자를 포함한 6-20자여야 합니다");
}

function inputFail(inputDOM, msg) {
    sendBtn.disableBtn();
    common.giveToastNoti(msg);
    inputDOM.focus();
}
