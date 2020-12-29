chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // modify the input text field
      for(var click_id in request.message){
          var invitation = request.message[click_id];
          var textbox = document.getElementById(click_id);
          textbox.innerHTML = invitation; 
      }
      // remove the default input text
      var textboxes = document.getElementsByClassName('bswVrf Lzdwhd-BrZSOd');
      for(var i = 0; i < textboxes.length; i++){
        textboxes[i].style['display'] = "none";
      }
  });
