import * as common from "/www/js/common.js";
import errorCode from "/www/js/errorCode.js";

const loginBtnDOM = document.querySelector("#login_btn");
const signUpBtnDOM = document.querySelector("#sign_up_btn");
const forgotPwBtnDOM = document.querySelector("a");
const emailInput = document.querySelector("input[name='email']");
const pwInput = document.querySelector("input[name='pw']");

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function init() {
    btnInteraction();
}

function btnInteraction() {
    const loginBtn = new common.ButtonManager(loginBtnDOM, tryLogin);
    const signUpBtn = new common.ButtonManager(
        signUpBtnDOM,
        () => (location.href = "/www/pages/login/sign_up.html")
    );

    loginBtn.enableBtn();
    signUpBtn.enableBtn();
}

function tryLogin() {
    if (validateForm()) {
        sendRequest();
    }
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
                    responseBody.errorCode ==
                    errorCode.USER.LOGIN_INFO_NOT_MATCHED
                )
                    prevPwFail();
                else
                    common.giveToastNoti(
                        "알 수 없는 이유로 로그인할 수 없습니다"
                    );
            } else
                common.giveToastNoti("알 수 없는 이유로 로그인할 수 없습니다");
        }
    };

    const data = getData();
    hr.open("POST", `http://localhost:8060/api/login`);
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(JSON.stringify(data));
}

function getData() {
    return {
        email: emailInput.value,
        pw: pwInput.value,
    };
}

function validateForm() {
    // 이메일, 비밀번호 조건 충족하는지
    const reg = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;

    if (!reg.test(emailInput.value)) {
        emailFail();
        return false;
    } else if (pwInput.value == "") {
        emptyPwFail();
        return false;
    } else return true;
}

function requestSuccess() {
    location.href = "/www/pages/index.html";
}

function emailFail() {
    inputFail(emailInput, "이메일 형식으로 입력해주세요");
}

function emptyPwFail() {
    inputFail(pwInput, "비밀번호를 입력해주세요");
}

function loginFail() {
    inputFail(pwInput, "일치하는 회원 정보가 없습니다");
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
    common.giveToastNoti(msg);
    inputDOM.focus();
}
