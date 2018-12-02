var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('http://101.132.149.225:8888/sockjs');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        // stompClient.send("/app/login", {}, JSON.stringify({'userName': $("#userName").val()})

        stompClient.subscribe('/topic/greetings', function (greeting) {
            // showMessages(JSON.parse(greeting.body).content);
            showMessages(greeting.body);
        });
        stompClient.subscribe('/topic/chat', function (message) {
            // showMessages(JSON.parse(message.body).content);
            console.log("receive message from /topic/chat: " + message.body)
            showMessages(message.body);
        });
        stompClient.subscribe('/user/queue/reply', function (reply) {
            // showMessages(JSON.parse(reply.body).content);
            showMessages(reply.body);
        });
        stompClient.subscribe('/user/queue/login', function (reply) {
            // showMessages(JSON.parse(reply.body).content);
            showMessages(reply.body);
        });
        stompClient.subscribe('/queue/reply/bill', function (reply) {
            console.log("receive message: " + reply.body)
            // showMessages(JSON.parse(reply.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendUserName() {
    stompClient.send("/app/login", {}, JSON.stringify({'nick': $("#userName").val()}));
}

function sendContent() {
    var content = $("#content");
    stompClient.send("/app/chat", {}, content.val());
    content.val('');
}

function showMessages(message) {
    // console.log(message)
    var message_element = $("#messages");
    message_element.append("<tr><td>" + message + "</td></tr>");
    message_element.scrollTop(message_element[0].scrollHeight);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    $("#sendUserName").click(function () {
        sendUserName();
    });
    $("#sendContent").click(function () {
        sendContent();
    });
});

