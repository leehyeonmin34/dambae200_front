import * as common from "./common.js";
import accessEnum from "./accessType.js";
import storeInfoEnum from "./storeBrand.js";

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const common = require("./js");
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
// document.addEventListener("deviceready", onDeviceReady, false);

const storeManageDialog = document.querySelector("#store_manage_modal");
const popup = document.querySelector("#popup");

document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    headerEventListner();
    initStoreUnit();
    initialAddStoreUnit();
});

function initStoreUnit() {
    loadMyStores_mock();
    storeEventListener();
    initStoreManageUnit();
}

function basicInteraction() {
    common.initDialogInteraction();
}

// HEADER
function headerEventListner() {
    var top = document.querySelector(".top");
    window.addEventListener("scroll", () => {
        //스크롤을 할 때마다 로그로 현재 스크롤의 위치가 찍혀나온다.
        if (window.scrollY > 290) {
            top.classList.add("scrolled");
        } else {
            top.classList.remove("scrolled");
        }
    });

    common.addEventListenerToDOMbySelector(
        ".header .noti_icon",
        "click",
        (e) => {
            location.href =
                "http://127.0.0.1:5500/www/pages/notifications.html";
        }
    );
    common.addEventListenerToDOMbySelector(
        ".header .setting_icon",
        "click",
        (e) => {
            location.href = "http://127.0.0.1:5500/www/pages/settings.html";
        }
    );
}

// STORE CARDS -- LOADING

function loadMyStores() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
            var storesJson = JSON.parse(hr.responseText).stores;
            mappingStoreData(stores);
            // initStoreManageUnit();
        }
    };
    hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    hr.send();
}

function storeEventListener() {}

function initStoreManageUnit() {
    // // 매장관리 DIALOG

    // SEE_MORE_BUTTON
    common.addEventListenerToDOMbySelector(
        ".store_cards .more_icon",
        "click",
        seeMoreButtonHandler
    );

    initStoreCloseButton();
}

function seeMoreButtonHandler(e) {
    const storeDOM = e.target.closest(".store_card");
    initStoreManageDialog(storeDOM);
    common.openDialog(storeManageDialog);
}

function initStoreManageDialog(storeDOM) {
    // -- CLOSE
    const closeBtn = storeManageDialog.querySelector(".close_icon");
    closeBtn.addEventListener("click", () => {
        common.closeDialog(storeManageDialog);
        console.log(10);
    });

    // -- 접근권한 관리하기
    storeManageDialog
        .querySelector(".manage_access")
        .addEventListener(
            "click",
            () =>
                (location.href =
                    "http://127.0.0.1:5500/www/pages/manage_accesses.html")
        );

    // -- 매장 정보 수정하기
    storeManageDialog
        .querySelector(".modify_info")
        .addEventListener(
            "click",
            () =>
                (location.href =
                    "http://127.0.0.1:5500/www/pages/modify_store_info.html")
        );

    // -- 삭제하기
    storeManageDialog
        .querySelector(".delete_store")
        .addEventListener("click", (e) => {
            common.givePopup(popupEnum.DELETE_STORE, [storeDOM]);
        });
}

function initStoreCloseButton() {
    common.addEventListenerToDOMbySelector(
        ".store_card.accessible .close_icon",
        "click",
        (e) => giveStorePopup(e, popupEnum.LOSE_ACCESS)
    );
    common.addEventListenerToDOMbySelector(
        ".store_card.waiting .close_icon",
        "click",
        (e) => giveStorePopup(e, popupEnum.WITHDRAW_ACCESS)
    );
    common.addEventListenerToDOMbySelector(
        ".store_card.inaccessible .close_icon",
        "click",
        removeDeniedStore
    );
}

function loadMyStores_mock() {
    const storesJson = {
        stores: [
            {
                id: 1,
                name: "서울사랑점1",
                brand: {
                    code: "SB01",
                    desc: "씨유",
                },
                access: "AT04",
            },
            {
                id: 2,
                name: "한국사랑점2",
                brand: {
                    code: "SB02",
                    desc: "지에스25",
                },
                access: "AT03",
            },
            {
                id: 3,
                name: "한국사랑점3",
                brand: {
                    code: "SB03",
                    desc: "이마트24",
                },
                access: "AT03",
            },

            {
                id: 4,
                name: "한국사랑점4",
                brand: {
                    code: "SB04",
                    desc: "세븐일레븐",
                },
                access: "AT03",
            },
            {
                id: 5,
                name: "한국사랑점5",
                brand: {
                    code: "SB05",
                    desc: "미니스톱",
                },
                access: "AT03",
            },
            {
                id: 6,
                name: "한국사랑점6",
                brand: {
                    code: "SB06",
                    desc: "스토리웨이",
                },
                access: "AT02",
            },
            {
                id: 7,
                name: "한국사랑점7",
                brand: {
                    code: "SB99",
                    desc: "무명 브랜드",
                },
                access: "AT01",
            },
        ],
        total: 6,
    };
    mappingStoreData(storesJson.stores);
}

