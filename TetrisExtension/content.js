chrome.runtime.onMessage.addListener(gotMessage);


function gotMessage(message,sender,sendResponse) {
    console.log(message.txt);
    if (message.txt==="clicked") {
        console.log("Started");
    }
}