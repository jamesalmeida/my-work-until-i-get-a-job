var shutdownPeriod = [{h: 15, m: 0}, {h: 21, m: 0}];  // in UTC
var bgClasses = ['jim-1', 'jim-2', 'jim-3', 'jim-4'];
var visited = new Date();
var deceived;
var $body = $(document.body);

if (location.hash) {
  var timeNums = $.map(location.hash.substring(1).split(':'), Number);
  deceived = new Date(visited.getTime());
  deceived.setHours(timeNums[0] || 0);
  deceived.setMinutes(timeNums[1] || 0);
  deceived.setSeconds(timeNums[2] || 0);
  deceived.setMilliseconds(0);
}

function zerozero(num) {
  return ('00' + num).slice(-2);
}

$('.opening-time').text(
  zerozero(shutdownPeriod[0].h) + ':' + zerozero(shutdownPeriod[0].m)
);

function nextEvent(now) {
  var next = new Date(now.getTime());
  var starting = new Date(now.getTime());
  var ending = new Date(now.getTime());
  $.each([starting, ending], function(i, date) {
    date.setUTCHours(shutdownPeriod[i].h || 0);
    date.setUTCMinutes(shutdownPeriod[i].m || 0);
    date.setUTCSeconds(shutdownPeriod[i].s || 0);
    date.setUTCMilliseconds(0);
  });
  if (now < starting) {
    return ['shutdown', starting];
  } else if (now < ending) {
    return ['release', ending];
  } else {
    starting.setUTCDate(starting.getUTCDate() + 1);
    return ['shutdown', starting];
  }
}

function loop() {
  var now = new Date();
  if (deceived) {
    now = new Date(deceived.getTime() + (now - visited));
  }
  var event = nextEvent(now);
  var will = event[0];
  var next = event[1];
  if (will == 'shutdown') {
    var delta = Math.ceil((next - now) / 1000);  // in seconds
    $body.attr('class', null);
    $body.removeClass('shutdown').addClass('release');
    $body.addClass(bgClasses[now.getSeconds() % bgClasses.length]);
    $('.hours')[delta < 3600 ? 'hide' : 'show']();
    $('.minutes')[delta < 60 ? 'hide' : 'show']();
    $('.seconds').show();
    var hours = delta / 3600 | 0;
    delta -= hours * 3600;
    var minutes = delta / 60 | 0;
    delta -= minutes * 60;
    var seconds = delta | 0;
    $('.hours >').text(hours);
    $('.minutes >').text(minutes);
    $('.seconds >').text(seconds);
  } else {
    $body.removeClass('release').addClass('shutdown');
  }
  $body.css('transition', 'background-color 0.2s');
}

loop();
setInterval(loop, 500);
