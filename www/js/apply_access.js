import * as common from "./common.js";
import storeInfoEnum from "./storeBrand.js";

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
    bottomButtomInteraction();
}

function loadStoresByNameLike(name) {
    mappingStores(mockStoresJson);

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

const mockStoresJson = {
    stores: [
        {
            id: 1,
            name: "한국사랑점1",
            brand: {
                code: "SB01",
                desc: "씨유",
            },
        },
        {
            id: 2,
            name: "한국사랑점2",
            brand: {
                code: "SB02",
                desc: "지에스25",
            },
        },
        {
            id: 3,
            name: "한국사랑점3",
            brand: {
                code: "SB03",
                desc: "이마트24",
            },
        },
        {
            id: 4,
            name: "한국사랑점4",
            brand: {
                code: "SB04",
                desc: "세븐일레븐",
            },
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
            const { brand, name, id } = storesJson.stores[key];
            const brandLogoPath = common.getEnumValueByCode(
                storeInfoEnum,
                brand.code
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

function bottomButtomInteraction() {
    // 완료 버튼
    document
        .querySelector("#complete .full_floating_btn")
        .addEventListener(
            "click",
            (e) => (location.href = "http://127.0.0.1:5500/www")
        );
}

function applyToStore() {
    const checkedStore = document.querySelector(
        ".form_radio_btn input:checked"
    );
    applyRequest(checkedStore.id);
}

function inputInteraction() {
    // 인풋 입력할떄마다 값 저장
    textInput.addEventListener("keyup", common.updateInputValue);

    // 검색 버튼 누르면 검색
    document
        .querySelector(".search_icon")
        .addEventListener("click", () => loadStoresByNameLike(textInput.value));
}

function applyRequest(storeId) {
    console.log(`storeId ${storeId}에 신청되었습니다.`);
    showCompletePage();
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

function showCompletePage() {
    const completePage = document.querySelector("#complete");
    completePage.classList.add("active");
}
