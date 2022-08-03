import * as common from "./common.js";
import storeInfoEnum from "./storeBrand.js";

const storeNameInput = document.querySelector("input[type='text']");
const bottomBtn = document.querySelector(".full_floating_btn");
const btnManager = new common.ButtonManager(bottomBtn, tryCreate);
document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    init();
});

function basicInteraction() {
    common.initDialogInteraction();
    common.backButton();
    // common.radioButtonInteraction();
}

function init() {
    loadStores();
    inputInteraction();
    radioButtonInteraction();
    completePageInteraction();
}

function loadStores() {
    const storesSection = document.querySelector(".store_list");

    const template = common.getTemplate("#storeRadioButtonTemplate");

    Object.values(storeInfoEnum).forEach((store) => {
        const data = {
            brand_code: store.code,
            logo_path: store.logo_path,
            brand_name: store.name,
        };
        storesSection.innerHTML += template(data);
    });

    storesSection.querySelector("input").checked = true;
}

function radioButtonInteraction() {
    common.addEventListenerToDOMbySelector(".form_radio_btn", "click", (e) => {
        if (!checkEmpty()) btnManager.enableBtn();
    });
}

function checkEmpty() {
    return storeNameInput.value == "";
}

function completePageInteraction() {
    // 완료 버튼
    const completeBtn = document.querySelector("#complete .full_floating_btn");
    completeBtn.addEventListener("click", (e) => {
        location.href = "http://127.0.0.1:5500/www";
    });
}

function inputInteraction() {
    storeNameInput.addEventListener("keyup", (e) => {
        common.updateInputValue(e);
        if (checkEmpty()) btnManager.disableBtn();
        else btnManager.enableBtn();
    });
}

function getFormData() {
    const checkedBrandCode = document.querySelector(".store_list input:checked")
        .value;
    return {
        name: storeNameInput.value,
        brand_code: checkedBrandCode,
    };
}

function tryCreate() {
    if (!validateForm()) {
        common.giveToastNoti("이미 있는 이름입니다");
        btnManager.disableBtn();
        storeNameInput.focus();
    } else {
        postRequest();
        showCompletePage();
    }
}

function showCompletePage() {
    const completePage = document.querySelector("#complete");
    completePage.classList.add("active");
}

function postRequest() {
    console.log(`생성 되었습니다.`);
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         var storesJson = JSON.parse(hr.responseText).stores;
    //         // initStoreManageUnit();
    //     }
    // };
    //
    // hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    // hr.send();
}

function validateForm() {
    const data = getFormData();
    // console.log(data);
    // console.log(`validation 되었습니다.`);

    return true;

    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         var storesJson = JSON.parse(hr.responseText).stores;
    //         // initStoreManageUnit();
    //     }
    // };
    //
    // hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    // hr.send();
}
