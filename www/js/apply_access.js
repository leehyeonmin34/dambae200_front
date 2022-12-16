import * as common from "./common.js";
import storeInfoEnum from "./storeBrand.js";
import errorCode from "./errorCode.js";

const textInput = document.querySelector("input[type='text']");
const bottomBtn = document.querySelector(".full_floating_btn");
const btnManager = new common.ButtonManager(bottomBtn, applyToStore);
document.addEventListener("DOMContentLoaded", function () {
    init();
    basicInteraction();
});

function basicInteraction() {
    common.initDialogInteraction();
    common.backButton();
    // common.radioButtonInteraction();
}

function init() {
    inputInteraction();
}

function loadStoresByNameLike(name) {
    if (name == "") {
        mappingStores({ stores: [], total: 0 });
        // mappingStores(mockStoresJson);
    } else {
        var hr = new XMLHttpRequest();
        hr.onreadystatechange = () => {
            if (hr.readyState == XMLHttpRequest.DONE) {
                if (hr.status == 200) {
                    const storesJson = JSON.parse(hr.responseText).data;
                    mappingStores(storesJson);
                    radioButtonInteraction();
                } else if (hr.status == 401) {
                    common.redirectToLogin();
                } else {
                    common.giveToastNoti(
                        "알 수 없는 이유로 검색할 수 없습니다."
                    );
                }
            }
        };
        const encodedInputValue = encodeURI(textInput.value);

        hr.open(
            "GET",
            `http://localhost:8060/api/stores?name=${encodedInputValue}`
        );
        hr.setRequestHeader("Authorization", common.getAccessToken());
        hr.send();
    }
}

function getUserId() {
    return common.getUserId();
}

const mockStoresJson = {
    stores: [
        {
            id: 1,
            name: "한국사랑점1",
            brnadCode: "SB01",
        },
        {
            id: 2,
            name: "한국사랑점2",
            brnadCode: "SB02",
        },
        {
            id: 3,
            name: "한국사랑점3",
            brnadCode: "SB03",
        },
        {
            id: 4,
            name: "한국사랑점4",
            brnadCode: "SB04",
        },
    ],
    total: 4,
};

function mappingStores(storesJson) {
    if (storesJson.total == 0) {
        btnManager.disableBtn();
    } else {
        btnManager.enableBtn();
        const storesSection = document.querySelector(".store_list");
        storesSection.innerText = "";

        const template = common.getTemplate("#storeRadioButtonTemplate");

        for (var key in storesJson.stores) {
            const { brandCode, name, id } = storesJson.stores[key];
            const brandLogoPath = common.getEnumValueByCode(
                storeInfoEnum,
                brandCode
            ).logo_path;
            const data = {
                logo_path: brandLogoPath,
                name,
                id,
            };
            storesSection.innerHTML += template(data);
        }

        storesSection.querySelector("input").checked = true;
    }
}

function radioButtonInteraction() {
    common.addEventListenerToDOMbySelector(".form_radio_btn", "click", (e) => {
        btnManager.enableBtn();
    });
}

function completePageInteraction() {
    // 완료 버튼
    document
        .querySelector("#complete .full_floating_btn")
        .addEventListener("click", (e) => (location.href = "../index.html"));
}

function applyToStore() {
    applyRequest(getCheckedStoreId(), getUserId());
}

function getCheckedStoreId() {
    return document.querySelector(".form_radio_btn input:checked").id;
}

function inputInteraction() {
    // 인풋 입력할떄마다 값 저장
    textInput.addEventListener("keyup", common.updateInputValue);

    // 검색 버튼 누르면 검색
    document
        .querySelector(".search_icon")
        .addEventListener("click", () => loadStoresByNameLike(textInput.value));
}

function applyRequest(storeId, userId) {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) applyRequestSuccess();
            else if (hr.status == 401) {
                common.redirectToLogin();
            } else {
                const json = JSON.parse(hr.responseText);
                if (
                    json.errorResponse.errorCode ==
                    errorCode.ACCESS.DUPLICATED_ACCESS_APPLY
                )
                    duplicateAccessApplyFail();
                else applyRequestFailure();
            }
        }
    };
    const data = {
        storeId,
        userId,
    };
    console.log(data);
    hr.open("POST", "http://localhost:8060/api/accesses");
    hr.setRequestHeader("Content-type", "application/json");
    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send(JSON.stringify(data));
}

function applyRequestSuccess() {
    completePageInteraction();
    showCompletePage();
}

function showCompletePage() {
    const completePage = document.querySelector("#complete");
    completePage.classList.add("active");
}

function duplicateAccessApplyFail() {
    common.giveToastNoti("이미 접근 신청된 목록입니다");
    btnManager.disableBtn();
}

function applyRequestFailure() {
    common.giveToastNoti("알 수 없는 이유로 신청에 실패했습니다");
}
