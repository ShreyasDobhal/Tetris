console.log("Background running");

chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab) {
    let msg={
        txt:"clicked"
    };
    chrome.tabs.sendMessage(tab.id,msg);
    
}