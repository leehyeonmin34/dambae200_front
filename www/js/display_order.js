import * as common from "./common.js";
import mockCigarList from "./mock_cigar_list.js";
import * as reorder from "./reorder_sortable.js";
import * as movement from "./move_by_search.js";
import errorCode from "./errorCode.js";

//////////////////
// 모드 상수 선언
//////////////////

export const Mode = {
    NORMAL: 0,
    EDIT: 1,
    SEARCH: 2,
    SEARCH_BY_MOVING: 3,
};

export const Order = {
    DISPLAY: 0,
    COMPUTERIZED: 1,
};

var currMode = Mode.NORMAL;
var currOrder = Order.DISPLAY;

//////////////////
// DOM 상수 선언
//////////////////

//진열순서 페이지
const displayOrderPage = document.querySelector("#display_order_page");
//전산순서 페이지
const computerizedOrderPage = document.querySelector(
    "#computerized_order_page"
);

//진열순서 탭
const displayOrderTabDOM = document.querySelector(".display");

const displayOrderTab = new common.ButtonManager(
    displayOrderTabDOM,
    activeDisplayOrderPage
);
displayOrderTab.enableBtn();

//전산순서 탭
const computerizedOrderTabDOM = document.querySelector(".computerized");

const computerizedOrderTab = new common.ButtonManager(
    computerizedOrderTabDOM,
    activeComputerizedOrderPage
);
computerizedOrderTab.enableBtn();

//진열순서 top(일반)
const mainHeader = document.querySelector(".main_header");
//진열순서 top(검색시)
const searchHeader = document.querySelector(".search_header");

//검색 인풋
const searchInput = searchHeader.querySelector(".main_search_input");

// 팁 버튼
const tipBtnDOM = document.querySelector(".tip_btn");
const tipBtn = new common.ButtonManager(tipBtnDOM, openInitializeConfirmPopup);
tipBtn.enableBtn();

//담배리스트 (진열,메인)
export const cigaretteListSection = document.querySelector(".cigarette_list");

//담배리스트 (진열,검색)
const ciagretteListIncludeNameSection = document.querySelector(
    ".cigarette_list_include_name"
);

const ciagretteListNotIncludeNameSection = document.querySelector(
    ".cigarette_list_not_include_name"
);

// 하단 전산순 정렬 버튼
const sortBtnContainer = document.querySelector(".sort_btn_container");
const sortBtnDOM = document.querySelector("#sortBtn");
const sortBtn = new common.ButtonManager(
    sortBtnDOM,
    activeComputerizedOrderPage
);
sortBtn.enableBtn();

//검색버튼
const headerSearchIconDOM = document.querySelector(".main_header .search_icon");
const headerSearchIcon = new common.ButtonManager(
    headerSearchIconDOM,
    activeSearchMode
);
headerSearchIcon.enableBtn();

//편집 버튼
const editBtnDOM = document.querySelector(".edit_icon");
const editBtn = new common.ButtonManager(editBtnDOM, editButtonHandler);
editBtn.enableBtn();

// 편집 모드 아래 버튼들
const editBottomBtnContainer = document.querySelector(
    ".edit_bottom_btn_container"
);

// 검색 이동
const movementBtnDOM = document.querySelector("#moveBtn");
const movementBtn = new common.ButtonManager(
    movementBtnDOM,
    movement.openMovementPage
);
movementBtn.disableBtn();

// 담배 추가 "+(플러스)" 아이콘
const addCigaretteBtnDOM = document.querySelector(".plus_btn_container");
const addCigaretteBtn = new common.ButtonManager(
    addCigaretteBtnDOM,
    openAddCigaretteDialog
);

// 담배 추가 다이얼로그
var addCigaretteDialogScreen = document.querySelector(
    ".add_cigarette_dialog_screen"
);

//담배추가 dialog 검색 인풋
const officialNameInput = document.querySelector(".official_name_input");

// 담배 추가 드랍다운
const addCigaretteDropdownContainer = document.querySelector(
    ".cigarette_dropdown_list_container"
);

const addCigaretteDropdown = document.querySelector(".cigarette_dropdown_list");

// 담배 추가 간편 이름
const addCigarCustomizedNameInput = document.querySelector(
    "#customized_name_input"
);

// 담배 추가 다이얼로그 - 삭제 버튼
const deleteBtnDOM = document.querySelector("#deleteBtn");
const deleteBtn = new common.ButtonManager(deleteBtnDOM, tryDelete);
deleteBtn.enableBtn();

// 담배 추가 다이얼로그 - 저장 버튼
const saveBtnDOM = document.querySelector("#saveBtn");
const saveBtn = new common.ButtonManager(saveBtnDOM, saveBtnHandler);
saveBtn.disableBtn();

// 전산 순서 담배 리스트
export const computerizedCigaretteListSection = document.querySelector(
    ".computerized_cigarette_lists_section"
);

// socket
export var stomp;

