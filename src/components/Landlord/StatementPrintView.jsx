import React from "react";

const MILIK_GREEN = "#0B3B2E";

const StatementPrintView = ({ statement, lines = [], company = null, summary = {} }) => {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "0.00";
    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getSignedAmount = (line) => {
    const amount = Number(line?.amount || 0);
    return line?.direction === "debit" ? -Math.abs(amount) : Math.abs(amount);
  };

  const getCategoryAmount = (category) => {
    const record = statement?.totalsByCategory?.[category];
    if (!record) return 0;
    if (typeof record.totalAmount === "number") return Math.abs(Number(record.totalAmount || 0));
    return Math.abs(Number(record.totalCredit || 0) - Number(record.totalDebit || 0));
  };

  // Build tenant rows
  const tenantRows = React.useMemo(() => {
    const rowsMap = new Map();

    lines.forEach((line) => {
      const metadata = line?.metadata || {};
      const tenantObj = line?.tenant;
      const unitObj = line?.unit;

      const tenantId =
        String(tenantObj?._id || line?.tenant || metadata?.tenantId || metadata?.tenant || "") ||
        `line-${line?._id || Math.random()}`;
      const tenantName = tenantObj?.name || metadata?.tenantName || "Unassigned Tenant";
      const unitLabel = unitObj?.unitNumber || unitObj?.name || metadata?.unit || "-";
      const perMonth = unitObj?.rent || metadata?.rent || 0;

      if (!rowsMap.has(tenantId)) {
        rowsMap.set(tenantId, {
          tenantId,
          tenantName,
          unit: unitLabel,
          perMonth,
          balanceBF: 0,
          invoicedRent: 0,
          utilityCharges: 0,
          paidRent: 0,
          paidUtility: 0,
          balanceCF: 0,
        });
      }

      const row = rowsMap.get(tenantId);
      const absAmount = Math.abs(Number(line?.amount || 0));
      const signedAmount = getSignedAmount(line);
      const category = String(line?.category || "").toUpperCase();

      if (category === "RENT_CHARGE") row.invoicedRent += absAmount;
      if (category === "UTILITY_CHARGE") row.utilityCharges += absAmount;
      if (category === "RENT_RECEIPT_MANAGER" || category === "RENT_RECEIPT_LANDLORD") row.paidRent += absAmount;
      if (category === "UTILITY_RECEIPT_MANAGER" || category === "UTILITY_RECEIPT_LANDLORD")
        row.paidUtility += absAmount;
      if (category === "OPENING_BALANCE_BF") row.balanceBF += signedAmount;
    });

    return Array.from(rowsMap.values()).map((row) => {
      row.balanceCF = row.balanceBF + row.invoicedRent + row.utilityCharges - row.paidRent - row.paidUtility;
      return row;
    });
  }, [lines]);

  const totalInvoiced = tenantRows.reduce((sum, r) => sum + r.invoicedRent, 0);
  const totalPaid = tenantRows.reduce((sum, r) => sum + r.paidRent, 0);
  const totalBalanceCF = tenantRows.reduce((sum, r) => sum + r.balanceCF, 0);

  const companyName = company?.name || company?.companyName || company?.businessName || "Milik Property Management";
  const companyAddress = company?.address || company?.location || "";
  const companyPhone = company?.phone || company?.telephone || "";
  const companyEmail = company?.email || "";

  const landlordName =
    [statement?.landlord?.firstName, statement?.landlord?.lastName].filter(Boolean).join(" ") ||
    statement?.landlord?.landlordName ||
    statement?.landlord?.name ||
    "N/A";
  const landlordEmail = statement?.landlord?.email || "";
  const landlordPhone = statement?.landlord?.phone || statement?.landlord?.phoneNumber || "";

  const propertyCode = statement?.property?.propertyCode || "";
  const propertyName = statement?.property?.propertyName || statement?.property?.name || "N/A";
  const propertyAddress = [statement?.property?.address, statement?.property?.city].filter(Boolean).join(", ");

  const parseStatementType = (notes = "") => {
    const lower = String(notes).toLowerCase();
    if (lower.includes("statement type: final")) return "FINAL";
    if (lower.includes("statement type: provisional")) return "PROVISIONAL";
    return "INTERIM";
  };

  const statementType = parseStatementType(statement?.notes);
  const periodLabel = `${formatDate(statement?.periodStart)} - ${formatDate(statement?.periodEnd)}`;

  const totalRentInvoiced = getCategoryAmount("RENT_CHARGE");
  const totalRentReceived =
    getCategoryAmount("RENT_RECEIPT_MANAGER") + getCategoryAmount("RENT_RECEIPT_LANDLORD");
  const totalUtilityCollected =
    getCategoryAmount("UTILITY_RECEIPT_MANAGER") + getCategoryAmount("UTILITY_RECEIPT_LANDLORD");
  const totalExpenses =
    getCategoryAmount("EXPENSE_DEDUCTION") +
    getCategoryAmount("RECURRING_DEDUCTION") +
    getCategoryAmount("ADVANCE_RECOVERY") +
    getCategoryAmount("WRITE_OFF");
  const totalAdditions = getCategoryAmount("ADJUSTMENT") + getCategoryAmount("ADVANCE_TO_LANDLORD");

  const commissionPercentage = Number(statement?.property?.commissionPercentage || 0);
  const recognitionBasis = String(statement?.property?.commissionRecognitionBasis || "received").toLowerCase();
  
  const totalRentReceivedManager = getCategoryAmount("RENT_RECEIPT_MANAGER");
  const totalUtilityInvoiced = getCategoryAmount("UTILITY_CHARGE");

  let commissionBase = totalRentReceived;
  if (recognitionBasis === "invoiced") {
    commissionBase = totalRentInvoiced;
  } else if (recognitionBasis === "received_manager_only") {
    commissionBase = totalRentReceivedManager;
  }

  const postedCommissionAmount = getCategoryAmount("COMMISSION_CHARGE");
  const computedCommissionAmount = (commissionBase * commissionPercentage) / 100;
  const commissionAmount = postedCommissionAmount > 0 ? postedCommissionAmount : computedCommissionAmount;

  const grossForPeriod =
    recognitionBasis === "invoiced"
      ? totalRentInvoiced + totalUtilityInvoiced + totalAdditions
      : totalRentReceived + totalUtilityCollected + totalAdditions;

  const netPayableToLandlord = grossForPeriod - totalExpenses - commissionAmount;

  const occupiedUnits = tenantRows.length;
  const totalUnits = statement?.property?.totalUnits || occupiedUnits;
  const vacantUnits = totalUnits - occupiedUnits;

  return (
    <div className="print-view">
      <style>{`
        .print-view {
          background: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #000;
          max-width: 210mm;
          margin: 0 auto;
          padding: 20px;
        }

        @page {
          size: A4;
          margin: 15mm;
        }

        .print-header {
          text-align: center;
          border-bottom: 3px solid ${MILIK_GREEN};
          padding-bottom: 15px;
          margin-bottom: 20px;
        }

        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: ${MILIK_GREEN};
          margin: 0;
          text-transform: uppercase;
        }

        .company-details {
          font-size: 11px;
          color: #444;
          margin-top: 5px;
        }

        .statement-title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 20px 0;
          padding: 10px;
          border: 2px solid ${MILIK_GREEN};
          background: #f8f9fa;
        }

        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 20px;
        }

        .info-block {
          flex: 1;
        }

        .info-block h4 {
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          color: ${MILIK_GREEN};
          margin: 0 0 8px 0;
          border-bottom: 1px solid #ddd;
          padding-bottom: 3px;
        }

        .info-block p {
          margin: 3px 0;
          font-size: 11px;
          line-height: 1.4;
        }

        .tenant-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 10px;
        }

        .tenant-table th {
          background: ${MILIK_GREEN};
          color: white;
          padding: 8px 4px;
          text-align: left;
          font-weight: 600;
          font-size: 9px;
          text-transform: uppercase;
        }

        .tenant-table th.text-right {
          text-align: right;
        }

        .tenant-table td {
          padding: 6px 4px;
          border-bottom: 1px solid #ddd;
        }

        .tenant-table td.text-right {
          text-align: right;
          font-family: 'Courier New', monospace;
        }

        .tenant-table tbody tr:hover {
          background: #f8f9fa;
        }

        .totals-row {
          font-weight: bold;
          background: #f0f0f0 !important;
          border-top: 2px solid ${MILIK_GREEN};
        }

        .summary-section {
          margin-top: 30px;
          page-break-inside: avoid;
        }

        .summary-section h3 {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          color: ${MILIK_GREEN};
          border-bottom: 2px solid ${MILIK_GREEN};
          padding-bottom: 5px;
          margin-bottom: 15px;
        }

        .summary-table {
          width: 60%;
          margin-left: auto;
          border-collapse: collapse;
          font-size: 11px;
        }

        .summary-table td {
          padding: 8px 12px;
          border: 1px solid #ddd;
        }

        .summary-table td:first-child {
          font-weight: 600;
          background: #f8f9fa;
          width: 60%;
        }

        .summary-table td:last-child {
          text-align: right;
          font-family: 'Courier New', monospace;
        }

        .summary-table .net-row {
          background: ${MILIK_GREEN};
          color: white;
          font-weight: bold;
          font-size: 12px;
        }

        .footer-note {
          margin-top: 30px;
          font-size: 10px;
          color: #666;
          text-align: center;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
      `}</style>

      <div className="print-header">
        <h1 className="company-name">{companyName}</h1>
        <div className="company-details">
          {companyAddress && <div>{companyAddress}</div>}
          <div>
            {companyPhone && <span>TEL: {companyPhone}</span>}
            {companyPhone && companyEmail && <span> | </span>}
            {companyEmail && <span>EMAIL: {companyEmail}</span>}
          </div>
        </div>
      </div>

      <div className="statement-title">
        PROPERTY ACCOUNT STATEMENT - {statementType}
      </div>

      <div className="info-section">
        <div className="info-block">
          <h4>Landlord</h4>
          <p><strong>{landlordName}</strong></p>
          {landlordEmail && <p>{landlordEmail}</p>}
          {landlordPhone && <p>{landlordPhone}</p>}
        </div>

        <div className="info-block">
          <h4>Property</h4>
          <p><strong>{propertyCode && `[${propertyCode}] `}{propertyName}</strong></p>
          {propertyAddress && <p>{propertyAddress}</p>}
        </div>

        <div className="info-block">
          <h4>Statement Period</h4>
          <p><strong>{periodLabel}</strong></p>
          <p>Statement #: {statement?.statementNumber || "N/A"}</p>
          <p>Date Generated: {formatDate(new Date())}</p>
        </div>
      </div>

      <table className="tenant-table">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Tenant/Resident</th>
            <th className="text-right">Per Month</th>
            <th className="text-right">Balance B/F</th>
            <th className="text-right">Amount Invoiced</th>
            <th className="text-right">Txn No</th>
            <th className="text-right">Amount Received</th>
            <th className="text-right">Balance C/F</th>
          </tr>
        </thead>
        <tbody>
          {tenantRows.map((row) => (
            <tr key={row.tenantId}>
              <td>{row.unit}</td>
              <td>{row.tenantName}</td>
              <td className="text-right">{formatCurrency(row.perMonth)}</td>
              <td className="text-right">{formatCurrency(row.balanceBF)}</td>
              <td className="text-right">{formatCurrency(row.invoicedRent)}</td>
              <td className="text-right">-</td>
              <td className="text-right">{formatCurrency(row.paidRent)}</td>
              <td className="text-right">{formatCurrency(row.balanceCF)}</td>
            </tr>
          ))}
          <tr className="totals-row">
            <td colSpan="3"><strong>TOTALS:</strong></td>
            <td className="text-right">
              <strong>{formatCurrency(tenantRows.reduce((sum, r) => sum + r.balanceBF, 0))}</strong>
            </td>
            <td className="text-right">
              <strong>{formatCurrency(totalInvoiced)}<br/>TOTAL INVOICED</strong>
            </td>
            <td className="text-right"></td>
            <td className="text-right">
              <strong>{formatCurrency(totalPaid)}<br/>TOTAL PAID</strong>
            </td>
            <td className="text-right">
              <strong>{formatCurrency(totalBalanceCF)}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{fontSize: '10px', margin: '10px 0'}}>
        <strong>OCCUPIED UNITS: {occupiedUnits} | VACANT UNITS: {vacantUnits}</strong>
      </p>

      <div className="summary-section">
        <h3>Statement Summary</h3>
        <table className="summary-table">
          <tbody>
            <tr>
              <td>RENT RECEIVED</td>
              <td>{formatCurrency(totalRentReceived)}</td>
            </tr>
            {totalUtilityCollected > 0 && (
              <tr>
                <td>UTILITY COLLECTED</td>
                <td>{formatCurrency(totalUtilityCollected)}</td>
              </tr>
            )}
            {totalAdditions > 0 && (
              <tr>
                <td>ADDITIONS/ADJUSTMENTS</td>
                <td>{formatCurrency(totalAdditions)}</td>
              </tr>
            )}
            {totalExpenses > 0 && (
              <tr>
                <td>LESS: EXPENSES</td>
                <td>({formatCurrency(totalExpenses)})</td>
              </tr>
            )}
            <tr>
              <td>COMMISSION ({commissionPercentage.toFixed(1)}%)</td>
              <td>({formatCurrency(commissionAmount)})</td>
            </tr>
            <tr className="net-row">
              <td>NET AMOUNT DUE</td>
              <td>{formatCurrency(netPayableToLandlord)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="footer-note">
        <p>This is a computer-generated statement and does not require a signature.</p>
        <p>Generated by {companyName} Property Management System | Powered by Milik</p>
      </div>
    </div>
  );
};

export default StatementPrintView;
