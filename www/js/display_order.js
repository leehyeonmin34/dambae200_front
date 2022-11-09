import * as common from "./common.js";

//진열순서버튼
const displayOrderBtn = document.querySelector(".display");
//전산순서버튼
const computerizedOrderBtn = document.querySelector(".computerized");
//진열순서페이지
const displayOrderPage = document.querySelector("#display_order_page");
//전산순서페이지
const computerizedOrderPage = document.querySelector("#computerized_order_page");
//편집 버튼
const editBtn = document.querySelector(".edit_icon");
//검색버튼
const searchBtn = document.querySelector(".main_header .search_icon");
//진열순서 top(일반)
const mainTop = document.querySelector(".main_header");
//진열순서 top(검색시)
const searchTop = document.querySelector(".search_header");
//검색 인풋
const searchInput = searchTop.querySelector(".main_search_input");
//담배리스트 (진열,메인)
const ciagretteListSection = document.querySelector(".cigarette_list");
//담배리스트 (진열,검색)
const ciagretteListIncludeNameSection = document.querySelector(".cigarette_list_include_name");
const ciagretteListNotIncludeNameSection = document.querySelector(".cigarette_list_not_include_name");

//진열순서이동 인풋
const movementNameInput = document.querySelector(".movement_search_input");
//해당담배뒤로이동 버튼
const movementBtn = document.querySelector(".movement_btn_container");
//담배추가 dialog에서 공식이름
const officialNameInput = document.querySelector(".official_name_input");


document.addEventListener("DOMContentLoaded", function () {
    updateCigarettListData(CIGARETTELIST_ID.CIGARETTELIST_1);

    basicInteraction();
    headerEventListner();
    displayOrderPageInteraction();
});

function basicInteraction() {
    common.backButton();
}

const CIGARETTELIST_ID = {
    CIGARETTELIST_1: 1,
};

function updateCigarettListData(ciagretteListId) {
    sessionStorage.setItem("cigaretteListId", ciagretteListId);
}

function displayOrderPageInteraction() {
    loadCigarette();
}


function headerEventListner() {

    //전산순서 버튼 클릭
    computerizedOrderBtn.addEventListener("click", (e) => {
        activeComputerizedOrderPage();
    });

    const computerizedSortButton = document.querySelector(".computerized_sort_btn");
    computerizedSortButton.addEventListener("click", (e) => {
        activeComputerizedOrderPage();
    });

    //진열순서 버튼 클릭시
    displayOrderBtn.addEventListener("click", (e) => {
        activeDisplayOrderPage();
    });

    //편집버튼 클릭시
    editBtn.addEventListener("click", () => {
        editButtonHandler();
    });

    //진열순서에서 검색버튼 클릭시
    searchBtn.addEventListener("click", () => {
        if (computerizedOrderPage.classList.contains("invisible")) {
            mainTop.classList.add("invisible");
            searchTop.classList.remove("invisible");
            cigaretteSearchInteraction();
        }
    });
}

function activeDisplayOrderPage() {
    computerizedOrderPage.classList.add("invisible");
    displayOrderPage.classList.remove("invisible");
    displayOrderPageInteraction();
}

function activeComputerizedOrderPage() {
    displayOrderPage.classList.add("invisible");
    computerizedOrderPage.classList.remove("invisible");
    computerizedOrderPageInteraction();
    var ele = document.getElementsByName('show');
    ele[0].checked = false;
    ele[1].checked = true;
}

const stopFunc = function (e) { e.preventDefault(); e.stopPropagation(); return false; };