///////////////////
// 이벤트 리스너 정의
///////////////////
document.addEventListener("DOMContentLoaded", function () {
    // updateCigaretteListData(CIGARETTELIST_ID.CIGARETTELIST_1);

    basicInteraction();
    tipInteraction();

    loadCigarette();
    // loadMockCigarettes();
    activeDisplayOrderPage();

    // 담배 추가 / 수정 드랍박스
    loadAllCigarettes();
    cigaretteDropdownInteraction();
    common.initDialogInteraction();

    // 소켓 활성화
    enableSocket();
});

function basicInteraction() {
    common.backButton();
}

///////////////////////////////
// 페이지 입장 시 값 세팅
///////////////////////////////
const STORE_ID = {
    STORE_ID_1: 1,
};

function updateCigaretteListData(storeId) {
    sessionStorage.setItem("storeId", storeId);
}

export function getStoreId() {
    return sessionStorage.getItem("storeId");
}

//////////////////////////////
// 담배 검수하는 법
//////////////////////////////
function tipInteraction() {}

//////////////////////////////
// 담배 정보 로드 및 맵핑
//////////////////////////////

function loadCigarette() {
    showLoading();
    // return mockCigarList;
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText).data;
                loadCigaretteSuccess(cigarettesJson);
            } else if (hr.status == 401) {
                common.redirectToLogin();
            } else if (hr.status == 400) {
                if (
                    responseBody.errorResponse.errorCode ==
                    errorCode.ACCESS.ACCESS_NOT_ALLOWED
                ) {
                    common.redirectToHome();
                } else {
                    common.giveToastNoti(
                        "알 수 없는 이유로 담배 목록을 불러올 수 없습니다."
                    );
                }
            } else {
                common.giveToastNoti(
                    "알 수 없는 이유로 담배 목록을 불러올 수 없습니다."
                );
            }
        }
    };
    //hr추가
    const storeId = sessionStorage.getItem("storeId");
    hr.open(
        "GET",
        `http://${
            common.env.SERVER_HOST_PORT
        }/api/cigarette_on_lists/display_order?storeId=${storeId}&requestUserId=${common.getUserId()}`
    );

    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send();
}

function loadCigaretteSuccess(json) {
    mappingCigarettes(json);
    hideLoading();
    showEmptyIfEmpty();
    removeCigaretteListEventListeners();
    cigaretteListEventListeners();
}

function loadMockCigarettes() {
    // mappingCigarettes(mockCigarList); // 10개
    mappingCigarettes(mockCigarettesJson); //200개
    cigaretteListEventListeners();
}

function hideLoading() {
    const loadingDOM = document.querySelector(".loading");
    common.hideDOM(loadingDOM);
}

function showLoading() {
    const loadingDOM = document.querySelector(".loading");
    common.showDOM(loadingDOM);
    common.hideDOM(sortBtnDOM);
    common.hideDOM(tipBtnDOM);
}

function showEmptyIfEmpty() {
    const emptyDOM = document.querySelector(".empty");
    if (cigaretteListSection.childElementCount == 0) {
        common.showDOM(emptyDOM);
        common.hideDOM(sortBtnDOM);
        common.hideDOM(tipBtnDOM);
    } else {
        common.hideDOM(emptyDOM);
        common.showDOM(sortBtnDOM);
        common.showDOM(tipBtnDOM);
    }
}

function mappingCigarettes(cigarettesJson) {
    const cigaretteOnLists = cigarettesJson.cigaretteOnLists;

    mappingDisplayOrder(cigaretteOnLists);
    mappingComputerziedOrder(cigaretteOnLists);
}

function mappingDisplayOrder(cigarettes) {
    const cigaretteListTemplate = common.getTemplate("#cigaretteListTemplate");
    for (const item of cigarettes) {
        const data = convertCigarData(item);

        cigaretteListSection.innerHTML += cigaretteListTemplate(data);
    }
}

function mappingComputerziedOrder(cigarettes) {
    const computerizedOrderTemplate = common.getTemplate(
        "#computerizedOrderTemplate"
    );

    cigarettes.sort((a, b) => a.computerizedOrder - b.computerizedOrder);

    for (const i in cigarettes) {
        const item = cigarettes[i];
        const data = convertCigarData(item);

        computerizedCigaretteListSection.innerHTML += computerizedOrderTemplate(
            data
        );

        addDivider(i);
    }
}

function addDivider(i) {
    if ((parseInt(i) + 1) % 5 == 0) {
        console.log(1000000);
        computerizedCigaretteListSection.innerHTML += `<div class="divider"></div>`;
    }
}

function updateNumberOnComputerizedOrder() {
    const displayCigars = document.querySelectorAll(".cigarette_on_list");

    const computerizedCigars = document.querySelectorAll(
        ".cigarette_on_list_computerized"
    );

    for (const item of displayCigars) {
        const value = item
            .querySelector("input[type = 'number']")
            .getAttribute("value");

        for (const comp_item of computerizedCigars) {
            if (comp_item.id == item.id) {
                comp_item.querySelector(".count_container").innerText =
                    value == "" ? "-" : value;
                break;
            }
        }
    }
}

//////////////////////////
// 진열순 - 전산순 탭 변환
//////////////////////////

