$(document).ready(function () {

    function updateNotes(thisElement) {
        // Gets the current request id
        console.log("pressed")
        const noteId = thisElement.data("target");
        const $newNote = $(`#add-note-${noteId}`).val().trim();
        // Sends PUT
        function sendPut(newNote) {
            $.ajax({
                method: "PUT",
                url: "/api/updaterequest",
                data: { "id": `${noteId}`, "note": newNote },
                success: () => {
                    // Appends new note to notes list
                    $(`#notes-list-${noteId} ul`).append(`<li><span class="bold">${currentUser}:</span> ${$newNote}</li>`);
                    // Updates original notes object so it contains the new note
                    originNotes.find(id => id.id === `${noteId}`).note = newNote;
                    // Clears note input field 
                    $(`#add-note-${noteId}`).val("");
                }
            });
        }
        // Ensures note input is not empty
        if ($newNote !== "") {
            // Finds the original notes string for corresponding id
            const thisOriginNotes = originNotes.find(id => id.id === `${noteId}`);
            // Converts original notes string to JSON object
            const originNotesObj = JSON.parse(thisOriginNotes.note);
            // Adds new note to the original notes object
            originNotesObj.push({ "user": currentUser, "note": $newNote });
            // Sends stringified notes object (original notes object + new note object)
            sendPut(JSON.stringify(originNotesObj));
        }
    }

    // Checks if notes submit has been pressed
    $('.submit-note-btn').on('click', function () {
        updateNotes($(this));
    });

    // Check if notes has been submitted with enter press
    $('.notes-input').on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            updateNotes($(this));
        }
    });

    // Requests
    $(".request-block").each(function (index) {
        if ($(this).data("status") === "Alert") {
            $(this).find(".request-header").css("backgroundColor", "rgba(255, 0, 0, 0.2)");
            $(this).find(".alert-btn").css("display", "none");
            $(this).find(".resolved-btn").css("display", "block");
        } else if ($(this).data("status") === "Complete") {
            $(this).find(".request-header").css("backgroundColor", "rgba(0, 0, 0, 0.144)");
            $(this).find(".request-header").css("color", "rgba(0, 0, 0, 0.5)");
            $(this).find(".complete-btn").css("display", "none");
            $(this).find(".edit-btn").css("display", "none");
            $(this).find(".incomplete-btn").css("display", "block");
            $(this).find(".archive-btn").css("display", "block");
        }
    })

    // Check if request has been clicked
    $('.card-header').on('click', function () {
        let $collapseTarget = $(this).data("target");
        console.log($collapseTarget)
        $($collapseTarget).collapse("toggle");
    });

    // DEFAULT VALUES
    let currentRequestCount = 0;
    let checkRequests;

    // CHECK FIRST TIME
    $.ajax({
        method: "GET",
        url: "/api/countrequests",
        success: (results) => {
            // SET INITIAL COUNT
            tempRequestCount = parseInt(results);
            currentRequestCount = tempRequestCount;
            // SET TIMER
            checkRequests = setInterval(checkNewRequests, 60000);
        }
    });

    // CHECK FOR NEW REQUESTS
    function checkNewRequests() {
        $.ajax({
            method: "GET",
            url: "/api/countrequests",
            success: (results) => {
                tempRequestCount = parseInt(results);

                if (tempRequestCount > currentRequestCount) {

                    if ($('.newrequestsalert~').contents().length == 0) {

                        newButton = $("<button>");
                        newButton.attr("class", "btn btn-success ml-auto mb-3 refresh");
                        newButton.html('<i class="fa fa-bell"></i> New requests')

                        $('.newrequestsalert').append(newButton);
                    }
                }
                currentRequestCount = tempRequestCount;
            }
        });
    }

    // REFRESH PAGE BUTTON
    $(document.body).on('click', ".refresh", function (e) {
        location.reload();
    });

})