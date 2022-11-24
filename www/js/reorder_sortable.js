import * as common from "./common.js";
import * as displayOrder from "./display_order.js";

export function enableDragAndDrop() {
    // 진열 순서 드래그앤 드랍
    $(".cigarette_list").sortable({
        axis: "y",
        appendTo: ".cigarette_list",
        handle: ".drag_icon",
        opacity: 0.9,
        classes: {
            "ui-sortable-helper": "dragging",
        },
        forceHelperSize: true,
        forcePlaceholderSize: true,
        revert: 150,
        scrollSensitivity: 150,
        scrollSpeed: 5,
        containment: ".page_contents_with_header1",
        placeholder: "sortable_placeholder",
    });

    // 전산 순서 드래그앤 드랍
    $(".computerized_cigarette_lists_section").sortable({
        axis: "y",
        appendTo: ".computerized_cigarette_lists_section",
        handle: ".drag_icon",
        opacity: 0.9,
        classes: {
            "ui-sortable-helper": "dragging",
        },
        forceHelperSize: true,
        forcePlaceholderSize: true,
        revert: 150,
        scrollSensitivity: 150,
        scrollSpeed: 10,
        containment: ".computerized_cigarette_lists_section",
        placeholder: "sortable_placeholder",
    });
}

export function trySendReorderInfo() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            const json = JSON.parse(hr.responseText);
            if (hr.status == 200) {
                sendReorderInfoSuccess();
            } else {
                // 에러 처리
                // if (json.errorCode == errorCode.)

                common.giveToastNoti("알 수 없는 이유로 수행할 수 없습니다.");
            }
        }
    };

    const data = getReorderInfoData();

    hr.open("PUT", "http://localhost:8060/api/cigarette_on_lists/reorder");
    hr.setRequestHeader("Content-Type", "application/json");
    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send(JSON.stringify(data));
}

function sendReorderInfoSuccess() {
    // 일단은 DOM의 순서정보 attribute는 수정하지 않음 (굳이 안해도 될 것 같기도 해서)

    // 디바이더 전부 삭제 후 다시 달아줌
    displayOrder.computerizedCigaretteListSection
        .querySelectorAll(".divider")
        .forEach((item) => item.remove());

    const compItems = document.querySelectorAll(
        ".cigarette_on_list_computerized"
    );

    for (const i in compItems) {
        const curr = compItems[i];

        if (parseInt(i) % 5 == 0 && i != 0) {
            const dividerDOM = document.createElement("div");
            dividerDOM.classList.add("divider");
            displayOrder.computerizedCigaretteListSection.insertBefore(
                dividerDOM,
                curr
            );
        }
    }

    displayOrder.toggleEditMode();
}

function getReorderInfoData() {
    return mergeOrderData(getDisplayOrderData(), getComputerizedOrderData());
}

function mergeOrderData(l1, l2) {
    const result = [];
    for (const key in l1) {
        const data = {
            id: l1[key].id,
            display_order: l1[key].display_order,
            computerized_order: l2[key].computerized_order,
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