function activeDisplayOrderPage() {
    currOrder = Order.DISPLAY;
    displayOrderTabActive();

    showByModeAndOrder();
    // displayOrderPageInteraction();
}

function activeComputerizedOrderPage() {
    currOrder = Order.COMPUTERIZED;
    computerizedOrderTabActive();
    updateNumberOnComputerizedOrder();
    showByModeAndOrder();

    // computerizedOrderPageInteraction();
}

function displayOrderTabActive() {
    var ele = document.getElementsByName("order_tab");
    ele[0].checked = true;
    ele[1].checked = false;
}

function computerizedOrderTabActive() {
    var ele = document.getElementsByName("order_tab");
    ele[0].checked = false;
    ele[1].checked = true;
}

////////////////////
// 기타
////////////////////

/////////////////////////
// 헤더 버튼
/////////////////////////

// 검색 버튼
function activeSearchMode() {
    common.hideDOM(mainHeader);
    common.showDOM(searchHeader);
    common.hideDOM(sortBtnContainer);
    cigaretteSearchInteraction();
}

// 현재 선택된 수
var cnt = 0;

function editButtonHandler(e) {
    // if (currMode == Mode.EDIT) reorder.trySendReorderInfo();
    // else toggleEditMode();
    toggleEditMode();
}

export function toggleEditMode() {
    //edit 버튼 색상 변경
    editBtnDOM.classList.toggle("active_green");
    cigaretteListSection.classList.toggle("edit");
    computerizedCigaretteListSection.classList.toggle("edit");

    // 모드 값 갱신
    currMode = currMode == Mode.EDIT ? Mode.NORMAL : Mode.EDIT;

    // 팁 버튼 활성/비활성화
    toggleTipBtn();

    // 선택 초기화
    initializeSelection();

    showByModeAndOrder();
}

function toggleTipBtn() {
    if (currMode == Mode.EDIT) tipBtn.disableBtn();
    else tipBtn.enableBtn();
}

function openInitializeConfirmPopup() {
    common.givePopup(initializationPopupInfo);
}

const initializationPopupInfo = {
    title: "입력된 담배 갯수를\n모두 지우시겠어요?",
    desc: "담배는 그대로 두고,\n입력된 갯수를 모두 지우게 됩니다",
    action_btn_label: "지우기",
    action_btn_color: "red",
    action_btn_event: tryInitializeCount,
};

function tryInitializeCount() {
    const data = {
        requestUserId: common.getUserId(),
        responseChannel: channel.INITIALIZE_COUNT(),
        content: {
            storeId: getStoreId(),
        },
    };

    stomp.send(
        "/pub/store/initialize_count",
        getStompHeader(),
        JSON.stringify(data)
    );

    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE) {
    //         const json = JSON.parse(hr.responseText);
    //         if (hr.status == 200) {
    //             initializeCountSuccess();
    //         } else {
    //             // 에러 처리
    //             // if (json.errorCode == errorCode.)

    //             common.giveToastNoti("알 수 없는 이유로 수행할 수 없습니다.");
    //         }
    //     }
    // };

    // const storeId = sessionStorage.getItem("storeId");
    // hr.open(
    //     "PUT",
    //     `http://${common.env.SERVER_HOST_PORT}/api/cigarette_on_lists/initialize_count?store_id=${storeId}&requestUserId=${common.getUserId()}`
    // );
    // hr.setRequestHeader("Content-Type", "application/json");
    // hr.setRequestHeader("Authorization", common.getAccessToken());
    // hr.send();
}

function initializeCountMessageHandler(message) {
    console.log("received!!!");
    console.log(message);
    const body = JSON.parse(message.body);
    console.log(body);

    if (body.status == 200) {
        initializeCountSuccess(body);
    } else if (body.status == 401) {
        common.redirectToLogin();
    } else if (hr.status == 400) {
        if (
            (hr.status == responseBody.errorResponse.errorCode) ==
            errorCode.ACCESS.ACCESS_NOT_ALLOWED
        ) {
            common.redirectToHome();
        } else {
            common.giveToastNoti(
                "알 수 없는 이유로 담배 목록을 불러올 수 없습니다."
            );
        }
    } else {
        common.giveToastNoti("알 수 없는 이유로 수행할 수 없습니다.");
    }
}

function initializeCountSuccess(body) {
    const countInputs = document.querySelectorAll(".count_container input");

    for (const input of countInputs) {
        input.value = "";
        input.setAttribute("value", "");
    }

    if (body.data.requestUserId == common.getUserId())
        common.giveToastNoti("입력된 갯수를 모두 지웠습니다");
    else common.giveToastNoti("다른 사용자에 의해 갯수가 초기화되었습니다");
}

