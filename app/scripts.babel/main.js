var JokeMails = function (mailClient) {
    var gmailRef = mailClient;

    var capture = function () {
        var mails = gmailRef.get.visible_emails('query&qs=true&q=amulyam+joke&at=' + $('[name=at]').val());

        if (mails.length) {
            var mailThreadIds = mails.map(mail => mail.id);
            var mailThreadData = mailThreadIds.map(thread => {
                var emailData = gmailRef.get.email_data(thread);
                var mailText = emailData.threads[thread].content_html;
                try {
                    var $mailData = $(mailText);
                    var mailLink = $mailData.find('a:contains("Rs.0.05")').attr('href');
                    return {
                        id: emailData.thread_id,
                        subject: emailData.subject,
                        link: mailLink
                    };
                } catch (e) {
                    console.log(e);
                }
                return null;
            });
            mailThreadData = mailThreadData.filter((el) => { return el; });

            chrome.storage.local.set({
                "jokes": mailThreadData
            });
            var jokeWindowHandle = window.open("http://www.amulyam.in", "_blank");
        }
    };

    return {
        capture: capture
    };
}


document.addEventListener('GmailGlobalsAvailable', function (e) {
    window.GLOBALS = e.detail;
    if (typeof Gmail != "undefined") {
        var gmail = new Gmail($);
        var jokes = new JokeMails(gmail);
        jokes.capture();
    }
});