function editButtonHandler(e) {
    //edit 버튼 색상 변경
    editBtn.classList.toggle("active_green");

    if (editBtn.classList.contains("active_green")) {
        displayOrderBtn.addEventListener("click", stopFunc, true);
        computerizedOrderBtn.addEventListener("click", stopFunc, true);
        searchBtn.addEventListener("click", stopFunc, true);
    } else {
        displayOrderBtn.removeEventListener("click", stopFunc, true);
        computerizedOrderBtn.removeEventListener("click", stopFunc, true);
        searchBtn.removeEventListener("click", stopFunc, true);
    }

    //edit 버튼이 클릭되었을때의 페이지.
    //전산순서 페이지가 선택
    if (displayOrderPage.classList.contains("invisible")) {

        const countBox = document.querySelectorAll(".count_container");
        const dragIcon = document.querySelectorAll(".drag_icon");

        var i;
        for (i = 0; i < countBox.length; i++) {
            countBox[i].classList.toggle("invisible");
        }
        for (i = 0; i < dragIcon.length; i++) {
            dragIcon[i].classList.toggle("invisible");
        }

        initDragButtonComuterizedOrder();


    } else {
        //진열순서 페이지가 선택
        const tipSection = document.querySelector(".middle");
        tipSection.classList.toggle("invisible");

        const checkBox = document.querySelectorAll(".checkbox_btn");
        const countBox = document.querySelectorAll(".count_container");
        const dragIcon = document.querySelectorAll(".drag_icon");

        var i;
        for (i = 0; i < checkBox.length; i++) {
            checkBox[i].classList.toggle("invisible");
        }
        for (i = 0; i < countBox.length; i++) {
            countBox[i].classList.toggle("invisible");
        }
        for (i = 0; i < dragIcon.length; i++) {
            dragIcon[i].classList.toggle("invisible");
        }

        const sendButton = document.querySelector(".send_btn_container");
        const editBottomButton = document.querySelector(".edit_bottom_btn_container");
        sendButton.classList.toggle("invisible");
        editBottomButton.classList.toggle("invisible");

        const addCigartteBtn = document.querySelector(".plus_btn_container");
        const moveCigaretteBtn = document.querySelector(".move_btn_container");

        addCigartteBtn.removeEventListener("click", stopFunc, true);
        moveCigaretteBtn.addEventListener("click", stopFunc, true);
        addCigartteBtn.classList.remove("inactive");
        moveCigaretteBtn.classList.add("inactive");
        document.querySelector(".toss_icon").classList.add("inactive");

        initAddCigaretteBtn();
        initDragButtonDisplayOrder();
        manageCheckboxButton();
    }
}

//드래그앤드롭 전산순서
function initDragButtonComuterizedOrder() {
    const draggables = document.querySelectorAll(".cigarette_on_list_computerized.draggable");
    const container = document.querySelector(".cigarette_lists_computerized");

    draggables.forEach(el => {
        el.addEventListener("dragstart", () => {
            el.classList.add("dragging");
        });

        el.addEventListener("dragend", () => {
            el.classList.remove("dragging");
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".cigarette_on_list_computerized.draggable:not(dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    };

    container.addEventListener("dragover", e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        container.insertBefore(draggable, afterElement)
        sessionStorage.setItem("currAfterElementCigaretteId", afterElement.id);
        sessionStorage.setItem("currDraggableCigaretteId", draggable.id);
        tryDragAndDropComuterizedOrder()
    });
}

//드래그앤드롭 진열순서
function initDragButtonDisplayOrder() {
    const draggables = document.querySelectorAll(".cigarette_on_list.draggable");
    const container = document.querySelector(".cigarette_list");

    draggables.forEach(el => {
        el.addEventListener("dragstart", () => {
            el.classList.add("dragging");
        });

        el.addEventListener("dragend", () => {
            el.classList.remove("dragging");
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".cigarette_on_list.draggable:not(dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    };

    container.addEventListener("dragover", e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        container.insertBefore(draggable, afterElement)
        sessionStorage.setItem("currAfterElementCigaretteId", afterElement.id);
        sessionStorage.setItem("currDraggableCigaretteId", draggable.id);
        tryDragAndDropDisplayOrder()

    });
}

function tryDragAndDropDisplayOrder() {
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText);
            } else {
                //common.giveToastNoti("알 수 없는 이유로 데이터를 업데이트 할수 없습니다.");
            }
        }
    };

    const data = getDragAndDropData();
    hr.open(
        "PUT",
        'https://localhost:8060/api/cigaretteOnLists/${id}/draganddrop_display'
    );
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(JSON.stringify(data));
}

function tryDragAndDropComuterizedOrder() {
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText);
            } else {
                //common.giveToastNoti("알 수 없는 이유로 데이터를 업데이트 할수 없습니다.");
            }
        }
    };

    const data = getDragAndDropData();
    hr.open(
        "PUT",
        'https://localhost:8060/api/cigaretteOnLists/${id}/draganddrop_computerized'
    );
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(JSON.stringify(data));
}

