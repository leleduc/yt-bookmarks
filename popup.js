import { getActiveTabURL } from './utils.js';

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTitleElement = document.createElement('div');
  const newBookmarkElement = document.createElement('div');
  const controlElement = document.createElement('div');

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = 'bookmark-title';

  controlElement.className = 'bookmark-controls';

  newBookmarkElement.id = 'bookmark-' + bookmark.time;
  newBookmarkElement.className = 'bookmark';
  newBookmarkElement.setAttribute('timestamp', bookmark.time);

  setBookmarkAttributes('play', onPlay, controlElement);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlElement);

  bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById('bookmarks');
  bookmarksElement.innerHTML = 'hello';

  //   console.log(currentBookmarks);

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row" >No bookmark to show</i>';
  }
};

const onPlay = async (e) => {
  //   console.log(e);
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute('timestamp');
  const activeTab = await getActiveTabURL();

//   console.log(bookmarkTime);

  chrome.tabs.sendMessage(activeTab.id, {
    type: 'PLAY',
    value: bookmarkTime,
  });
};

const onDelete = (e) => {};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement('img');

  controlElement.src = 'assets/' + src + '.png';
  controlElement.title = src;
  controlElement.addEventListener('click', eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener('DOMContentLoaded', async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split('?')[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get('v');

  //   console.log(activeTab.url.includes('youtube.com/watch'));

  if (activeTab.url.includes('youtube.com/watch') && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName('container')[0];

    container.innerHTML =
      '<div class"title">This is not a youtube video page.</div>';
  }
});
