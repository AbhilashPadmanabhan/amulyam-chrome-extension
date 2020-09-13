var BATCH_SIZE = 5;
var tempLogs = [];
chrome.storage.local.get('jokes', (data) => {
    sendRequestsInBatch(data.jokes);
});

var sendRequestsInBatch = function (mails, batchNum) {
    batchNum = (batchNum) ? batchNum : 0;

    var beginIdx = batchNum * BATCH_SIZE;
    var batchOfMails = mails.slice(beginIdx, beginIdx + BATCH_SIZE);

    if (batchOfMails.length) {
        var batchPromises = batchOfMails.map(mail => viewJoke(mail));
        Promise.all(batchPromises).then(() => {
            sendRequestsInBatch(mails, batchNum + 1);
        }).catch(() => {
            sendRequestsInBatch(mails, batchNum + 1);
        });
    } else {
        console.log(tempLogs);
    }
}

var viewJoke = function (mail) {
    return $.ajax({
        url: mail.link,
        method: 'GET',
        success: function (data) {
            var $data = $(data);
            var $jokeForm = $data.find('form[action*=amulyam]');
            submitJoke(mail, $jokeForm);
        },
        error: function (err) {
            console.error('Failure: ', mail.id, mail.subject, mail.link);
            tempLogs.push(['Failure', mail.id, mail.subject, mail.link]);
        }
    });
};

var submitJoke = function (mail, $jokeForm) {

    $.ajax({
        type: "POST",
        url: $jokeForm.attr('action'),
        contentType: 'application/x-www-form-urlencoded',
        data: $jokeForm.serialize(),
        success: function (data) {
            var $msg = $(data).find("*:contains('5 paisa')")
            var text = $($msg.get($msg.length - 1)).text().trim()

            //var $status = _$table.find('[data-thread-id=' + mail.id + '] td:nth-child(2)');
            if (text == "5 paisa has been added in your account for reading this joke.") {
                //$status.text('Credited');
                console.info('Success: ', mail.id, text, mail.subject, mail.link);
                tempLogs.push(['Success', mail.id, text, mail.subject, mail.link]);
            } else {
                //$status.text('Already credited');
                console.error('Failure: ', mail.id, text, mail.subject, mail.link);
                tempLogs.push(['Failure', mail.id, text, mail.subject, mail.link]);
            }
        },
        error: function (err) {
            //$status.text('Failed');
        }
    });
};