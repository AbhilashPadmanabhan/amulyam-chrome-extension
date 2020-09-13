'use strict';

var TABS = 4;
var MAIL_LOAD_TIME = 300;
var SEARCH_TIME = 3000;
var MAX_TIME_PER_MAIL = 2000;
var MAX_TIME_PER_JOKE = 10000;

if (window.location.href.indexOf('mail.google.com') != -1) {
    //setTimeout(function () { checkMail(); }, 6000);
} else if (window.location.href.indexOf('amulyam.in') != -1) {
    //setTimeout(function () { submitJoke(); }, 3000);
}

function checkMail() {
    var jokeLinks = [];

    var searchForm = document.forms['aso_search_form_anchor'];

    var $inputBox = $(searchForm.q);
    $inputBox.val('amulyam joke');
    $(searchForm).find('button[aria-label*=Search]')[0].click();

    var detectJokeLink = function detectJokeLink(callback) {
        var jokeLink = $('[data-message-id]').find('a').filter(function (idx, link) {
            return $(link).text().indexOf('joke') != -1;
        }).prop('href');
        jokeLinks.push(jokeLink);
        if (callback) callback();
    };

    // time to search for joke related mails
    setTimeout(function () {
        var $mails = $('.F.cf.zt:visible').find('tr');
        var i = 0;
        var inboxToMail = setInterval(function () {
            var mail = $mails.get(i++);
            if (mail) {
                mail.click();
                setTimeout(function () {
                    detectJokeLink();
                }, MAIL_LOAD_TIME);
            } else {
                clearInterval(inboxToMail);
                // links are ready
                viewJokes(jokeLinks);
            }
        }, MAX_TIME_PER_MAIL);
    }, SEARCH_TIME);
}

function submitJoke() {
    var $jokeForm = $(document.forms).filter('[action*=amulyamCo]');

    if ($jokeForm.length) {
        $jokeForm.submit();
    }
}

function viewJokes(links) {
    var i = 0;
    var handles = [];
    var jokeVisitInterval = setInterval(function () {
        for (var idx = 0; idx < TABS; idx++) {
            var link = links[i] ? links[i] : clearInterval(jokeVisitInterval);
            if (link) {
                if (handles.length >= TABS) {
                    i %= 4;
                    handles[i].location.href = link;
                } else {
                    handles.push(window.open('http://www.amulyam.com/', "_blank"));
                }
                i++;
            }
        }
    }, MAX_TIME_PER_JOKE);
}