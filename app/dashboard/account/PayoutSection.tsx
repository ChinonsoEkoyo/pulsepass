"use client";

import { useEffect, useState } from "react";
import { Landmark, Building2, Pencil } from "lucide-react";
import PayoutModal from "./PayoutModal";
import styles from "./page.module.css";

interface PayoutAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function PayoutSection() {
  const [account, setAccount] = useState<PayoutAccount | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payouts")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setAccount(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSaved(saved: PayoutAccount) {
    setAccount(saved);
  }

  const masked = account?.accountNumber
    ? `****${account.accountNumber.slice(-4)}`
    : "";

  if (loading) return null;

  if (account) {
    return (
      <>
        <div className={styles.payoutsCard}>
          <div className={styles.payoutsCardHeader}>
            <Building2 size={20} />
            <span>{account.bankName}</span>
          </div>
          <div className={styles.payoutsCardBody}>
            <div className={styles.payoutDetail}>
              <span className={styles.payoutDetailLabel}>Account name</span>
              <span className={styles.payoutDetailValue}>{account.accountName}</span>
            </div>
            <div className={styles.payoutDetail}>
              <span className={styles.payoutDetailLabel}>Account number</span>
              <span className={styles.payoutDetailValue}>{masked}</span>
            </div>
            <div className={styles.payoutDetail}>
              <span className={styles.payoutDetailLabel}>Currency</span>
              <span className={styles.payoutDetailValue}>NGN</span>
            </div>
          </div>
          <button className={styles.payoutsEditBtn} onClick={() => setModalOpen(true)}>
            <Pencil size={14} />
            Edit
          </button>
        </div>
        <PayoutModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
          initial={account}
        />
      </>
    );
  }

  return (
    <>
      <div className={styles.payoutsContainer}>
        <div className={styles.payoutsIcon}>
          <Landmark size={28} />
        </div>
        <h2 className={styles.payoutsTitle}>You&apos;ve not added any payout account</h2>
        <p className={styles.payoutsDesc}>
          Add your account details to receive funds from your PulsePass sales.
        </p>
        <button className={styles.payoutsBtn} onClick={() => setModalOpen(true)}>
          + Add payout account
        </button>
      </div>
      <PayoutModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={handleSaved} />
    </>
  );
}