function showByModeAndOrder() {
    initAddCigaretteBtn();

    if (currOrder == Order.COMPUTERIZED) {
        common.showDOM(computerizedOrderPage);
        common.hideDOM(displayOrderPage);
    } else {
        common.hideDOM(computerizedOrderPage);
        common.showDOM(displayOrderPage);
    }

    if (currMode == Mode.EDIT) {
        common.hideDOM(sortBtnContainer);
        enableModifyCigarInteraction();

        reorder.enableDragAndDrop();
        if (currOrder == Order.DISPLAY) {
            common.showDOM(editBottomBtnContainer);

            checkboxEventHandler();
        } else {
            common.hideDOM(editBottomBtnContainer);

            checkboxEventHandler();
        }
    } else if (currMode == Mode.NORMAL) {
        disableModifyCigarInteraction();

        common.hideDOM(editBottomBtnContainer);
        if (currOrder == Order.DISPLAY) {
            // 진열순 일반모드 일때
            common.showDOM(sortBtnContainer);
        } else {
            common.hideDOM(sortBtnContainer);
        }
    }
}

function checkboxEventHandler() {
    common.addEventListenerToDOMbySelector(
        ".checkbox_btn_lable",
        "click",
        manageEditBottomButtons
    );
}

function manageEditBottomButtons(e) {
    if (isChecked(e)) cnt -= 1;
    else cnt += 1;
    document.getElementById("selected_cigarette_count").innerText = cnt;

    if (cnt > 0) {
        addCigaretteBtn.disableBtn();
        movementBtn.enableBtn();
    } else {
        addCigaretteBtn.enableBtn();
        movementBtn.disableBtn();
        initAddCigaretteBtn();
    }
}

function isChecked(e) {
    return e.target.closest(".checkbox_btn").querySelector("input").checked;
}

//////////////////////
// 담배 추가
//////////////////////
function initAddCigaretteBtn() {
    addCigaretteBtn.enableBtn();
    addEventListenerAddCigaretteDialog();
}

function openAddCigaretteDialog() {
    initAddDialog();
    common.openDialog(addCigaretteDialogScreen);
    addCigaretteDialogScreen.classList.add("add");
}

function addEventListenerAddCigaretteDialog() {
    inputCigaretteOfficialNameInteraction();
    addCigaretteDialogButtonInteraction();
    // closeAddDialogInteraction();
}

function closeAddDialogInteraction() {
    addCigaretteDialogScreen
        .querySelectorAll(".close_icon, .escape")
        .forEach((item) => item.addEventListener("click", initAddDialog));
}

function initAddDialog() {
    const saveBtnText = saveBtnDOM.querySelector("span");
    saveBtnText.innerText = "담배 추가";

    // 공식 이름 검색 활성화
    officialNameInput.disabled = false;
    saveBtn.disableBtn();

    initDialogValue();
}

function initModifyDialog() {
    // 공식 이름 검색 비활성화
    officialNameInput.disabled = true;

    // 저장버튼 인터랙션
    saveBtn.enableBtn();

    const saveBtnText = saveBtnDOM.querySelector("span");
    saveBtnText.innerText = "저장";

    initDialogValue();
}

function initDialogValue() {
    // 입력된 값 초기화
    officialNameInput.value = "";
    addCigarCustomizedNameInput.value = "";
    document
        .querySelector(".cigarette_large_img_container img")
        .setAttribute("src", "");
}

function inputCigaretteOfficialNameInteraction() {
    //인풋 입력할때마다 값 저장
    officialNameInput.addEventListener("keyup", common.updateInputValue);

    officialNameInput.addEventListener("key", () => {});
    officialNameInput.addEventListener("keyup", (e) => {
        saveBtn.disableBtn();
        if (e.target.value == "") {
            common.hideDOM(addCigaretteDropdownContainer);
        } else {
            common.showDOM(addCigaretteDropdownContainer);
            filter(officialNameInput, addCigaretteDropdown);
        }
    });
}

function loadAllCigarettes() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            const json = JSON.parse(hr.responseText).data;
            if (hr.status == 200) {
                mappingDropdownCigarettes(json);
            } else if (hr.status == 401) {
                common.redirectToLogin();
            } else if (hr.status == 400) {
                if (
                    responseBody.errorResponse.errorCode ==
                    errorCode.ACCESS.ACCESS_NOT_ALLOWED
                ) {
                    common.redirectToHome();
                } else {
                    common.giveToastNoti(
                        "알 수 없는 이유로 담배 목록을 불러올 수 없습니다."
                    );
                }
            } else {
                // 에러 처리
                // if (json.errorCode == errorCode.)

                common.giveToastNoti("알 수 없는 이유로 수행할 수 없습니다.");
            }
        }
    };

    hr.open(
        "GET",
        `http://${
            common.env.SERVER_HOST_PORT
        }/api/cigarettes/all?requestUserId=${common.getUserId()}`
    );
    hr.setRequestHeader("Content-Type", "application/json");
    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send();
}

function cigaretteDropdownInteraction() {
    console.log(10);
    common.addEventListenerToDOMbySelector(
        ".cigarette_dropdown_list",
        "click",
        (e) => {
            // console.log(200);
            onClickDropdownCigar(e);
        }
    );
    console.log(100);
}

