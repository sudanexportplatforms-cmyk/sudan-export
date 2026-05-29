export interface EmailTemplateData {
  recipientName?: string;
  rfqReferenceNumber?: string;
  rfqTitle?: string;
  rfqProducts?: string;
  rfqQuantity?: string;
  rfqDeadline?: string;
  rfqDestination?: string;
  quotationId?: number;
  quotationAmount?: string;
  quotationCurrency?: string;
  supplierName?: string;
  buyerName?: string;
  companyName?: string;
  actionUrl?: string;
  actionLabel?: string;
}

const BASE_URL = process.env.APP_BASE_URL ?? "https://sudan-export.replit.app";

const layout = (content: string, preheader: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sudan Export</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;color:#f4f5f0;">${preheader}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f0;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1F5D3B;padding:28px 40px;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">🌿 SudanExpo</span>
                  <br/>
                  <span style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:2px;display:block;">B2B Agricultural Trade Platform</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:40px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8faf7;border-top:1px solid #e8ede6;padding:24px 40px;">
            <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">
              This email was sent by <strong>Sudan Export</strong> as part of your trade activity on the platform.
              Please do not reply to this email. If you have questions, visit your dashboard or contact support.
            </p>
            <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">
              © ${new Date().getFullYear()} Sudan Export. All rights reserved. &nbsp;|&nbsp; 
              <a href="${BASE_URL}" style="color:#1F5D3B;text-decoration:none;">sudanexport.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const ctaButton = (url: string, label: string) =>
  `<a href="${url}" style="display:inline-block;background:#1F5D3B;color:#ffffff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;margin-top:24px;">${label}</a>`;

const infoRow = (label: string, value: string) =>
  `<tr><td style="padding:8px 16px;font-size:13px;color:#6b7280;width:140px;vertical-align:top;">${label}</td><td style="padding:8px 16px;font-size:13px;color:#111827;font-weight:500;">${value}</td></tr>`;

const infoTable = (rows: string) =>
  `<table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:20px 0;">${rows}</table>`;

export function buildRfqOpenedEmail(d: EmailTemplateData): { subject: string; html: string } {
  const subject = `New RFQ: ${d.rfqReferenceNumber} — ${d.rfqTitle}`;
  const url = d.actionUrl ?? `${BASE_URL}/supplier/rfqs`;
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#111827;font-weight:700;">New RFQ Available</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">
      A buyer has posted a new Request for Quotation matching your product categories. Review the details and submit your competitive quote.
    </p>
    ${infoTable([
      infoRow("Reference", d.rfqReferenceNumber ?? "—"),
      infoRow("Product(s)", d.rfqProducts ?? "—"),
      infoRow("Quantity", d.rfqQuantity ?? "—"),
      infoRow("Destination", d.rfqDestination ?? "—"),
      infoRow("Valid Until", d.rfqDeadline ?? "—"),
    ].join(""))}
    <p style="margin:0;font-size:14px;color:#4b5563;">
      Log in to your supplier dashboard to view the full specification and submit your quotation.
    </p>
    ${ctaButton(url, "View RFQ & Submit Quote")}
  `;
  return { subject, html: layout(content, `New RFQ ${d.rfqReferenceNumber}: ${d.rfqTitle}`) };
}

export function buildQuotationSubmittedEmail(d: EmailTemplateData): { subject: string; html: string } {
  const subject = `Quotation received for ${d.rfqReferenceNumber}`;
  const url = d.actionUrl ?? `${BASE_URL}/buyer/rfqs`;
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#111827;font-weight:700;">New Quotation Received</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">
      A supplier has submitted a quotation for your RFQ. You can now review it in your dashboard and compare with other offers.
    </p>
    ${infoTable([
      infoRow("RFQ Reference", d.rfqReferenceNumber ?? "—"),
      infoRow("RFQ Title", d.rfqTitle ?? "—"),
      infoRow("Supplier", d.supplierName ?? "—"),
      infoRow("Total Amount", d.quotationAmount ? `${d.quotationCurrency ?? "USD"} ${d.quotationAmount}` : "—"),
    ].join(""))}
    <p style="margin:0;font-size:14px;color:#4b5563;">
      Compare all received quotations and award the best offer from your RFQ detail page.
    </p>
    ${ctaButton(url, "Review Quotations")}
  `;
  return { subject, html: layout(content, `Quotation received for ${d.rfqReferenceNumber} from ${d.supplierName}`) };
}

export function buildQuotationAwardedEmail(d: EmailTemplateData): { subject: string; html: string } {
  const subject = `Congratulations! Your quotation for ${d.rfqReferenceNumber} has been awarded`;
  const url = d.actionUrl ?? `${BASE_URL}/supplier/quotations`;
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#111827;font-weight:700;">Your Quotation Was Awarded 🎉</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">
      Congratulations! The buyer has selected your quotation as the winning offer. Please proceed to coordinate shipment and documentation.
    </p>
    ${infoTable([
      infoRow("RFQ Reference", d.rfqReferenceNumber ?? "—"),
      infoRow("RFQ Title", d.rfqTitle ?? "—"),
      infoRow("Awarded Amount", d.quotationAmount ? `${d.quotationCurrency ?? "USD"} ${d.quotationAmount}` : "—"),
    ].join(""))}
    <p style="margin:0;font-size:14px;color:#4b5563;">
      Log in to your dashboard to view next steps and coordinate with the buyer.
    </p>
    ${ctaButton(url, "View Awarded Quotation")}
  `;
  return { subject, html: layout(content, `Your quotation for ${d.rfqReferenceNumber} has been awarded!`) };
}

export function buildRfqClosedEmail(d: EmailTemplateData, role: "buyer" | "supplier"): { subject: string; html: string } {
  const subject = `RFQ ${d.rfqReferenceNumber} has been closed`;
  const url = d.actionUrl ?? (role === "buyer" ? `${BASE_URL}/buyer/rfqs` : `${BASE_URL}/supplier/rfqs`);
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#111827;font-weight:700;">RFQ Closed</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">
      ${role === "buyer"
        ? "Your RFQ has been closed. No further quotations will be accepted."
        : "An RFQ you quoted on has been closed by the buyer. No further action is required."}
    </p>
    ${infoTable([
      infoRow("Reference", d.rfqReferenceNumber ?? "—"),
      infoRow("Title", d.rfqTitle ?? "—"),
    ].join(""))}
    ${ctaButton(url, role === "buyer" ? "View My RFQs" : "Browse Other RFQs")}
  `;
  return { subject, html: layout(content, `RFQ ${d.rfqReferenceNumber} has been closed`) };
}

export function buildRfqCancelledEmail(d: EmailTemplateData, role: "buyer" | "supplier"): { subject: string; html: string } {
  const subject = `RFQ ${d.rfqReferenceNumber} has been cancelled`;
  const url = d.actionUrl ?? (role === "buyer" ? `${BASE_URL}/buyer/rfqs` : `${BASE_URL}/supplier/rfqs`);
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#111827;font-weight:700;">RFQ Cancelled</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">
      ${role === "buyer"
        ? "Your RFQ has been cancelled."
        : "An RFQ you quoted on has been cancelled by the buyer."}
    </p>
    ${infoTable([
      infoRow("Reference", d.rfqReferenceNumber ?? "—"),
      infoRow("Title", d.rfqTitle ?? "—"),
    ].join(""))}
    ${ctaButton(url, role === "buyer" ? "View My RFQs" : "Browse Other RFQs")}
  `;
  return { subject, html: layout(content, `RFQ ${d.rfqReferenceNumber} has been cancelled`) };
}

export function buildCompanyVerifiedEmail(d: EmailTemplateData, approved: boolean): { subject: string; html: string } {
  const subject = approved
    ? `Your company ${d.companyName} has been verified on Sudan Export`
    : `Company verification update for ${d.companyName}`;
  const url = d.actionUrl ?? `${BASE_URL}/supplier/company`;
  const content = approved
    ? `
      <h2 style="margin:0 0 8px;font-size:22px;color:#111827;font-weight:700;">Company Verified ✅</h2>
      <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">
        Great news! Your company <strong>${d.companyName}</strong> has been approved and verified on Sudan Export.
        You can now receive RFQ notifications and submit quotations to international buyers.
      </p>
      ${ctaButton(url, "Start Quoting")}
    `
    : `
      <h2 style="margin:0 0 8px;font-size:22px;color:#111827;font-weight:700;">Verification Update</h2>
      <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">
        Your company <strong>${d.companyName}</strong> verification was not approved at this time.
        Please review your company documentation and contact our support team for assistance.
      </p>
      ${ctaButton(url, "Update Company Profile")}
    `;
  return { subject, html: layout(content, subject) };
}
