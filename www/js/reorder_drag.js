//
//
// deprecated code
// 이건 drag이벤트로 직접 구현한 파일인데,
// jquery sortable을 사용하기로 결정
// 참조 - js/reorder_sortable.js

import * as common from "./common.js";
import * as display_order from "./display_order.js";

/////////////////////
/// 드래그앤 드롭
/////////////////////
// 드래그앤드롭 전산순서

export function disableReorder() {
    const draggables = document.querySelectorAll(".draggable");

    draggables.forEach((el) => {
        el.removeEventListener("touchstart", addDraggingClass);

        el.removeEventListener("touchend", removeDraggingClass);
    });

    document
        .querySelector(".computerized_cigarette_lists_section")
        .removeEventListener(
            "touchmove",
            computerizedOrderItemTouchMoveHandler
        );

    document
        .querySelector(".cigarette_list")
        .removeEventListener("touchmove", displayOrderItemTouchMoveHandler);
}
function addDraggingClass(e) {
    e.target.closest(".draggable").classList.add("dragging");
}

function removeDraggingClass(e) {
    e.target.closest(".draggable").classList.remove("dragging");
}

export function initDragButtonComuterizedOrder() {
    const draggables = document.querySelectorAll(
        ".computerized_cigarette_lists_section .draggable"
    );
    const container = document.querySelector(
        ".computerized_cigarette_lists_section"
    );

    draggables.forEach((el) => {
        el.addEventListener("touchstart", addDraggingClass);

        el.addEventListener("touchend", removeDraggingClass);
    });

    container.addEventListener(
        "touchmove",
        computerizedOrderItemTouchMoveHandler
    );
}

function computerizedOrderItemTouchMoveHandler(e) {
    function getDragAfterElement(container, y) {
        const draggableElements = [
            ...container.querySelectorAll(".draggable:not(dragging)"),
        ];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    }

    const container = document.querySelector(
        ".computerized_cigarette_lists_section"
    );

    e.preventDefault();
    const yPosition = e.touches[0].clientY;
    const afterElement = getDragAfterElement(container, yPosition);
    const draggable = document.querySelector(".dragging");

    container.insertBefore(draggable, afterElement);
    sessionStorage.setItem("currAfterElementCigaretteId", afterElement.id);
    sessionStorage.setItem("currDraggableCigaretteId", draggable.id);
    tryDragAndDropComuterizedOrder();
}

//드래그앤드롭 진열순서
export function initDragButtonDisplayOrder() {
    const draggables = document.querySelectorAll(
        ".cigarette_on_list.draggable"
    );
    const container = document.querySelector(".cigarette_list");
    draggables.forEach((el) => {
        el.addEventListener("touchstart", addDraggingClass);
        el.addEventListener("touchend", removeDraggingClass);
    });
    container.addEventListener("touchmove", displayOrderItemTouchMoveHandler);
}

function displayOrderItemTouchMoveHandler(e) {
    function getDragAfterElement(container, y) {
        const draggableElements = [
            ...container.querySelectorAll(
                ".cigarette_on_list.draggable:not(dragging)"
            ),
        ];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    }

    const container = document.querySelector(".cigarette_list");

    e.preventDefault();
    const yPosition = e.touches[0].clientY;
    const afterElement = getDragAfterElement(container, yPosition);
    const draggable = document.querySelector(".dragging");
    container.insertBefore(draggable, afterElement);
    sessionStorage.setItem("currAfterElementCigaretteId", afterElement.id);
    sessionStorage.setItem("currDraggableCigaretteId", draggable.id);
    tryDragAndDropDisplayOrder();
}

export function trySendReorderInfo() {
    getReorderInfoData();
    sendReorderInfoSuccess();
}

function sendReorderInfoSuccess() {
    display_order.toggleEditMode();
}

function getReorderInfoData() {
    return mergeOrderData(getDisplayOrderData(), getComputerizedOrderData());
}

function mergeOrderData(l1, l2) {
    const result = [];
    for (const i in l1) {
        const data = {
            id: l1[i].id,
            display_order: l1[i].display_order,
            computerized_order: l2[i].computerized_order,
        };
        result.push(data);
    }
    return result;
}

function getDisplayOrderData() {
    const displayOrderItems = document.querySelectorAll("li.cigarette_on_list");
    const result = [];
    var i = 1;
    for (const item of displayOrderItems) {
        const data = {
            id: item.id,
            display_order: i,
        };
        result.push(data);
        i++;
    }
    result.sort((a, b) => a.id - b.id);
    return result;
}

function getComputerizedOrderData() {
    const computerizedOrderItems = document.querySelectorAll(
        "li.cigarette_on_list_computerized"
    );

    const result = [];
    var i = 1;
    for (const item of computerizedOrderItems) {
        const data = {
            id: item.id,
            computerized_order: i,
        };
        result.push(data);
        i++;
    }
    result.sort((a, b) => a.id - b.id);
    return result;
}

export function tryDragAndDropDisplayOrder() {
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE) {
    //         if (hr.status == 200) {
    //             const cigarettesJson = JSON.parse(hr.responseText);
    //         } else {
    //             //common.giveToastNoti("알 수 없는 이유로 데이터를 업데이트 할수 없습니다.");
    //         }
    //     }
    // };
    // const data = getDragAndDropData();
    // hr.open(
    //     "PUT",
    //     "https://localhost:8060/api/cigaretteOnLists/${id}/draganddrop_display"
    // );
    // hr.setRequestHeader("Content-Type", "application/json");
    // hr.send(JSON.stringify(data));
}

export function tryDragAndDropComuterizedOrder() {
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE) {
    //         if (hr.status == 200) {
    //             const cigarettesJson = JSON.parse(hr.responseText);
    //         } else {
    //             //common.giveToastNoti("알 수 없는 이유로 데이터를 업데이트 할수 없습니다.");
    //         }
    //     }
    // };
    // const data = getDragAndDropData();
    // hr.open(
    //     "PUT",
    //     "https://localhost:8060/api/cigaretteOnLists/${id}/draganddrop_computerized"
    // );
    // hr.setRequestHeader("Content-Type", "application/json");
    // hr.send(JSON.stringify(data));
}

export function getDragAndDropData() {
    return {
        cigaretteListId: sessionStorage.getItem("cigaretteListId"),
        afterElementId: sessionStorage.getItem("currAfterElementCigaretteId"),
        draggableId: sessionStorage.getItem("currDraggableCigaretteId"),
    };
}
//////////////////////////
///// 이 위까지 드래그앤 드롭
//////////////////////////

function startFloating(el) {
    // const floating = el.cloneNode(true);
    // floating.classList.remove("dragging");
    // floating.classList.add("dragging_container");
    // document.querySelector("body").appendChild(floating);
    // document.addEventListener("touchmove", (e) => {
    //     const mouseX = e.touches[0].pageX;
    //     const mouseY = e.touches[0].pageY;
    //     console.log(mouseX, mouseY);
    //     console.log(floating);
    //     floating.style.left = mouseX + "px";
    //     floating.style.top = mouseY + "px";
    // });
}

function endFloating(el) {}
