import * as common from "./common.js";
import * as displayOrder from "./display_order.js";
import * as reorder from "./reorder_sortable.js";

// 일반 모드 헤더
const mainHeader = document.querySelector(".main_header");

//진열순 페이지
const displayOrderPage = document.querySelector("#display_order_page");

const displayOrderListContainer = displayOrderPage.querySelector(
    ".cigarette_list"
);

// 전산순 페이지
const computerizedOrderPage = document.querySelector(
    "#computerized_order_page"
);

// 검색 이동 페이지
const movementPage = document.querySelector("#movement_page");

// 편집 모드 아래 버튼들
const editBottomBtnContainer = document.querySelector(
    ".edit_bottom_btn_container"
);

// 검색 이동
const movementBtnDOM = document.querySelector("#moveBtn");
const movementBtn = new common.ButtonManager(movementBtnDOM, openMovementPage);
const movementListSection = document.querySelector(".movement_cigarette_list");

// 검색 이동 헤더
const movementHeader = document.querySelector(".movement_header");

//검색 이동 인풋
const movementNameInput = document.querySelector(".movement_header input");

//해당담배뒤로이동 버튼
const execMovementBtnContainer = document.querySelector(
    "#movement_page .full_floating_btn_container"
);
const execMovementBtnDOM = document.querySelector("#execMovementBtn");
const execMovementBtn = new common.ButtonManager(execMovementBtnDOM, tryMove);

export function loadMovementCigarette() {
    mappingMovementCigarettes(getDisplayCigarettesInfo());
}

function getDisplayCigarettesInfo() {
    const displayCigars = document.querySelectorAll(".cigarette_on_list");
    const result = [];
    for (const item of displayCigars) {
        const data = {
            id: item.id,
            officialName: item.getAttribute("official_name"),
            customizedName: item.getAttribute("customized_name"),
            vertical: item.getAttribute("vertical"),
            filePathMedium: item.getAttribute("file_path_medium"),
        };
        result.push(data);
    }

    return result;
}

export function mappingMovementCigarettes(cigarettesJson) {
    movementListSection.innerHTML = "";
    const cigaretteListTemplate = common.getTemplate(
        "#movementCigaretteRadioButtonTemplate"
    );
    for (const cigar of cigarettesJson) {
        const data = displayOrder.convertCigarData(cigar);

        movementListSection.innerHTML += cigaretteListTemplate(data);
    }
}

export function openMovementPage() {
    common.hideDOM(mainHeader);
    common.hideDOM(displayOrderPage);
    common.hideDOM(computerizedOrderPage);

    common.showDOM(movementPage);
    common.showDOM(movementHeader);
    common.showDOM(execMovementBtnContainer);

    execMovementBtn.disableBtn();

    initMoveCigarettePage();
}

function closeMovementPage() {
    common.showDOM(mainHeader);
    common.showDOM(displayOrderPage);
    common.showDOM(editBottomBtnContainer);

    common.hideDOM(movementPage);
    common.hideDOM(movementHeader);
    common.hideDOM(execMovementBtnContainer);

    movementNameInput.value = "";
    movementNameInput.setAttribute("value", "");
}

function initMoveCigarettePage() {
    //뒤로가기 버튼
    document
        .querySelector(".movement_header .close_icon")
        .addEventListener("click", closeMovementPage);

    common.hideDOM(movementListSection);
    loadMovementCigarette();
    common.inputInteraction();

    movementNameInput.addEventListener("keyup", (e) => {
        if (e.target.value == "") {
            common.hideDOM(movementListSection);
        } else {
            common.showDOM(movementListSection);
            displayOrder.filter(e.target, movementListSection);
        }
    });

    movementCigaretteEventListeners();
}

function movementCigaretteEventListeners() {
    //라디오 버튼 클릭시 버튼 활성화
    common.addEventListenerToDOMbySelector(
        "#movement_page .form_radio_btn",
        "click",
        execMovementBtn.enableBtn
    );
}

function tryMove() {
    const selectedInputs = displayOrderPage.querySelectorAll(
        "input[type='checkbox']:checked"
    );

    const selectedElements = [];
    for (const input of selectedInputs) {
        selectedElements.push(input.closest("li"));
    }

    const criterionDOM = getCeterionDomOnDisplayOrderPage();

    selectedElements.sort(
        (a, b) =>
            parseInt(b.getAttribute("display_order")) -
            parseInt(a.getAttribute("display_order"))
    );
    for (const item of selectedElements) {
        const insertBeforeCigarId = criterionDOM.nextElementSibling.getAttribute(
            "id"
        );
        const movedCigarId = item.getAttribute("id");
        reorder.trySendReorderInfo(
            "display",
            0,
            0,
            insertBeforeCigarId,
            movedCigarId
        );
        insertAfter(criterionDOM, item);
    }

    execMovementSuccess();
}

function execMovementSuccess() {
    closeMovementPage();
    uncheckAll();
    displayOrder.initializeSelection();
    common.giveToastNoti(
        `${selectedElements.length}개의 담배가 이동되었습니다`
    );
}

function getCeterionDomOnDisplayOrderPage() {
    const criterionId = document
        .querySelector("#movement_page input[type='radio']:checked")
        .getAttribute("value");

    const listItems = document.querySelectorAll(".cigarette_on_list");

    for (const item of listItems) {
        if (item.getAttribute("id") == criterionId) {
            return item;
        }
    }
}

function insertAfter(referenceNode, newNode) {
    if (!!referenceNode.nextSibling) {
        referenceNode.parentNode.insertBefore(
            newNode,
            referenceNode.nextSibling
        );
    } else {
        referenceNode.parentNode.appendChild(newNode);
    }
}

function uncheckAll() {
    movementPage.querySelector("input[type='radio']:checked").checked = false;
}