function getDragAndDropData() {
    return {
        cigaretteListId: sessionStorage.getItem("cigaretteListId"),
        afterElementId: sessionStorage.getItem("currAfterElementCigaretteId"),
        draggableId: sessionStorage.getItem("currDraggableCigaretteId"),
    };
}


/*
window.onload = function () {
    var el = document.getElementById("chk_top");
    el.onclick = manageEditBottomButton;
}

function manageEditBottomButton() {
    const addCigartteBtn = document.querySelector(".plus_btn_container");
    const moveCigaretteBtn = document.querySelector(".move_btn_container");

    //선택된 목록 가져오기 =
    const selectedElements = document.querySelectorAll('input[id="chk_top"]:checked');


    //선택된 목록의 개수
    const selectedElementsCnt = selectedElements.length;

    //출력
    document.getElementById("selected_cigarette_count").innerText = selectedElementsCnt;

    //선택된 개수가 1개이상이면 담배이동 버튼 활성화, 담배추가버튼 비활성화
    if (selectedElementsCnt > 0) {
        addCigartteBtn.addEventListener("click", stopFunc, true);
        moveCigaretteBtn.removeEventListener("click", stopFunc, true);
        addCigartteBtn.classList.add("inactive");
        moveCigaretteBtn.classList.remove("inactive");
        document.querySelector(".toss_icon").classList.remove("inactive");
         moveCigaretteBtn.addEventListener("click", () => {
            mainTop.classList.add("invisible");
            document.querySelector(".display_order_movement_search_header").classList.remove("invisible");
            ciagretteListSection.classList.add("invisible");
            document.querySelector(".movement_cigarette_list").classList.remove("invisible");
            document.querySelector(".edit_bottom_btn_container").classList.add("invisible");
            movementBtn.classList.remove("invisible");
            movementBtn.classList.add("inactive");
            movementBtn.querySelector(".toss_icon").classList.add("inactive");
            movementBtn.addEventListener("click", stopFunc, true);

            initMoveCigarettePage(selectedElements);
        });
    } else {
        addCigartteBtn.removeEventListener("click", stopFunc, true);
        moveCigaretteBtn.addEventListener("click", stopFunc, true);
        addCigartteBtn.classList.remove("inactive");
        moveCigaretteBtn.classList.add("inactive");
        document.querySelector(".toss_icon").classList.add("inactive");
        initAddCigaretteBtn();
    }
}
*/
function manageCheckboxButton() {
    common.addEventListenerToDOMbySelector(
        ".checkbox_btn_lable",
        "click",
        manageEditBottomButton
    );
}

function manageEditBottomButton(e) {
    const checkedBox = e.target.closest(".checkbox_btn");
    checkedBox.classList.toggle("checked_box");

    const selectedElements = document.querySelectorAll(".checked_box");
    const selectedElementsCnt = selectedElements.length;
    document.getElementById("selected_cigarette_count").innerText = selectedElementsCnt;

    const addCigartteBtn = document.querySelector(".plus_btn_container");
    const moveCigaretteBtn = document.querySelector(".move_btn_container");

    if (selectedElementsCnt > 0) {
        addCigartteBtn.addEventListener("click", stopFunc, true);
        moveCigaretteBtn.removeEventListener("click", stopFunc, true);
        addCigartteBtn.classList.add("inactive");
        moveCigaretteBtn.classList.remove("inactive");
        document.querySelector(".toss_icon").classList.remove("inactive");
        moveCigaretteBtn.addEventListener("click", () => {
            mainTop.classList.add("invisible");
            document.querySelector(".display_order_movement_search_header").classList.remove("invisible");
            ciagretteListSection.classList.add("invisible");
            document.querySelector(".movement_cigarette_list").classList.remove("invisible");
            document.querySelector(".edit_bottom_btn_container").classList.add("invisible");
            movementBtn.classList.remove("invisible");
            movementBtn.classList.add("inactive");
            movementBtn.querySelector(".toss_icon").classList.add("inactive");
            movementBtn.addEventListener("click", stopFunc, true);

            initMoveCigarettePage(selectedElements);
        });
    } else {
        addCigartteBtn.removeEventListener("click", stopFunc, true);
        moveCigaretteBtn.addEventListener("click", stopFunc, true);
        addCigartteBtn.classList.remove("inactive");
        moveCigaretteBtn.classList.add("inactive");
        document.querySelector(".toss_icon").classList.add("inactive");
        initAddCigaretteBtn();
    }
}



