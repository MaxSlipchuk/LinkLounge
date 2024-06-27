$(document).ready(function() {
    const btnCreate = $('.btn-create');
    const deleteButtons = $('.delete');
    const exitButtons = $('.exit');
    const modalCreate = $('#modal-create-group');
    const modalDelete = $('#modal-delete-group');
    const modalExit = $('#modal-exit-group');
    const popupBg = $('#popup-bg');
    const closeModalCreate = $('#close-modal-create-group');
    const closeModalDelete = $('#close-modal-delete-group');
    const closeModalExit = $('#close-modal-exit-group');
    const btnYes = $('#btn-yes');
    const btnNo = $('#btn-no');
    const btnExitYes = $('#btn-exit-yes');
    const btnExitNo = $('#btn-exit-no');
    const modalGroupname = $('#modal-groupname');
    const modalExitGroupname = $('#modal-exit-groupname');
    const deleteGroupIdInput = $('#delete-group-id');
    const exitGroupIdInput = $('#exit-group-id');

    btnCreate.on('click', function() {
        modalCreate.addClass('show');
        popupBg.addClass('show');
    });

    deleteButtons.each(function() {
        $(this).on('click', function() {
            const groupId = $(this).data('group-id');
            const groupName = $(this).data('group-name');

            deleteGroupIdInput.val(groupId);
            modalGroupname.text(groupName);

            modalDelete.addClass('show');
            popupBg.addClass('show');
        });
    });

    exitButtons.each(function() {
        $(this).on('click', function() {
            const groupId = $(this).data('group-id');
            const groupName = $(this).data('group-name');

            exitGroupIdInput.val(groupId);
            modalExitGroupname.text(groupName);

            modalExit.addClass('show');
            popupBg.addClass('show');
        });
    });

    const closeModalElements = [popupBg, closeModalCreate, closeModalDelete, closeModalExit, btnNo, btnYes, btnExitNo, btnExitYes];
    $.each(closeModalElements, function(index, element) {
        $(element).on('click', function() {
            modalCreate.removeClass('show');
            modalDelete.removeClass('show');
            modalExit.removeClass('show');
            popupBg.removeClass('show');
        });
    });

    btnYes.on('click', function(event) {
        event.preventDefault();
        const groupId = deleteGroupIdInput.val();

        $.ajax({
            url: '/delete_group_ajax/',
            type: 'POST',
            data: {
                group_id: groupId,
                csrfmiddlewaretoken: $('[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                if (response.status === 'success') {
                    $(`[data-group-id="${groupId}"]`).closest('.group-item').remove();
                    modalDelete.removeClass('show');
                    popupBg.removeClass('show');
                } else {
                    console.error(response.message);
                }
            },
            // error: function(xhr, status, error) {
            //     console.error('Error:', error);
            // }
        });
    });

    btnExitYes.on('click', function(event) {
        event.preventDefault();
        const groupId = exitGroupIdInput.val();

        $.ajax({
            url: '/exit_group_ajax/',
            type: 'POST',
            data: {
                group_id: groupId,
                csrfmiddlewaretoken: $('[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                if (response.status === 'success') {
                    $(`[data-group-id="${groupId}"]`).closest('.group-item').remove();
                    modalExit.removeClass('show');
                    popupBg.removeClass('show');
                } else {
                    console.error(response.message);
                }
            },
            // error: function(xhr, status, error) {
            //     console.error('Error:', error);
            // }
        });
    });
});
