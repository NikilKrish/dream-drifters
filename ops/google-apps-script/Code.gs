const MAX_PAYLOAD_BYTES = 20000;
const LOCK_TIMEOUT_MS = 30000;
const MAX_RETRY_ROWS = 20;
const MAX_NOTIFICATION_ATTEMPTS = 8;
const RETRY_TRIGGER_HANDLER = 'retryFailedNotifications';
const STATUS_NEW = 'New';
const NOTIFICATION_PENDING = 'Pending';
const NOTIFICATION_SENT = 'Sent';
const NOTIFICATION_FAILED = 'Failed';

const HEADERS = [
  'Submission ID',
  'Submitted at',
  'Status',
  'Contacted at',
  'Follow-up notes',
  'Interest kind',
  'Package ID',
  'Service ID',
  'Travel window',
  'Duration days',
  'Adults',
  'Children',
  'Budget band',
  'Name',
  'Mobile',
  'Email',
  'Message',
  'Consent recorded',
  'Notification status',
  'Notification attempts',
  'Last notification error',
  'Last updated',
];

function doPost(e) {
  try {
    return withScriptLock_(function () {
      return handleDoPost_(e);
    });
  } catch (error) {
    return jsonResponse_(errorResponse_('Temporary failure'));
  }
}

function retryFailedNotifications() {
  withScriptLock_(function () {
    const config = getConfig_();
    const sheet = getSheet_(config);
    const columnIndexes = getColumnIndexes_(sheet);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return;
    }

    const rows = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    const candidates = rows
      .map(function (row, index) {
        return {
          row: row,
          rowNumber: index + 2,
          submissionId: String(row[columnIndexes['Submission ID']] || ''),
          submittedAt: String(row[columnIndexes['Submitted at']] || ''),
          notificationStatus: String(row[columnIndexes['Notification status']] || ''),
          attempts: Number(row[columnIndexes['Notification attempts']] || 0),
        };
      })
      .filter(function (candidate) {
        return (
          candidate.notificationStatus === NOTIFICATION_FAILED &&
          candidate.attempts < MAX_NOTIFICATION_ATTEMPTS
        );
      })
      .sort(compareRetryCandidates_)
      .slice(0, MAX_RETRY_ROWS);

    candidates.forEach(function (candidate) {
      try {
        sendNotification_(config, rowToEmailRecord_(candidate.row, columnIndexes));
        updateRowNotificationState_(sheet, candidate.submissionId, columnIndexes, {
          notificationStatus: NOTIFICATION_SENT,
          notificationAttempts: candidate.attempts,
          lastNotificationError: '',
        });
      } catch (error) {
        updateRowNotificationState_(sheet, candidate.submissionId, columnIndexes, {
          notificationStatus: NOTIFICATION_FAILED,
          notificationAttempts: Math.min(candidate.attempts + 1, MAX_NOTIFICATION_ATTEMPTS),
          lastNotificationError: sanitizeError_(error),
        });
      }
    });
  });
}

function installRetryTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  const exists = triggers.some(function (trigger) {
    return trigger.getHandlerFunction() === RETRY_TRIGGER_HANDLER;
  });

  if (!exists) {
    ScriptApp.newTrigger(RETRY_TRIGGER_HANDLER).timeBased().everyMinutes(15).create();
  }
}

function removeRetryTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === RETRY_TRIGGER_HANDLER) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function safeCell(value) {
  const text = value == null ? '' : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function handleDoPost_(e) {
  const rawBody = getRawBody_(e);
  if (!rawBody || getByteLength_(rawBody) > MAX_PAYLOAD_BYTES) {
    return jsonResponse_(errorResponse_('Invalid request'));
  }

  const payload = parsePayload_(rawBody);
  if (!payload) {
    return jsonResponse_(errorResponse_('Invalid request'));
  }

  const config = getConfig_();
  if (!payload.authToken || payload.authToken !== config.webhookSecret) {
    return jsonResponse_(errorResponse_('Unauthorized'));
  }

  if (!payload.submissionId || !payload.submittedAt || !isObject_(payload.brief)) {
    return jsonResponse_(errorResponse_('Invalid request'));
  }

  const sheet = getSheet_(config);
  const columnIndexes = getColumnIndexes_(sheet);
  const existingRowNumber = findExistingRowNumber_(sheet, columnIndexes, payload.submissionId);

  if (existingRowNumber) {
    const existingRow = getRowValues_(sheet, existingRowNumber);
    return jsonResponse_(successResponse_(payload.submissionId, config.sheetUrl, existingRow, columnIndexes));
  }

  const record = payloadToRecord_(payload);
  sheet.appendRow(recordToRowValues_(record));
  const rowNumber = sheet.getLastRow();

  try {
    sendNotification_(config, record);
    updateRowNotificationState_(sheet, record.submissionId, columnIndexes, {
      notificationStatus: NOTIFICATION_SENT,
      notificationAttempts: 0,
      lastNotificationError: '',
    });
    return jsonResponse_(successResponse_(record.submissionId, config.sheetUrl, null, null, true));
  } catch (error) {
    updateRowNotificationState_(sheet, record.submissionId, columnIndexes, {
      notificationStatus: NOTIFICATION_FAILED,
      notificationAttempts: 1,
      lastNotificationError: sanitizeError_(error),
    });
    return jsonResponse_(successResponse_(record.submissionId, config.sheetUrl, null, null, false));
  }
}

function withScriptLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(LOCK_TIMEOUT_MS);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function getConfig_() {
  const properties = PropertiesService.getScriptProperties();
  const config = {
    spreadsheetId: properties.getProperty('SPREADSHEET_ID'),
    sheetName: properties.getProperty('SHEET_NAME'),
    ownerEmail: properties.getProperty('OWNER_EMAIL'),
    sheetUrl: properties.getProperty('SHEET_URL'),
    webhookSecret: properties.getProperty('WEBHOOK_SECRET'),
  };

  if (
    !config.spreadsheetId ||
    !config.sheetName ||
    !config.ownerEmail ||
    !config.sheetUrl ||
    !config.webhookSecret
  ) {
    throw new Error('Missing script properties');
  }

  return config;
}

function getSheet_(config) {
  const sheet = SpreadsheetApp.openById(config.spreadsheetId).getSheetByName(config.sheetName);
  if (!sheet) {
    throw new Error('Sheet not found');
  }
  return sheet;
}

function getColumnIndexes_(sheet) {
  const headers = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const columnIndexes = {};

  HEADERS.forEach(function (header, index) {
    if (headers[index] !== header) {
      throw new Error('Sheet headers do not match the approved schema');
    }
    columnIndexes[header] = index;
  });

  return columnIndexes;
}

function findExistingRowNumber_(sheet, columnIndexes, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return 0;
  }

  const submissionColumn = columnIndexes['Submission ID'] + 1;
  const values = sheet.getRange(2, submissionColumn, lastRow - 1, 1).getValues();
  const target = String(submissionId);

  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0]) === target) {
      return index + 2;
    }
  }

  return 0;
}

function payloadToRecord_(payload) {
  const brief = payload.brief;
  return {
    submissionId: String(payload.submissionId),
    submittedAt: String(payload.submittedAt),
    interestKind: rawText_(brief.interestKind),
    packageId: rawText_(brief.packageId),
    serviceId: rawText_(brief.serviceId),
    travelWindow: rawText_(brief.travelWindow),
    durationDays: numberOrBlank_(brief.durationDays),
    adults: numberOrBlank_(brief.adults),
    children: numberOrBlank_(brief.children),
    budgetBand: rawText_(brief.budgetBand),
    name: rawText_(brief.name),
    mobile: rawText_(brief.mobile),
    email: rawText_(brief.email),
    message: rawText_(brief.notes),
    consentRecorded: brief.consent === true,
  };
}

