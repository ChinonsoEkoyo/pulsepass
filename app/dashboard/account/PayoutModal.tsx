"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import styles from "./PayoutModal.module.css";

const NIGERIAN_BANKS = [
  "Access Bank",
  "Zenith Bank",
  "First Bank of Nigeria",
  "GTBank",
  "United Bank for Africa (UBA)",
  "Fidelity Bank",
  "Polaris Bank",
  "Union Bank",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "Wema Bank",
  "Ecobank Nigeria",
  "Keystone Bank",
  "Unity Bank",
  "Providus Bank",
  "SunTrust Bank",
  "Heritage Bank",
  "Moniepoint MFB",
  "Kuda MFB",
  "OPay",
  "PalmPay",
];

interface PayoutAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface PayoutModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (account: PayoutAccount) => void;
  initial?: PayoutAccount;
}

export default function PayoutModal({ open, onClose, onSaved, initial }: PayoutModalProps) {
  const [paymentMethod] = useState("bank_transfer");
  const [bankName, setBankName] = useState(initial?.bankName || "");
  const [accountNumber, setAccountNumber] = useState(initial?.accountNumber || "");
  const [accountName, setAccountName] = useState(initial?.accountName || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankName, accountNumber, accountName }),
      });
      const json = await res.json();
      if (json.data) {
        onSaved({ bankName, accountNumber, accountName });
        onClose();
      }
    } catch {
      alert("Failed to save payout account");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit payout account" : "Add payout account"}>
      <div className={styles.modalBody}>
        <div className={styles.infoPill}>You can edit this information later</div>

        <div className={styles.field}>
          <label className={styles.label}>Payment method</label>
          <select className={styles.select} value={paymentMethod} disabled>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Currency</label>
          <div className={styles.currencyDisplay}>NGN</div>
        </div>

        <h3 className={styles.sectionTitle}>Account Information</h3>

        <div className={styles.field}>
          <label className={styles.label}>Bank name</label>
          <select className={styles.select} value={bankName} onChange={(e) => setBankName(e.target.value)}>
            <option value="" disabled>Select bank</option>
            {NIGERIAN_BANKS.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Account Number</label>
          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="0123456789"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Account Name</label>
          <input
            className={styles.input}
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Enter account name"
          />
        </div>

        <Button
          className={styles.saveBtn}
          size="lg"
          loading={saving}
          disabled={!bankName || !accountNumber || accountNumber.length !== 10 || !accountName}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