function initMoveCigarettePage(selectedElements) {
    //뒤로가기 버튼
    document.querySelector(".display_order_movement_search_header .left_icon")
        .addEventListener("click", () => {
            mainTop.classList.remove("invisible");
            document.querySelector(".display_order_movement_search_header").classList.add("invisible");
            ciagretteListSection.classList.remove("invisible");
            document.querySelector(".movement_cigarette_list").classList.add("invisible");
            document.querySelector(".edit_bottom_btn_container").classList.remove("invisible");
            movementBtn.classList.add("invisible");
        });

    //입력하는것 저장
    movementNameInput.addEventListener("keyup", common.updateInputValue);

    //검색버튼 눌렀을때
    common.addEventListenerToDOMbySelector(
        ".movement_search .search_icon",
        "click",
        loadMovementCigarette(movementNameInput.value)
    );

    movementCigaretteEventListeners(selectedElements);
}

function movementCigaretteEventListeners(selectedElements) {
    //라디오 버튼 클릭시 버튼 활성화
    common.addEventListenerToDOMbySelector(".movement_cigarette_radio_btn", "click", (e) => {
        movementBtn.classList.remove("inactive");
        movementBtn.querySelector(".toss_icon").classList.remove("inactive");
        movementBtn.removeEventListener("click", stopFunc, true);
    });


    //선택된 담배 가져오기
    const selectedCigarette = document.querySelector(".movement_cigarette_list input:checked");

    //해당담배뒤로이동 버튼 클릭시 선택된 담배들 기억해야해. //여기서부터 다시 화면 확인
    movementBtn.addEventListener("click", () => {
        tryMovement(selectedElements, selectedCigarette);
        location.href = "http://127.0.0.1:5500/pages/display_order.html";
    });
}

function tryMovement(selectedElements, selectedCigarette) {

}

function initAddCigaretteBtn() {
    addEventListenerAddCigaretteButton();
    addEventListenerAddCigaretteDialog();
}

function addEventListenerAddCigaretteButton() {
    var addCigaretteDialogScreen = document.querySelector(".add_cigarette_dialog_screen");

    //const addCigartteBtn = document.querySelector(".plus_btn_container");

    common.addEventListenerToDOMbySelector(
        ".plus_btn_container",
        "click",
        (e) => {
            common.openDialog(addCigaretteDialogScreen);
        }
    );
}

function addEventListenerAddCigaretteDialog() {
    var addCigaretteDialogScreen = document.querySelector(".add_cigarette_dialog_screen");
    var closeBtn = addCigaretteDialogScreen.querySelector(".close_icon");

    closeBtn.addEventListener("click", () => common.closeDialog(addCigaretteDialogScreen));

    inputCigaretteOfficialNameInteraction();
    //담배추가하기 버튼 눌렀을때
    manageAddCigaretteBottomButton();
}

function inputCigaretteOfficialNameInteraction() {
    //인풋 입력할때마다 값 저장
    officialNameInput.addEventListener("keyup", common.updateInputValue);
    const cigaretteDropdownSection = document.querySelector(".cigartte_dropdown_lists");


    document.querySelector(".official_name_search_input .search_icon")
        .addEventListener("click", () => {
            //드랍박스 보이게 하기
            cigaretteDropdownSection.classList.remove("invisible");
            cigaretteDropBoxInteraction();
            //드랍박스 안에 담배들 로드, 매핑
            findCigaretteByOfficialNameLike(officialNameInput.value);
        });
}

function cigaretteDropBoxInteraction() {
    var cigaretteDropBoxList = document.querySelectorAll(".cigarette_dropdown_content");
    for (var i = 0; i < cigaretteDropBoxList.length; i++) {
        //var cigarette = cigaretteDropBoxList[i];
        //cigarette.addEventListener("click", onClickCigarette);
        cigaretteDropBoxList[i].addEventListener("click", onClickCigarette);
    }
}