function onClickDropdownCigar(e) {
    console.log(10);
    common.hideDOM(addCigaretteDropdownContainer);
    saveBtn.enableBtn();

    const selectedCigaretteDom = e.target.closest(
        ".cigarette_dropdown_content"
    );

    console.log(selectedCigaretteDom);

    saveNewCigaretteInfo(selectedCigaretteDom);
    setCustomizedNameInputValue(selectedCigaretteDom);
    setOfficialNameInputValue(selectedCigaretteDom);
    setCigarImg(selectedCigaretteDom);
}

function saveNewCigaretteInfo(selectedCigaretteDom) {
    //선택한 담배 아이디, 간편이름 저장/ 세션에 저장
    sessionStorage.setItem("currSelectedCigaretteId", selectedCigaretteDom.id);
    sessionStorage.setItem(
        "currCustomizedName",
        selectedCigaretteDom.getAttribute("customized_name")
    );
}

function setCustomizedNameInputValue(selectedCigaretteDom) {
    const customizedName = selectedCigaretteDom.getAttribute("customized_name");
    addCigarCustomizedNameInput.value = customizedName;
    addCigarCustomizedNameInput.addEventListener(
        "keyup",
        common.updateInputValue
    );
}

function setOfficialNameInputValue(selectedCigaretteDom) {
    const officialName = selectedCigaretteDom.getAttribute("official_name");
    officialNameInput.setAttribute("value", officialName);
    officialNameInput.value = officialName;
}

function setCigarImg(selectedCigaretteDom) {
    const filePath = selectedCigaretteDom.getAttribute("file_path_large");
    const imgDOM = addCigaretteDialogScreen.querySelector(
        ".cigarette_large_img_container img"
    );
    imgDOM.setAttribute("src", "../img/" + filePath);
    const vertical = selectedCigaretteDom
        .querySelector(".cigar_img_container")
        .classList.contains("vertical");
    if (vertical) imgDOM.classList.add("vertical");
    else imgDOM.classList.remove("vertical");
}

function addCigaretteDialogButtonInteraction() {}

function saveBtnHandler(e) {
    if (isAddMode()) tryAdd();
    else tryModify();
    e.stopPropagation();
}

const addResponseMock = {
    status: 200,
    data: {
        id: 194,
        official_name: "말보로 하이브리드 1MG",
        customized_name: "말보로 하이브리드 1MG",
        file_name: "cigar_194.jpg",
        vertical: true,
        file_path_large: "cigar_img/large_4x/cigar_194.jpg",
        file_path_medium: "cigar_img/medium_4x/cigar_194.jpg",
        computerized_order: 11,
        display_order: 11,
    },
    error: null,
};

function isAddMode() {
    return addCigaretteDialogScreen.classList.contains("add");
}

function tryAdd() {
    // addSuccess(addResponseMock.data);

    stomp.send(
        "/pub/store/add_cigar",
        getStompHeader(),
        JSON.stringify(getAddData())
    );

    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE) {
    //         const json = JSON.parse(hr.responseText);
    //         if (hr.status == 200) {
    //             addSuccess(json);
    //         } else if (
    //             json.errorCode ==
    //             errorCode.CIGARETTE_ON_LIST.DUPLICATE_CIGARETTE_ON_LIST
    //         ) {
    //             common.giveToastNoti("이미 목록에 있는 담배입니다");
    //             saveBtn.disableBtn();
    //         } else {
    //             common.giveToastNoti("알 수 없는 이유로 수행할 수 없습니다.");
    //         }
    //     }
    // };

    // const data = getAddData();
    // hr.open("POST", "http://${common.env.SERVER_HOST_PORT}/api/cigarette_on_lists");
    // hr.setRequestHeader("Content-Type", "application/json");
    // hr.setRequestHeader("Authorization", common.getAccessToken());
    // hr.send(JSON.stringify(data));
}

function addSuccess(json) {
    // 진열순 추가
    const cigaretteListTemplate = common.getTemplate("#cigaretteListTemplate");

    const data = convertCigarData(json.content);

    cigaretteListSection.innerHTML += cigaretteListTemplate(data);

    cigaretteListSection.lastChildNode;

    // 전산순 추가
    const computerizedCigaretteListTemplate = common.getTemplate(
        "#computerizedOrderTemplate"
    );

    computerizedCigaretteListSection.innerHTML += computerizedCigaretteListTemplate(
        data
    );

    if (json.requestUserId == common.getUserId()) {
        checkboxEventHandler();

        common.closeDialog(addCigaretteDialogScreen);
        window.scrollTo({ top: 99999, behavior: "smooth" });

        removeCigaretteListEventListeners();
        cigaretteListEventListeners();
        showEmptyIfEmpty();
    }
}

function removeCigaretteListEventListeners() {
    common.removeEventListenerToDOMbySelector(
        ".cigarette_on_list input[type='number']",
        "click",
        countInputButtonHandler
    );
}

export function convertCigarData(json) {
    return {
        id: json.id,
        cigar_id: json.cigaretteId,
        vertical: json.vertical ? "vertical" : "",
        official_name: json.officialName,
        customized_name: json.customizedName,
        count: json.count == -1 ? "" : json.count,
        file_path_medium: json.filePathMedium,
        file_path_large: json.filePathLarge,
        computerized_order: json.computerizedOrder,
        display_order: json.displayOrder,
    };
}