function mappingStoreData(stores) {
    var storeCardSection = document.querySelector(".store_cards");

    var storeCardTemplate = common.getTemplate("#storeCardTemplate");

    // TODO
    // if (storesJson.total == 0){
    //     data = {

    //     }
    // }
    for (var key in stores) {
        var { id, name, brand, access } = stores[key];
        var storeInfo = common.getEnumValueByCode(storeInfoEnum, brand.code);
        var { code, background, logo_path } = storeInfo;
        var accessInfo = common.getEnumValueByCode(accessEnum, access);
        var data = {
            id: id,
            storeName: name,
            storeBrand: code,
            bgColor: background,
            storeIconUrl: logo_path,
            accessType: accessInfo.desc,
            store_tag: accessInfo.store_tag,
        };
        storeCardSection.innerHTML += storeCardTemplate(data);
    }
}

// function addBasicEventListenerToStoreMenu() {
//     common.addEventListenerToDOMbySelector(".store_card .menu_item", "click", (e) => {
//         common.hideDOM(e.target.closest(".menu"));
//         common.setZ(escapeScreen, ESC_DOWN_Z);
//     });
// }

function giveStorePopup(e, popupInfo) {
    var storeDOM = e.target.closest(".store_card");
    common.givePopup(popupInfo, [storeDOM]);
}

function deleteStoreByAccessId(id) {
    console.log(`access id ${id} 에 해당하는 store has been deleted`);
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         json = JSON.parse(hr.responseText);
    //         console.log(json);
    //     }
    // };
    // hr.open("DELETE", `http://localhost:8060/api/stores?accessId=${id}`);
    // hr.send();
}

function removeDeniedStore(e) {
    var storeDOM = e.target.closest(".store_card");
    var accessId = storeDOM.getAttribute("id");

    deleteAccessById(accessId);
    common.hideDOM(storeDOM);
    common.giveToastNoti("1개의 매장을 목록에서 제거했습니다");
}

function deleteAccessById(id) {
    console.log(`access id ${id} has been deleted`);
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         json = JSON.parse(hr.responseText);
    //         console.log(json);
    //     }
    // };
    // hr.open("DELETE", `http://localhost:8060/api/accesses/${id}`);
    // hr.send();
}

// 매장 추가 SECTION
function initialAddStoreUnit() {
    addEventListenerAddStoreButton();
    addEventListerStoreDialog();
}

function addEventListenerAddStoreButton() {
    var dialogScreen = document.querySelector(".add_store_dialog_screen");

    common.addEventListenerToDOMbySelector(
        ".add_store_container",
        "click",
        (e) => {
            common.openDialog(dialogScreen);
        }
    );
}

function addEventListerStoreDialog() {
    var dialogScreen = document.querySelector(".add_store_dialog_screen");
    var closeBtn = dialogScreen.querySelector(".close_icon");
    var createStoreBtn = dialogScreen.querySelector(".create_btn");
    var applyBtn = dialogScreen.querySelector(".apply_btn");

    closeBtn.addEventListener("click", () => common.closeDialog(dialogScreen));

    createStoreBtn.addEventListener(
        "click",
        () =>
            (location.href =
                "http://127.0.0.1:5500/www/pages/create_a_store.html")
    );
    applyBtn.addEventListener(
        "click",
        () =>
            (location.href =
                "http://127.0.0.1:5500/www/pages/apply_for_store.html")
    );
}

const popupEnum = {
    DELETE_STORE: {
        title: "담배 목록을 영구적으로<br />삭제하시겠습니까?",
        desc:
            "해당 담배 목록을 영원히 삭제하고, 기존 접근 권한자들 또한 접근이 불가합니다. 정렬정보와 기존 권한자들의 권한을 유지하려면, 관리자 권한 인계가 선행되어야합니다. 그래도 삭제하시겠습니까?",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "delete_store",
        action_btn_event: function (params) {
            const [storeDOM] = params;
            const accessId = storeDOM.getAttribute("id");
            deleteStoreByAccessId(accessId);
            common.hideDOM(storeDOM);
            common.giveToastNoti("매장 1개를 삭제했습니다");
            common.closeDialog(storeManageDialog);
        },
    },
    LOSE_ACCESS: {
        title: "담배 목록을 지우시겠어요?",
        desc:
            "해당 담배 목록에 대한 열람/편집 권한을 잃게 됩니다. 그래도 삭제하시겠어요?",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "lose_access",
        action_btn_event: function (params) {
            const [storeDOM] = params;
            const accessId = storeDOM.getAttribute("id");
            deleteAccessById(accessId);
            common.hideDOM(storeDOM);
            common.giveToastNoti("1개의 매장을 목록에서 제거했습니다");
        },
    },
    WITHDRAW_ACCESS: {
        title: "접근 신청을 철회하시겠어요?",
        desc:
            "해당 담배 목록에 대한 열람/편집 권한을 포기하고 목록에서 지우게 됩니다.",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "withdraw",
        action_btn_event: function (params) {
            const [storeDOM] = params;
            const accessId = storeDOM.getAttribute("id");
            deleteAccessById(accessId);
            common.hideDOM(storeDOM);
            common.giveToastNoti("1개의 매장을 목록에서 제거했습니다");
        },
    },
};