function onClickCigarette(e) {
    document.querySelector(".cigartte_dropdown_lists").classList.add("invisible");

    const selectedCigaretteDom = e.target.closest(".cigarette_dropdown_content");
    //선택한 담배 아이디, 간편이름 저장/ 세션에 저장
    sessionStorage.setItem("currSelectedCigaretteId", selectedCigaretteDom.id);
    sessionStorage.setItem("currCustomizedName", selectedCigaretteDom.simple_name);
    //간편이름 추가
    const simpleName = selectedCigaretteDom.simple_name;
    const customizedNameInput = document.getElementById("customized_name_input");
    customizedNameInput.value = simpleName;
    customizedNameInput.addEventListener("keyup", () => {
        common.updateInputValue();
        sessionStorage.setItem("currCustomizedName", customizedNameInput.value);
    });
}

function manageAddCigaretteBottomButton() {
    //삭제버튼 클릭시
    document.querySelector(".delete_btn_container").addEventListener("click", (e) => {
        location.href = "http://127.0.0.1:5500/pages/display_order.html";
    });
    //저장버튼 클릭시
    document.querySelector(".save_btn_container").addEventListener("click", (e) => {
        trySave();
        location.href = "http://127.0.0.1:5500/pages/display_order.html";
    });
}

function trySave() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) saveRequestSuccess();
            else {
                const json = JSON.parse(hr.responseText);
                /*
                에러 처리
                if (json.errorCode == errorCode.)
                    
                else saveRequestFailure();
                */
            }
        }
    };

    const data = getSaveData();
    hr.open(
        "POST",
        'https://localhost:8060/api/cigaretteOnLists'
    );
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(JSON.stringify(data));
}

function getSaveData() {
    return {
        cigaretteListId: sessionStorage.getItem("cigaretteListId"),
        cigaretteId: sessionStorage.getItem("currSelectedCigaretteId"),
        customizedName: sessionStorage.getItem("currCustomizedName"),
    };
}


function computerizedOrderPageInteraction() {
    loadCIgaretteByComputerizedOrder();
}


function cigaretteListEventListeners() {
    countInputInteraction();
}



function cigaretteSearchInteraction() {
    //x표시 눌렀을때
    common.addEventListenerToDOMbySelector(
        ".search_header .close_icon",
        "click",
        (e) => {
            /*
            if (mainTop.classList.contains("invisible")) {
                searchTop.classList.add("invisible");
                mainTop.classList.remove("invisible");
            }
            if (ciagretteListSection.classList.contains("invisible")) {
                ciagretteListSection.classList.remove("invisible");
                ciagretteListIncludeNameSection.classList.add("invisible");
                ciagretteListNotIncludeNameSection.classList.add("invisible");
            }
            */
            location.href = "http://127.0.0.1:5500/pages/display_order.html";
        }
    );


    //입력할때
    //searchInput.addEventListener("keyup", common.updateInputValue);
    searchInput.addEventListener("keyup", () => {
        filter();
    });

    /*
    //검색버튼 눌렀을때 찾아오기.
    common.addEventListenerToDOMbySelector(
        ".search_header .search_icon",
        "click",
        (e) => {
            if (mainTop.classList.contains("invisible")) {
                //해당담배를 찾는 로드,매핑 + 원래 있던 리스트는 안보이게
                ciagretteListSection.classList.add("invisible");
                ciagretteListIncludeNameSection.classList.remove("invisible");
                ciagretteListNotIncludeNameSection.classList.remove("invisible");
                loadCigaretteByOfficialNameLike(searchInput.value);
                loadCigaretteByOfficialNameNotLike(searchInput.value);
            }
        }
    );
    */
}

function filter() {
    var search = searchInput.value.toLowerCase();
    var listInner = document.querySelectorAll(".cigarette_on_list");

    for (let i = 0; i < listInner.length; i++) {
        if (listInner[i].querySelector(".official_name").innerHTML.toLowerCase().includes(search)) {
            listInner[i].classList.remove("invisible");
        }
        else {
            listInner[i].classList.add("invisible");
        }
    }
}