function enableModifyCigarInteraction() {
    common.addEventListenerToDOMbySelector(
        ".cigarette_on_list .cigarette_left",
        "click",
        openModifyDialog,
        false
    );
}

function disableModifyCigarInteraction() {
    common.removeEventListenerToDOMbySelector(
        ".cigarette_on_list .cigarette_left",
        "click",
        openModifyDialog,
        false
    );
}

function targetIsInput(e) {
    return e.tagName == "INPUT";
}

function openModifyDialog(e) {
    if (targetIsInput(e)) return;
    initModifyDialog();
    addCigaretteDialogScreen.classList.remove("add");

    common.openDialog(addCigaretteDialogScreen);
    const liDOM = e.target.closest("li");

    const id = liDOM.getAttribute("id");
    const officialName = liDOM.getAttribute("official_name");
    const customizedName = liDOM.getAttribute("customized_name");
    const vertical = liDOM.getAttribute("vertical");
    const filePathLarge = liDOM.getAttribute("file_path_large");
    const imgSrc = `../img/${filePathLarge}`;

    const imgDOM = addCigaretteDialogScreen.querySelector(
        ".cigarette_large_img_container img"
    );

    imgDOM.setAttribute("src", imgSrc);
    if (vertical == "vertical") imgDOM.classList.add("vertical");
    else {
        imgDOM.classList.remove("vertical");
    }

    officialNameInput.value = officialName;
    addCigarCustomizedNameInput.value = customizedName;
    sessionStorage.setItem("currCigaretteOnListId", id);
}

function tryModify() {
    const data = getModifyData();

    stomp.send(
        "/pub/store/modify_cigar",
        getStompHeader(),
        JSON.stringify(data)
    );

    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE) {
    //         const json = JSON.parse(hr.responseText);
    //         if (hr.status == 200) modifySuccess(json);
    //         else {
    //             common.giveToastNoti("알 수 없는 이유로 수정할 수 없습니다.");
    //         }
    //     }
    // };

    // const data = getModifyData();
    // const cigaretteOnListId = sessionStorage.getItem("currCigaretteOnListId");

    // hr.open(
    //     "PUT",
    //     `http://${common.env.SERVER_HOST_PORT}/api/cigarette_on_lists/${cigaretteOnListId}`
    // );
    // hr.setRequestHeader("Content-Type", "application/json");
    // hr.setRequestHeader("Authorization", common.getAccessToken());
    // hr.send(JSON.stringify(data));
}

function getModifyData() {
    return {
        requestUserId: common.getUserId(),
        responseChannel: channel.MODIFY(),
        content: {
            customizedName: addCigarCustomizedNameInput.value,
            id: sessionStorage.getItem("currCigaretteOnListId"),
            storeId: getStoreId(),
        },
    };
}

function modifyMessageHandler(message) {
    if (JSON.parse(message.body).status == 200) modifySuccess(message);
    else if (hr.status == 400) {
        if (
            (hr.status == responseBody.errorResponse.errorCode) ==
            errorCode.ACCESS.ACCESS_NOT_ALLOWED
        ) {
            common.redirectToHome();
        } else {
            common.giveToastNoti(
                "알 수 없는 이유로 담배 목록을 불러올 수 없습니다."
            );
        }
    } else {
        common.giveToastNoti("알 수 없는 이유로 수정할 수 없습니다.");
    }
}

function modifySuccess(message) {
    const data = JSON.parse(message.body).data;
    const { requestUserId, content } = data;

    const id = content.id;
    const displayOrderItem = findCurrCigarDOM(".cigarette_on_list", id);

    const computerizedOrderItem = findCurrCigarDOM(
        ".cigarette_on_list_computerized",
        id
    );

    displayOrderItem.setAttribute("customizedName", content.customizedName);
    displayOrderItem.querySelector(".customized_name").innerText =
        content.customizedName;

    computerizedOrderItem.querySelector(".customized_name").innerText =
        content.customizedName;

    if (requestUserId == common.getUserId()) {
        common.closeDialog(addCigaretteDialogScreen);
        common.giveToastNoti("수정 완료되었습니다");
    }
}

function tryDelete() {
    const data = {
        requestUserId: common.getUserId(),
        responseChannel: channel.DELETE(),
        content: {
            storeId: getStoreId(),
            id: sessionStorage.getItem("currCigaretteOnListId"),
        },
    };

    stomp.send(
        "/pub/store/delete_cigar",
        getStompHeader(),
        JSON.stringify(data)
    );
}

function deleteMessageHandler(message) {
    const body = JSON.parse(message.body);
    if (body.status == 200) {
        deleteSuccess(message);
    } else if (hr.status == 400) {
        if (
            (hr.status == responseBody.errorResponse.errorCode) ==
            errorCode.ACCESS.ACCESS_NOT_ALLOWED
        ) {
            common.redirectToHome();
        } else {
            common.giveToastNoti(
                "알 수 없는 이유로 담배 목록을 불러올 수 없습니다."
            );
        }
    } else if (body.status == 401) {
        common.redirectToLogin();
    } else {
        common.giveToastNoti("알 수 없는 이유로 수행할 수 없습니다.");
    }
}

