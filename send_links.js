/* scrape all links */

// student block class name: WkZsyc
// detail submission tab: DC55n
// student name in above block class name: J33wTc
// hand in status class name :IMvYId
// class name: dSSknb contains field data-submission-id
var summary_submissions = document.getElementsByClassName('WkZsyc');
var detailed_submissions = document.getElementsByClassName(' zZN2Lb-Wvd9Cc VBEdtc-Wvd9Cc');

var summary_submissions_tmp = {};
for (var i = 0, l = summary_submissions.length; i < l; i++) {
    var element = summary_submissions[i];
    var student_name = element.getElementsByClassName("J33wTc")[0].textContent;
    var handin = element.getElementsByClassName("IMvYId")[0].textContent;
    var submission = element.getElementsByTagName('a')[0].href;
    if(handin !== "Handed in"){
        submission = "No Submission";
    }
    // console.log(submission);
    summary_submissions_tmp[student_name] = submission;
}

var detailed_submissions_tmp = {};

var name2click_id = {}
var click_id = 1;
for (var i = 0, l = detailed_submissions.length; i < l; i++) {
    var element = detailed_submissions[i];
    console.log(element.className);
    if (element.className != " zZN2Lb-Wvd9Cc VBEdtc-Wvd9Cc"){
        continue;
    }
    // var submission = element.getElementsByTagName('a')[0];
    var detail_url = element.href;
    var student_name = element.getElementsByClassName("YVvGBb")[0].textContent;
    // console.log(detail_url);
    detailed_submissions_tmp[student_name] = detail_url;
    name2click_id[student_name] = ":"+click_id.toString()+".t";
    click_id += 1;
}

console.log("start clicking");
// click submissions in order
for (var i = 0, l = detailed_submissions.length; i < l; i++) {
    var element = detailed_submissions[i];
    if (element.className != " zZN2Lb-Wvd9Cc VBEdtc-Wvd9Cc"){
        continue;
    }
    element.click();
    console.log(element);
}

// detailed_submissions[0].click();

console.log("name2click_id");
console.log(name2click_id);

var submissions = [];
for(var key in summary_submissions_tmp){
    submissions.push([key, summary_submissions_tmp[key], detailed_submissions_tmp[key], name2click_id[key]]);
}
console.log(submissions);

// submissions = submissions.map(function(element) {
//     // Return an anchor's href attribute, stripping any URL fragment (hash '#').
//     // If the html specifies a relative path, chrome converts it to an absolute
//     // URL.
//     var name = element.getElementsByClassName("J33wTc")[0].textContent;
//     var handin = element.getElementsByClassName("IMvYId")[0].textContent;
//     var submission = [].slice.apply(element.getElementsByTagName('a'));
//     submission = submission.map(function(element){
//         var url = element.href;
//         return url;
//     })
//     console.log(submission)
//     if(handin !== "Handed in"){
//         submission = "No Submission";
//     }
//     return [name, submission];
//   });

  
// var links = [].slice.apply(document.getElementsByTagName('a'));
// links = links.map(function(element) {
//   // Return an anchor's href attribute, stripping any URL fragment (hash '#').
//   // If the html specifies a relative path, chrome converts it to an absolute
//   // URL.
//   var href = element.href;
//   var hashIndex = href.indexOf('#');
//   if (hashIndex >= 0) {
//     href = href.substr(0, hashIndex);
//   }
//   return href;
// });

// links.sort();

// // Remove duplicates and invalid URLs.
// var kBadPrefix = 'javascript';
// for (var i = 0; i < links.length;) {
//   if (((i > 0) && (links[i] == links[i - 1])) ||
//       (links[i] == '') ||
//       (kBadPrefix == links[i].toLowerCase().substr(0, kBadPrefix.length))) {
//     links.splice(i, 1);
//   } else {
//     ++i;
//   }
// }
// Remove invalid URLs.

// for (var i = 0; i < submissions.length;) {
//   if (submissions[i] == null) {
//     submissions.splice(i, 1);
//   } else {
//     ++i;
//   }
// }

chrome.extension.sendRequest(submissions);