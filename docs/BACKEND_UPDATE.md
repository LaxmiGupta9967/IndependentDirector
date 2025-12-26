
# Complete Google Apps Script (v18 - FIXED)

**ACTION REQUIRED:** 
1. Replace your existing `code.gs` with this code.
2. **CRITICAL:** Go to **Project Settings (gear icon)** > **Script Properties** and add:
   - `RZP_KEY_ID`: Your Razorpay Public Key
   - `RZP_KEY_SECRET`: Your Razorpay Secret Key
3. Click **Deploy > New Deployment** (or Manage Deployments > Edit > New Version).

```javascript
/**
 * === Independent Director Web App Backend (v18) ===
 * Aligned with 31 Job Application Columns and fixed Razorpay parameters.
 */

const SPREADSHEET_ID = '1GSMm64YCHu0vlX0mIsEIUX_AHyRoAWok8amve6AKe1M';
const SS = SpreadsheetApp.openById(SPREADSHEET_ID);

const SHEET_DIRECTORS = SS.getSheetByName('DirectorDirectory');
const SHEET_AUTH = SS.getSheetByName('Auth');
const SHEET_JOBS = SS.getSheetByName('Jobs');
const SHEET_APPLICATIONS = SS.getSheetByName('JobApplications');
const SHEET_CONTACT = SS.getSheetByName('ContactMessages') || SS.insertSheet('ContactMessages');

// Set these in Project Settings > Script Properties
const RZP_KEY_ID = PropertiesService.getScriptProperties().getProperty('RZP_KEY_ID');
const RZP_KEY_SECRET = PropertiesService.getScriptProperties().getProperty('RZP_KEY_SECRET');

function doGet(e) {
  const path = e?.parameter?.path || "";
  const email = e?.parameter?.email || "";
  try {
    if (path === "directors") return buildResponse({ status: "success", data: getAllDirectors() });
    if (path === "jobs") return buildResponse({ status: "success", data: getAllJobs() });
    if (path === "my_applications") return buildResponse({ status: "success", data: getApplicationsByEmail(email) });
    return buildResponse({ status: "error", message: "V18: Invalid GET path: " + path });
  } catch (err) {
    return buildResponse({ status: "error", message: "V18 GET Error: " + err.toString() });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!lock.tryLock(15000)) return buildResponse({ status: "error", message: "V18: Server busy." });
    
    if (!e.postData || !e.postData.contents) {
      return buildResponse({ status: "error", message: "V18: No data received in request body." });
    }

    let data = JSON.parse(e.postData.contents);
    const path = data.path || "";

    if (path === "auth/signup") return handleSignup(data);
    if (path === "auth/login") return handleLogin(data);
    if (path === "register_director") return handleDirectorRegistration(data);
    if (path === "delete_director") return handleDeleteDirector(data);
    if (path === "post_job") return handlePostJob(data);
    if (path === "apply_job") return handleApplyJob(data);
    
    if (path === "razorpay/create_order") return handleCreateRazorpayOrder(data);
    if (path === "razorpay/verify_payment") return handleVerifyRazorpayPayment(data);
    if (path === "contact") return handleContact(data);
    
    return buildResponse({ status: "error", message: "V18: Path not found: " + path });
  } catch (err) {
    return buildResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/** 31-COLUMN APPLICATION HANDLER **/
function handleApplyJob(data) {
  const appId = Utilities.getUuid();
  const now = new Date();
  
  const rowData = [
    appId, appId, data.jobId || "", data.jobTitle || "", data.companyName || "", 
    data.posterEmail || "", data.applicantName || "", data.applicantEmail || "", 
    data.phone || "", data.industry || "", data.experience || "", 
    data.currentLocation || "", data.preferredLocation || "", data.currentCTC || "", 
    data.expectedCTC || "", data.noticePeriod || "", data.resumeUrl || "", 
    data.linkedinUrl || "", data.summary || "", data.message || "", 
    "Paid", data.amount || 99, data.paymentId || "", "Razorpay", "Captured", 
    now, "None", "Under Review", "Web Portal", now, now
  ];
  
  SHEET_APPLICATIONS.appendRow(rowData);
  return buildResponse({ status: "success", id: appId });
}

function handleSignup(data) {
  const emailLower = String(data.email).toLowerCase().trim();
  const rows = SHEET_AUTH.getDataRange().getValues();
  if (rows.some(r => String(r[1]).toLowerCase() === emailLower)) return buildResponse({ status: "error", message: "Email exists." });
  const hash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, data.password + emailLower));
  SHEET_AUTH.appendRow([rows.length, emailLower, hash, data.name, new Date()]);
  return buildResponse({ status: "success" });
}

function handleLogin(data) {
  const emailLower = String(data.email).toLowerCase().trim();
  const hash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, data.password + emailLower));
  const rows = SHEET_AUTH.getDataRange().getValues();
  const user = rows.find(r => String(r[1]).toLowerCase() === emailLower && String(r[2]) === hash);
  if (!user) return buildResponse({ status: "error", message: "Invalid credentials." });
  return buildResponse({ status: "success", user: { id: user[0], email: user[1], name: user[3] } });
}

function handleDirectorRegistration(data) {
  const rows = SHEET_DIRECTORS.getDataRange().getValues();
  const headers = rows[0];
  const emailIndex = headers.indexOf('Email');
  const emailToFind = String(data.email || "").toLowerCase().trim();
  const existingRowIndex = rows.findIndex((r, i) => i > 0 && String(r[emailIndex]).toLowerCase() === emailToFind);
  
  const rowData = [
    data.id || Utilities.getUuid(), data.name || "", emailToFind, data.age || "", data.dinNumber || "", 
    data.isCurrentDirector || "No", data.yearsOfExperience || "0", data.sectorsServed || "", 
    data.currentSectors || "", data.committeeCount || "0", data.subCommitteeCount || "0", 
    data.isIODCertified || "No", data.iodCertificateUrl || "", data.internationalBoards || "", 
    data.litigationDetails || "", data.industry || "", data.description || "", data.logoUrl || ""
  ];

  if (existingRowIndex > -1) { 
    SHEET_DIRECTORS.getRange(existingRowIndex + 1, 1, 1, 18).setValues([rowData]); 
    return buildResponse({ status: "success", action: "update" }); 
  } else { 
    SHEET_DIRECTORS.appendRow(rowData); 
    return buildResponse({ status: "success", action: "create" }); 
  }
}

function getAllDirectors() {
  const data = SHEET_DIRECTORS.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function getAllJobs() {
  const data = SHEET_JOBS.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h.toLowerCase().trim()] = row[i]);
    return obj;
  });
}

function handlePostJob(data) {
  const id = Utilities.getUuid();
  SHEET_JOBS.appendRow([
    id, data.title, data.company, data.industry, data.type, data.experience, 
    data.location, data.description, data.responsibilities, data.expectations, 
    data.remuneration, data.fee || 99, new Date(), data.posterEmail || ""
  ]);
  return buildResponse({ status: "success", jobId: id });
}

function getApplicationsByEmail(email) {
  const rows = SHEET_APPLICATIONS.getDataRange().getValues();
  if (rows.length < 2) return [];
  const emailLower = (email || "").toLowerCase().trim();
  
  return rows.slice(1)
    .filter(r => String(r[7]).toLowerCase().trim() === emailLower)
    .map(r => ({ 
      id: r[0], applicationId: r[1], jobId: r[2], jobTitle: r[3], companyName: r[4], directorEmail: r[5],
      applicantName: r[6], applicantEmail: r[7], applicantPhone: r[8], applicantIndustry: r[9], experience: r[10],
      currentLocation: r[11], preferredLocation: r[12], currentCTC: r[13], expectedCTC: r[14], noticePeriod: r[15],
      resumeUrl: r[16], linkedinUrl: r[17], summary: r[18], message: r[19],
      paymentStatus: r[20], amount: r[21], paymentId: r[22], paymentMethod: r[23], transactionStatus: r[24],
      paymentDate: r[25], refundStatus: r[26], status: r[27], appliedFrom: r[28], appliedAt: r[29], updatedAt: r[30]
    }));
}

function handleCreateRazorpayOrder(data) {
  const amountInPaise = Math.round((data.amount || 99) * 100); 
  const options = {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Utilities.base64Encode(RZP_KEY_ID + ":" + RZP_KEY_SECRET),
      "Content-Type": "application/json"
    },
    payload: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt: "rcpt_" + Utilities.getUuid().substring(0,8)
    }),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch("https://api.razorpay.com/v1/orders", options);
    const result = JSON.parse(response.getContentText());
    if (response.getResponseCode() !== 200) {
      return buildResponse({ status: "error", message: result.error?.description || "Gateway error." });
    }
    return buildResponse({ status: "success", id: result.id, amount: result.amount, currency: result.currency, key: RZP_KEY_ID });
  } catch (err) {
    return buildResponse({ status: "error", message: "Gateway connection failed." });
  }
}

function handleVerifyRazorpayPayment(data) {
  const secret = RZP_KEY_SECRET;
  const signature = data.razorpay_signature;
  const orderId = data.razorpay_order_id;
  const paymentId = data.razorpay_payment_id;
  const text = orderId + "|" + paymentId;
  const signatureBytes = Utilities.computeHmacSha256Signature(text, secret);
  const generatedSignature = signatureBytes.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
  
  if (generatedSignature === signature) return buildResponse({ status: "success" });
  return buildResponse({ status: "error", message: "Verification failed." });
}

function handleContact(data) {
  SHEET_CONTACT.appendRow([new Date(), data.fullName || "", data.email || "", data.subject || "", data.message || ""]);
  return buildResponse({ status: "success" });
}

function handleDeleteDirector(data) {
  const rows = SHEET_DIRECTORS.getDataRange().getValues();
  const headers = rows[0];
  const emailIndex = headers.indexOf('Email');
  const index = rows.findIndex((r, i) => i > 0 && String(r[emailIndex]).toLowerCase() === String(data.email).toLowerCase());
  if (index > -1) { SHEET_DIRECTORS.deleteRow(index + 1); return buildResponse({ status: "success" }); }
  return buildResponse({ status: "error", message: "Profile not found." });
}

function buildResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```