function deleteSuccess(message) {
    const data = JSON.parse(message.body).data;
    const { requestUserId, content } = data;
    const id = content.idList[0];
    const displayOrderItem = findCurrCigarDOM(".cigarette_on_list", id);
    const computerizedOrderItem = findCurrCigarDOM(
        ".cigarette_on_list_computerized",
        id
    );
    displayOrderItem.remove();
    computerizedOrderItem.remove();

    if (requestUserId == common.getUserId()) {
        common.closeDialog(addCigaretteDialogScreen);
        common.giveToastNoti("담배 1개가 삭제되었습니다.");
        minusSelectedNum();
    } else {
        if (
            common.dialogIsOn(addCigaretteDialogScreen) &&
            !isAddMode() &&
            sessionStorage.getItem("currCigaretteOnListId") == content.idList[0]
        ) {
            common.closeDialog(addCigaretteDialogScreen);
            common.giveToastNoti(
                "해당 담배가 다른 사용자에 의해 삭제되었습니다."
            );
            minusSelectedNum();
        }
    }
    showEmptyIfEmpty();
}

export function findCurrCigarDOM(selector, id) {
    for (const item of document.querySelectorAll(selector)) {
        if (item.id == id) return item;
    }
}

function getAddData() {
    return {
        requestUserId: common.getUserId(),
        responseChannel: channel.ADD_CIGAR(),
        content: {
            storeId: sessionStorage.getItem("storeId"),
            cigaretteId: sessionStorage.getItem("currSelectedCigaretteId"),
            customizedName: addCigarCustomizedNameInput.value,
        },
    };
}

function computerizedOrderPageInteraction() {}

function cigaretteListEventListeners() {
    countInputInteraction();
    disableModifyCigarInteraction();
}

///////////////////
// 검색
///////////////////
function cigaretteSearchInteraction() {
    //x표시 눌렀을때 검색 모드 닫기
    common.addEventListenerToDOMbySelector(
        ".search_header .close_icon",
        "click",
        exitSearchMode
    );
    searchInput.addEventListener("keyup", mainFilter);
}

function exitSearchMode() {
    cancelFilter();
    common.showDOM(mainHeader);
    common.showDOM(sortBtnContainer);
    common.hideDOM(searchHeader);
    searchInput.value = "";
}

function mainFilter() {
    if (currOrder == Order.DISPLAY) filter(searchInput, cigaretteListSection);
    else if (currOrder == Order.COMPUTERIZED);
    filter(searchInput, computerizedCigaretteListSection);
}

export function filter(input, section) {
    var search = input.value.toLowerCase();
    var listInner = section.children;

    for (const item of listInner) {
        if (
            item
                .querySelector(".official_name")
                .innerHTML.toLowerCase()
                .includes(search)
        ) {
            common.showDOM(item);
        } else {
            common.hideDOM(item);
        }
    }
}

function cancelFilter() {
    for (const item of getCurrSection().children) common.showDOM(item);
}

function getCurrSection() {
    if (currOrder == Order.DISPLAY) return cigaretteListSection;
    else return computerizedCigaretteListSection;
}

////////////////////
/// 담배 추가
////////////////////
function mappingDropdownCigarettes(cigarettesJson) {
    const cigaretteTemplate = common.getTemplate("#dropdownCigaretteTemplate");

    const cigarettes = cigarettesJson.cigarettes;
    for (const cigar of cigarettes) {
        const data = {
            id: cigar.id,
            official_name: cigar.officialName,
            customized_name: cigar.simpleName,
            file_path_medium: cigar.filePathMedium,
            file_path_large: cigar.filePathLarge,
            vertical: cigar.vertical && "vertical",
        };

        addCigaretteDropdown.innerHTML += cigaretteTemplate(data);
    }
}

////////////////
// 갯수 인풋
////////////////

function countInputInteraction() {
    common.addEventListenerToDOMbySelector(
        ".cigarette_on_list input[type='number']",
        "click",
        countInputButtonHandler
    );
}

function countInputButtonHandler(e) {
    const countInput = e.target;
    // 값 변할때마다 업데이트
    countInput.removeEventListener("keyup", common.updateInputValue);
    countInput.addEventListener("keyup", common.updateInputValue);
    // 값 입력 완료할 때마다 수정 쿼리 날림
    countInput.removeEventListener("change", tryUpdateCount);
    countInput.addEventListener("change", tryUpdateCount);
}

function tryUpdateCount(e) {
    const data = {
        count: e.target.value || -1,
    };
    const id = e.target.closest("li").id;
    updateCount(id, data);
}

function updateCount(id, data) {
    stomp.send(
        "/pub/store/cigar_num",
        getStompHeader(),
        JSON.stringify({
            responseChannel: channel.CIGAR_NUM(),
            requestUserId: common.getUserId(),
            content: {
                storeId: getStoreId(),
                cigarOnListId: id,
                num: data.count,
            },
        })
    );
}

