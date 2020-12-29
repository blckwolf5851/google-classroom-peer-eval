var allLinks = [];
var visibleLinks = [];
var name2submission = {};

// Display all submissions.
function showLinks() {
  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 1) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1])
  }
  for (var i = 0; i < visibleLinks.length; ++i) {
    var row = document.createElement('tr');
    var col0_checkbox = document.createElement('td');
    var col1_name = document.createElement('td');
    var col2_submission = document.createElement('td');

    var checkbox = document.createElement('input');
    checkbox.checked = true;
    checkbox.type = 'checkbox';
    checkbox.id = 'check' + i;
    col0_checkbox.appendChild(checkbox);
    
    col1_name.innerText = visibleLinks[i][0];
    col1_name.style.whiteSpace = 'nowrap';


    col2_submission.innerText = visibleLinks[i][1];
    col2_submission.style.whiteSpace = 'nowrap';

    row.appendChild(col0_checkbox);
    row.appendChild(col1_name);
    row.appendChild(col2_submission);
    linksTable.appendChild(row);
  }
}

// Toggle the checked state of all visible links.
function toggleAll() {
  var checked = document.getElementById('toggle_all').checked;
  for (var i = 0; i < visibleLinks.length; ++i) {
    document.getElementById('check' + i).checked = checked;
  }
}

// redistribute asisgnments
function redistributeCheckedSubmissions() {
  console.log("run redistribution");
  // get checked students
  var available_students = [];
  for (var i = 0; i < visibleLinks.length; ++i) {
    if (document.getElementById('check' + i).checked) {
      available_students.push(visibleLinks[i])
    }
  }
  // prepare invitation string and random shuffle
  var submission2invitation = {};
  for (var i = 0; i < available_students.length; ++i) {
    var cur_name = available_students[i][0];
    var cur_click_id = available_students[i][3];
    var next_name = available_students[(i+1) % available_students.length][0];
    var next_submission = available_students[(i+1) % available_students.length][1];

    var invitation = "Hi " + cur_name +". You are invited to peer review " + next_name + "'s submission in this link: " + next_submission;
    submission2invitation[cur_click_id] = invitation;
  }
  // redistribute let content handle
  console.log("submission2invitation");
  console.log(submission2invitation);
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
        chrome.tabs.executeScript(activeTabs[0].id, {file: 'content.js'}, function() {
            chrome.tabs.sendMessage(activeTabs[0].id, {message: submission2invitation});
        });
    });
  });
}


// Add links to allLinks and visibleLinks, sort and show them.  send_links.js is
// injected into all frames of the active tab, so this listener may be called
// multiple times.
chrome.extension.onRequest.addListener(function(submissions) {
  if(allLinks.length > 0 ){
      return null;
  }
  for (var index in submissions) {
    var name = submissions[index][0];
    var submission = submissions[index][1];
    var detail_submission = submissions[index][2];
    var click_id = submissions[index][3];
    name2submission[name] = [submission, detail_submission, click_id];
    allLinks.push(submissions[index]);
  }
  visibleLinks = allLinks;
  showLinks();
});

// Set up event handlers and inject send_links.js into all frames in the active
// tab.
window.onload = function() {
  document.getElementById('toggle_all').onchange = toggleAll;
  document.getElementById('redistribute').addEventListener("click", redistributeCheckedSubmissions);

  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'send_links.js', allFrames: true});
    });
  });
};