function rowToEmailRecord_(row, columnIndexes) {
  return {
    submissionId: String(row[columnIndexes['Submission ID']] || ''),
    submittedAt: String(row[columnIndexes['Submitted at']] || ''),
    interestKind: restoreDisplayValue_(row[columnIndexes['Interest kind']]),
    packageId: restoreDisplayValue_(row[columnIndexes['Package ID']]),
    serviceId: restoreDisplayValue_(row[columnIndexes['Service ID']]),
    travelWindow: restoreDisplayValue_(row[columnIndexes['Travel window']]),
    durationDays: valueOrBlank_(row[columnIndexes['Duration days']]),
    adults: valueOrBlank_(row[columnIndexes['Adults']]),
    children: valueOrBlank_(row[columnIndexes['Children']]),
    budgetBand: restoreDisplayValue_(row[columnIndexes['Budget band']]),
    name: restoreDisplayValue_(row[columnIndexes['Name']]),
    mobile: restoreDisplayValue_(row[columnIndexes['Mobile']]),
    email: restoreDisplayValue_(row[columnIndexes['Email']]),
    message: restoreDisplayValue_(row[columnIndexes['Message']]),
    consentRecorded: row[columnIndexes['Consent recorded']] === true || String(row[columnIndexes['Consent recorded']]) === 'true',
  };
}

function recordToRowValues_(record) {
  return [
    safeCell(record.submissionId),
    safeCell(record.submittedAt),
    STATUS_NEW,
    '',
    '',
    safeCell(record.interestKind),
    safeCell(record.packageId),
    safeCell(record.serviceId),
    safeCell(record.travelWindow),
    record.durationDays,
    record.adults,
    record.children,
    safeCell(record.budgetBand),
    safeCell(record.name),
    safeCell(record.mobile),
    safeCell(record.email),
    safeCell(record.message),
    record.consentRecorded,
    NOTIFICATION_PENDING,
    0,
    '',
    safeCell(record.submittedAt),
  ];
}

function sendNotification_(config, record) {
  MailApp.sendEmail({
    to: config.ownerEmail,
    replyTo: record.email,
    subject: 'You have received a new enquiry — ' + record.name,
    body: buildPlainTextBody_(record, config.sheetUrl),
    htmlBody: buildHtmlBody_(record, config.sheetUrl),
    name: 'Dream Drifters Website',
  });
}

function buildPlainTextBody_(record, sheetUrl) {
  return [
    'A new website enquiry has been received.',
    '',
    'Submission ID: ' + record.submissionId,
    'Submitted at: ' + record.submittedAt,
    'Interest kind: ' + record.interestKind,
    'Package ID: ' + displayValue_(record.packageId),
    'Service ID: ' + displayValue_(record.serviceId),
    'Travel window: ' + displayValue_(record.travelWindow),
    'Duration days: ' + displayValue_(record.durationDays),
    'Adults: ' + displayValue_(record.adults),
    'Children: ' + displayValue_(record.children),
    'Budget band: ' + displayValue_(record.budgetBand),
    'Name: ' + record.name,
    'Mobile: ' + record.mobile,
    'Email: ' + record.email,
    'Message: ' + displayValue_(record.message),
    'Consent recorded: ' + (record.consentRecorded ? 'true' : 'false'),
    '',
    'Open enquiry tracker: ' + sheetUrl,
  ].join('\n');
}

