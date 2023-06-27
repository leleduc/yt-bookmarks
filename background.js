chrome.tabs.onUpdated.addListener((tabId, tab) => {
  tab = chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs) {
      tab = tabs[0];
      //   console.log(tab.url);

      if (tab.url && tab.url.includes('youtube.com/watch')) {
        const queryParameters = tab.url.split('?')[1];
        const urlParameters = new URLSearchParams(queryParameters);

        // console.log(queryParameters);

        chrome.tabs.sendMessage(tabId, {
          type: 'NEW',
          videoId: urlParameters.get('v'),
        });
      }
    }
  );
});
