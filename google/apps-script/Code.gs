/**
 * Acton Tbilisi website → Google Sheets bridge.
 *
 * SETUP (10 minutes, free, no billing account) — full steps with screenshots-in-words: docs/BACKEND.md
 *  1. Create a Google Sheet (e.g. "Acton website – forms") in the school's Google account.
 *  2. Extensions → Apps Script. Replace the code with this file. Save.
 *  3. Project Settings → Script properties → add:
 *       SECRET        = a long random string (same value as SHEETS_WEBHOOK_SECRET in Cloudflare)
 *       NOTIFY_EMAIL  = (optional) address that gets an email for every new lead
 *  4. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone → Deploy.
 *  5. Copy the Web app URL into Cloudflare as SHEETS_WEBHOOK_URL.
 *
 * Tabs "Leads" and "Votes" are created automatically on first use.
 */

function doPost(e) {
  var data;
  try { data = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, error: 'bad-json' }); }
  var props = PropertiesService.getScriptProperties();
  if (!data || data.secret !== props.getProperty('SECRET')) return out({ ok: false, error: 'forbidden' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (data.type === 'lead') return out(addLead(data, props));
    if (data.type === 'vote') return out(addVote(data));
    if (data.type === 'tally') return out(tally(data));
    return out({ ok: false, error: 'unknown-type' });
  } finally {
    lock.releaseLock();
  }
}

function addLead(d, props) {
  var sh = tab('Leads', ['Received', 'Parent name', 'Phone', 'Child age', 'Preferred time', 'Form', 'Page', 'Status', 'Notes']);
  sh.appendRow([new Date(), d.name, d.phone, d.childAge, d.preferredTime, d.source, d.page, 'new', '']);
  var to = props.getProperty('NOTIFY_EMAIL');
  if (to) {
    MailApp.sendEmail(to, 'ახალი მოთხოვნა საიტიდან: ' + d.name,
      'მშობელი: ' + d.name + '\nტელეფონი: ' + d.phone + '\nბავშვის ასაკი: ' + (d.childAge || '—') +
      '\nსასურველი დრო: ' + (d.preferredTime || '—') + '\nფორმა: ' + d.source + '\n\nცხრილი: ' + SpreadsheetApp.getActive().getUrl());
  }
  return { ok: true };
}

function addVote(d) {
  tab('Votes', ['Received', 'Question №', 'Option index']).appendRow([new Date(), Number(d.question), Number(d.option)]);
  return { ok: true };
}

function tally(d) {
  var sh = tab('Votes', ['Received', 'Question №', 'Option index']);
  var counts = [0, 0, 0, 0];
  var last = sh.getLastRow();
  if (last > 1) {
    var rows = sh.getRange(2, 2, last - 1, 2).getValues();
    for (var i = 0; i < rows.length; i++) {
      if (Number(rows[i][0]) === Number(d.question)) counts[Number(rows[i][1])] = (counts[Number(rows[i][1])] || 0) + 1;
    }
  }
  return { ok: true, counts: counts };
}

function tab(name, header) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, header.length).setFontWeight('bold');
  }
  return sh;
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