function loadCigarette() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText);
                mappingCigarettes(cigarettesJson);
                cigaretteListEventListeners();
            } else {
                //common.giveToastNoti("알 수 없는 이유로 데이터를 불러올 수 없습니다.");
            }
        }
    };
    //hr추가
    const id = sessionStorage.getItem("cigaretteListId");
    hr.open(
        "GET",
        'http://localhost:8060/api/cigaretteOnLists/${id}/display_order'
    );
    hr.send();
}


const mockCigarettesJson = {
    cigaretteOnLists: [
        {
            id: 1,
            officialName: "메비우스 LBS 블루 1MG",
            customizedName: "LBS 블루 1MG",
            count: 3,
        },
        {
            id: 2,
            officialName: "메비우스 스카이블루",
            customizedName: "메비우스 스카이블루",
            count: 5,
        },
        {
            id: 3,
            officialName: "에쎄 수",
            customizedName: "에쎄 수",
            count: 2,
        },
        {
            id: 4,
            officialName: "시즌",
            customizedName: "시즌",
            count: 12,
        },
    ],
    total: 4,
};

function mappingCigarettes(cigarettesJson) {
    const cigaretteListTemplate = common.getTemplate("#cigaretteListTemplate");

    const cigaretteOnLists = cigarettesJson.cigaretteOnLists;
    for (var key in cigaretteOnLists) {
        const {
            id,
            officialName,
            customizedName,
            count,
        } = cigaretteOnLists[key];

        const data = {
            id: id,
            official_name: officialName,
            customized_name: customizedName,
            count: count,
        };

        ciagretteListSection.innerHTML += cigaretteListTemplate(data);
    }
}

/*
function loadCigaretteByOfficialNameLike(name) {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText);
                mappingIncludeNameCigarettes(cigarettesJson, name);
                cigaretteListEventListeners();
            } else {
                // common.giveToastNoti("알 수 없는 이유로 데이터를 불러올 수 없습니다.");

            }
        }
    };

    const id = sessionStorage.getItem("cigaretteListId");
    const encodedInputValue = encodeURI(searchInput.value);

    hr.open(
        "GET",
        'http:localhost:/8060/api/cigaretteOnLists/${id}/include?name=${encodedInputValue}'
    );
    hr.send();
}

function loadCigaretteByOfficialNameNotLike(name) {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText);
                mappingIncludeNameCigarettes(cigarettesJson);
                cigaretteListEventListeners();
            } else {
                //common.giveToastNoti("알 수 없는 이유로 데이터를 불러올 수 없습니다.");

            }
        }
    };

    const id = sessionStorage.getItem("cigaretteListId");
    const encodedInputValue = encodeURI(searchInput.value);

    hr.open(
        "GET",
        'http:localhost:/8060/api/cigaretteOnLists/{id}/not_include?name=${encodedInputValue}'
    );
    hr.send();
}


function mappingIncludeNameCigarettes(cigarettesJson, name) {
    const cigaretteListTemplate = common.getTemplate("#cigaretteListTemplate");

    const cigaretteOnLists = cigarettesJson.cigaretteOnLists;
    for (var key in cigaretteOnLists) {
        const {
            id,
            officialName,
            customizedName,
            count,
        } = cigaretteOnLists[key];

        const data = {
            id: id,
            official_name: officialName,
            customized_name: customizedName,
            count: count,
        };

        if (name == officialName) {
            ciagretteListIncludeNameSection.innerHTML += cigaretteListTemplate(data);
        } else {
            ciagretteListNotIncludeNameSection.innerHTML += cigaretteListTemplate(data);
        }

    }
}
*/


function findCigaretteByOfficialNameLike(name) {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText);
                mappingDropBoxCigarettes(cigarettesJson);
                //드롭박스 선택한값 
                cigaretteDropBoxInteraction();
            } else {
                //common.giveToastNoti("알 수 없는 이유로 데이터를 불러올 수 없습니다.");

            }
        }
    };
    const encodedInputValue = encodeURI(officialNameInput.value);

    hr.open(
        "GET",
        'http:localhost:/8060/api/cigarettes/drop_box?name=${encodedInputValue}'
    );
    hr.send();
}


