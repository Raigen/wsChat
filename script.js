/*jslint browser: true*/
/*global $*/
$(function () {
    'use strict';

    var content = $('#content'),
        input = $('#input'),
        status = $('#status'),

        myColor = false,
        myName = false,

        connection,
        addMessage;

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        content.html('<p>Sorry, but your browser does not support WebSockets</p>');
        input.hide();
        $('span').hide();
        return;
    }

    connection = new window.WebSocket('ws://127.0.0.1:1337');

    connection.open = function () {
        input.removeAttr('disabled');
        status.text('Choose name:');
    };

    connection.onerror = function () {
        content.html('<p>Problem</p>');
    };

    connection.onmessage = function (message) {
        var json;
        try {
            json = JSON.parse(message.data);
        } catch (e) {
            console.log('no valid JSON: ', message.data);
            return;
        }

        if (json.type === 'color') {
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input.removeAttr('disbled').trigger('focus');
        } else if (json.type === 'history') {
            // do nithong
            console.log('WIP history');
        } else if (json.type === 'message') {
            input.removeAttr('disabled');
            addMessage(json.data.author, json.data.text,
                       json.data.color, new Date(json.data.time));
        } else {
            console.log('strange JSON: ', json);
        }
    };

    input.on('keydown', function (e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }

            connection.send(msg);
            $(this).val('').attr('disabled', 'disabled');

            if (!myName) {
                myName = msg;
            }
        }
    });

    addMessage = function (author, message, color, dt) {
        content.prepend('<p><span style="color: ' + color + '">'
                        + author + '</span> @ ' + dt.getHours() + ':' + dt.getMinutes()
                        + ': ' + message + '</p>');
    };
});
