'use strict';

chrome.storage.local.get('jokes', function(data) {
    createTable(data.jokes);
});

var createTable = function (mailData) {
    var tableElement = document.createElement('table');
    mailData.map(mail => {
        var row = tableElement.insertRow();
        row.setAttribute('data-thread-id', mail.id);

        var cellTitle = row.insertCell();
        cellTitle.textContent = mail.subject;

        var cellStatus = row.insertCell();
        cellStatus.textContent = 'Pending';
    });
    document.body.appendChild(tableElement);
}