function mappingDropBoxCigarettes(cigarettesJson) {
    const cigaretteListDropdownSection = document.querySelector(".cigartte_dropdown_lists");
    const cigaretteTemplate = common.getTemplate("#dropdownCigatretteTemplate");

    const cigarettes = cigarettesJson.cigarettes;
    for (var key in cigarettes) {
        const {
            id,
            officialName,
            simpleName,
        } = cigarettes[key];

        const data = {
            id: id,
            official_name: officialName,
            simple_name: simpleName,
        };

        cigaretteListDropdownSection.innerHTML += cigaretteTemplate(data);
    }
}

function loadMovementCigarette(name) {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText);
                mappingMovementCigarettes(cigarettesJson);
            } else {
                //mappingMovementCigarettes(mockCigarettesJson);
                // common.giveToastNoti("알 수 없는 이유로 데이터를 불러올 수 없습니다.");

            }
        }
    };
    const encodedInputValue = encodeURI(movementNameInput.value);

    hr.open(
        "GET",
        'http:localhost:/8060/api/cigaretteOnLists/movement?name=${encodedInputValue}'
    );
    hr.send();
}

function mappingMovementCigarettes(cigarettesJson) {
    cigaretteListMovementSection = document.querySelector(".movement_cigarette_list");
    const cigaretteListTemplate = common.getTemplate("#movementCigaretteRadioButtonTemplate");

    const cigaretteOnLists = cigarettesJson.cigaretteOnLists;
    for (var key in cigaretteOnLists) {
        const {
            id,
            officialName,
            customizedName,
            count
        } = cigaretteOnLists[key];

        const data = {
            id: id,
            officialName: officialName,
            customizedName: customizedName,
        };

        cigaretteListMovementSection.innerHTML += cigaretteListTemplate(data);
    }
}


function countInputInteraction() {
    common.addEventListenerToDOMbySelector(
        ".cigarette_on_list input[type='number']",
        "click",
        conutInputButtonHandler
    );
}

function conutInputButtonHandler(e) {
    const cigaretteOnListDOM = e.target.closest(".cigarette_on_list");
    const countInput = cigaretteOnListDOM.querySelector("input[type='number']");
    countInput.addEventListener("keyup", () => common.updateInputValue);
    countInput.addEventListener("change", () => updateCount(cigaretteOnListDOM));
}

function updateCount(cigaretteOnListDOM) {
    const id = cigaretteOnListDOM.id;
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText);
            } else {
                //common.giveToastNoti("알 수 없는 이유로 데이터를 업데이트 할수 없습니다.");
            }
        }
    };

    const data = getCountData();
    hr.open(
        "PUT",
        'https://localhost:8060/api/cigaretteOnLists/${id}/update_count'
    );
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(JSON.stringify(data));
}

function getCountData() {
    return {
        count: countInput.value,
    };
}


function loadCIgaretteByComputerizedOrder() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                const cigarettesJson = JSON.parse(hr.responseText);
                mappingCigarettesByComputerizedOrder(cigarettesJson);
            } else {
                //common.giveToastNoti("알 수 없는 이유로 데이터를 불러올 수 없습니다.");
            }
        }
    };
    //hr추가
    const id = sessionStorage.getItem("cigaretteListId");
    hr.open(
        "GET",
        'http://localhost:8060/api/cigaretteOnLists/${id}/computerized_order'
    );
    hr.send();
}

function mappingCigarettesByComputerizedOrder(cigarettesJson) {
    const cigaretteListTemplate = common.getTemplate("#computerizedOrderTemplate");
    const ciagretteListSectionComputerizedOrder = document.querySelector(".cigarette_lists_computerized");

    const cigaretteOnLists = cigarettesJson.cigaretteOnLists;
    for (var key in cigaretteOnLists) {
        const {
            id,
            officialName,
            customizedName,
            count,
        } = cigaretteOnLists[key];

        const data = {
            id: id,
            official_name: officialName,
            customized_name: customizedName,
            count: count,
        };

        ciagretteListSectionComputerizedOrder.innerHTML += cigaretteListTemplate(data);
    }
}

const popupEnum = {
    DELETE_SECTION: {
        title: "해당 섹션을 영구적으로<br />삭제하시겠습니까?",
        desc:
            "해당 섹션에 포함된 담배들의 섹션 정보도 삭제 됩니다. 그래도 삭제하시겠습니까?",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "delete_section",
        action_btn_event: function (params) {
            const [setionDOM] = params;
            deleteSectionRequest(sectionDOM);
        },
    },
};