function buildHtmlBody_(record, sheetUrl) {
  const rows = [
    ['Submission ID', record.submissionId],
    ['Submitted at', record.submittedAt],
    ['Interest kind', record.interestKind],
    ['Package ID', displayValue_(record.packageId)],
    ['Service ID', displayValue_(record.serviceId)],
    ['Travel window', displayValue_(record.travelWindow)],
    ['Duration days', displayValue_(record.durationDays)],
    ['Adults', displayValue_(record.adults)],
    ['Children', displayValue_(record.children)],
    ['Budget band', displayValue_(record.budgetBand)],
    ['Name', record.name],
    ['Mobile', record.mobile],
    ['Email', record.email],
    ['Message', displayValue_(record.message)],
    ['Consent recorded', record.consentRecorded ? 'true' : 'false'],
  ];

  const tableRows = rows
    .map(function (entry) {
      return '<tr><th align="left" style="padding:6px 12px 6px 0;">' + escapeHtml_(entry[0]) + '</th><td style="padding:6px 0;">' + escapeHtml_(String(entry[1])) + '</td></tr>';
    })
    .join('');

  return (
    '<p>A new website enquiry has been received.</p>' +
    '<table cellspacing="0" cellpadding="0" border="0">' + tableRows + '</table>' +
    '<p><a href="' + escapeHtmlAttribute_(sheetUrl) + '">Open enquiry tracker</a></p>'
  );
}

function updateRowNotificationState_(sheet, submissionId, columnIndexes, updates) {
  const rowNumber = findExistingRowNumber_(sheet, columnIndexes, submissionId);
  if (!rowNumber) {
    throw new Error('Submission row not found');
  }
  const rowValues = getRowValues_(sheet, rowNumber);
  rowValues[columnIndexes['Notification status']] = updates.notificationStatus;
  rowValues[columnIndexes['Notification attempts']] = updates.notificationAttempts;
  rowValues[columnIndexes['Last notification error']] = safeCell(updates.lastNotificationError);
  rowValues[columnIndexes['Last updated']] = safeCell(new Date().toISOString());
  sheet.getRange(rowNumber, 1, 1, rowValues.length).setValues([rowValues]);
}

function getRowValues_(sheet, rowNumber) {
  return sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function parsePayload_(rawBody) {
  try {
    const parsed = JSON.parse(rawBody);
    return isObject_(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

function getRawBody_(e) {
  return e && e.postData && typeof e.postData.contents === 'string' ? e.postData.contents : '';
}

function getByteLength_(text) {
  return Utilities.newBlob(text).getBytes().length;
}

function compareRetryCandidates_(left, right) {
  if (left.submittedAt < right.submittedAt) {
    return -1;
  }
  if (left.submittedAt > right.submittedAt) {
    return 1;
  }
  if (left.submissionId < right.submissionId) {
    return -1;
  }
  if (left.submissionId > right.submissionId) {
    return 1;
  }
  return left.rowNumber - right.rowNumber;
}

function rawText_(value) {
  return value == null ? '' : String(value);
}

function restoreDisplayValue_(value) {
  const text = rawText_(value);
  return /^'[=+\-@]/.test(text) ? text.slice(1) : text;
}

function numberOrBlank_(value) {
  return typeof value === 'number' && isFinite(value) ? value : '';
}

function valueOrBlank_(value) {
  return value == null || value === '' ? '' : value;
}

function displayValue_(value) {
  return value == null || value === '' ? 'Blank' : String(value);
}

function sanitizeError_(error) {
  const message = error && error.message ? String(error.message) : 'Notification error';
  return safeCell(
    message
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted email]')
      .replace(/https?:\/\/\S+/gi, '[redacted url]')
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 120)
      .trim() || 'Notification error'
  );
}

function isObject_(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function successResponse_(submissionId, sheetUrl, existingRow, columnIndexes, notifiedOverride) {
  let notified = notifiedOverride;

  if (typeof notified !== 'boolean' && existingRow && columnIndexes) {
    notified = String(existingRow[columnIndexes['Notification status']] || '') === NOTIFICATION_SENT;
  }

  return {
    ok: true,
    stored: true,
    notified: notified === true,
    submissionId: submissionId,
    sheetUrl: sheetUrl,
  };
}

function errorResponse_(message) {
  return {
    ok: false,
    stored: false,
    notified: false,
    error: message,
  };
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeHtmlAttribute_(value) {
  return escapeHtml_(value);
}