export function uncheckAll(page) {
    cigaretteListSection
        .querySelectorAll("input[type='checkbox']")
        .forEach((DOM) => (DOM.checked = false));
}

export function initializeSelection() {
    cnt = 0;
    document.getElementById("selected_cigarette_count").innerText = cnt;
    movementBtn.disableBtn();
    addCigaretteBtn.enableBtn();
    uncheckAll(displayOrderPage);
}

export function minusSelectedNum() {
    cnt = document.querySelectorAll(
        "#display_order_page input[type='checkbox']:checked"
    ).length;
    document.getElementById("selected_cigarette_count").innerText = cnt;

    if (cnt == 0) {
        movementBtn.disableBtn();
        addCigaretteBtn.enableBtn();
    }
}

function enableSocket() {
    var sockJs = new SockJS(
        `http://${common.env.SERVER_HOST_PORT}/stomp/store`,
        null,
        {
            transports: ["websocket", "xhr-streaming", "xhr-polling"],
        }
    );

    // 1. SockJS 내부에 들고있는 stomp를 내어줌
    stomp = Stomp.over(sockJs);

    // 2. connection이 맺어지면 실행
    stomp.connect({}, function () {
        console.log("STOMP Connection");

        // 3. subscribe(path, callback)으로 메시지를 받을 수 있음
        stomp.subscribe(channel.CIGAR_NUM(), cigarNumMessageHandler);

        stomp.subscribe(channel.ADD_CIGAR(), addCigarMessageHandler);
        stomp.subscribe("/user" + channel.ADD_CIGAR(), addCigarMessageHandler);

        stomp.subscribe(channel.MODIFY(), modifyMessageHandler);
        stomp.subscribe("/user" + channel.MODIFY(), modifyMessageHandler);

        stomp.subscribe(
            channel.INITIALIZE_COUNT(),
            initializeCountMessageHandler
        );
        stomp.subscribe(
            "/user" + channel.INITIALIZE_COUNT(),
            initializeCountMessageHandler
        );

        stomp.subscribe(channel.REORDER(), reorder.reorderMessageHandler);
        stomp.subscribe(
            "/user" + channel.REORDER(),
            reorder.reorderMessageHandler
        );

        stomp.subscribe(channel.DELETE(), deleteMessageHandler);
        stomp.subscribe("/user" + channel.DELETE(), deleteMessageHandler);
    });
}

export const channel = {
    ADD_CIGAR: () => "/sub/store/" + getStoreId() + "/add_cigar",
    CIGAR_NUM: () => "/sub/store/" + getStoreId() + "/cigar_num",
    INITIALIZE_COUNT: () => "/sub/store/" + getStoreId() + "/initialize_count",
    MODIFY: () => "/sub/store/" + getStoreId() + "/modify_cigar",
    REORDER: () => "/sub/store/" + getStoreId() + "/reorder",
    DELETE: () => "/sub/store/" + getStoreId() + "/delete_cigar",
};

function cigarNumMessageHandler(message) {
    console.log(message);
    const body = JSON.parse(message.body);
    const data = body.data;
    const { requestUserId, content } = data;

    if (body.status == 200) {
        console.log(content);
        const { id, count } = content;
        modifyCigarNum(id, count);
    } else if (body.status == 401) {
        redirectToLogin();
    } else if (
        body.status == 400 &&
        body.errorResponse.errorCode == errorCode.ACCESS.ACCESS_NOT_ALLOWED
    ) {
        redirectToHome();
    } else {
        common.giveToastNoti("알 수 없는 이유로 저장되지 않습니다.");
    }
}

function modifyCigarNum(cigarOnListId, num) {
    for (const item of document.querySelectorAll(".cigarette_on_list")) {
        if (item.getAttribute("id") == cigarOnListId) {
            console.log(item.querySelector("input"));
            item.querySelector(".count_container input").value = num;
            item.querySelector(".count_container input").setAttribute(
                "value",
                num
            );
        }
    }
}

function addCigarMessageHandler(message) {
    console.log("received!!!");
    console.log(message);
    const body = JSON.parse(message.body);
    const data = body.data;

    if (body.status == 200) {
        addSuccess(data);
    } else if (
        body.errorResponse.errorCode ==
        errorCode.CIGARETTE_ON_LIST.DUPLICATE_CIGARETTE_ON_LIST
    ) {
        common.giveToastNoti("이미 목록에 있는 담배입니다");
        saveBtn.disableBtn();
    } else if (
        body.errorResponse.errorCode == errorCode.ACCESS.ACCESS_NOT_ALLOWED
    ) {
        common.redirectToHome();
    } else if (body.status == 401) {
        common.redirectToLogin();
    } else {
        common.giveToastNoti("알 수 없는 이유로 수행할 수 없습니다.");
    }
}

export function getStompHeader() {
    return {
        Authorization: common.getAccessToken(),
        "Content-Type": "application/json",
    };
}
