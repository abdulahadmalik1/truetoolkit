"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, TextInput, ResultCard, ResultHeadline, ResultRow, Disclaimer, CopyButton } from "@/components/ui";

export default function FreelancePayoutLeakage() {
  const [invoiceCurrency, setInvoiceCurrency] = useState("$");
  const [localCurrency, setLocalCurrency] = useState("PKR");
  
  const [invoiceAmount, setInvoiceAmount] = useState(1000);
  const [platformFeePercent, setPlatformFeePercent] = useState(20);
  const [withdrawalFee, setWithdrawalFee] = useState(30);
  
  const [marketRate, setMarketRate] = useState(280);
  const [platformRate, setPlatformRate] = useState(272);

  // Calculations
  const platformCut = invoiceAmount * (platformFeePercent / 100);
  const remainingAfterPlatform = invoiceAmount - platformCut;
  const amountToConvert = Math.max(0, remainingAfterPlatform - withdrawalFee);
  
  const idealLocalPayout = invoiceAmount * marketRate;
  const actualLocalPayout = amountToConvert * platformRate;
  const totalLeakage = Math.max(0, idealLocalPayout - actualLocalPayout);
  
  const leakagePercent = invoiceAmount > 0 ? (totalLeakage / idealLocalPayout) * 100 : 0;

  // Leakage breakdown in local currency
  const platformFeeLocal = platformCut * marketRate;
  const withdrawalFeeLocal = withdrawalFee * marketRate;
  const exchangeRateLoss = amountToConvert * Math.max(0, marketRate - platformRate);

  const getCopyText = () => {
    return `Freelance Payout Leakage:\nInvoice: ${invoiceCurrency}${invoiceAmount}\nActual Payout: ${actualLocalPayout.toLocaleString(undefined, {maximumFractionDigits: 0})} ${localCurrency}\nLost to Fees & FX: ${totalLeakage.toLocaleString(undefined, {maximumFractionDigits: 0})} ${localCurrency} (${leakagePercent.toFixed(1)}%)`;
  };

  return (
    <ToolLayout
      toolNum={47} category="💰 Money & Freelance"
      title="Freelance Payout Leakage" titleHighlight="Calculator"
      description="See exactly how much of your invoice disappears to platform cuts, withdrawal fees, and bad exchange rates before it lands in your account."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Invoice & Currencies</SectionTitle>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <FieldLabel htmlFor="invCur">Invoice Currency</FieldLabel>
                <TextInput id="invCur" value={invoiceCurrency} onChange={setInvoiceCurrency} placeholder="$" />
              </div>
              <div>
                <FieldLabel htmlFor="locCur">Local Currency</FieldLabel>
                <TextInput id="locCur" value={localCurrency} onChange={setLocalCurrency} placeholder="PKR" />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="amount">Invoice Amount</FieldLabel>
              <NumInput id="amount" value={invoiceAmount} onChange={setInvoiceAmount} prefix={invoiceCurrency} min={0} step={100} />
            </div>
          </Card>

          <Card>
            <SectionTitle>Platform & Withdrawal Fees</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="platFee" hint="(Upwork, Fiverr, etc.)">Platform Fee (%)</FieldLabel>
                <NumInput id="platFee" value={platformFeePercent} onChange={setPlatformFeePercent} suffix="%" min={0} max={100} step={1} />
              </div>
              <div>
                <FieldLabel htmlFor="withdrawFee" hint="(Wire transfer, Payoneer)">Fixed Withdrawal Fee</FieldLabel>
                <NumInput id="withdrawFee" value={withdrawalFee} onChange={setWithdrawalFee} prefix={invoiceCurrency} min={0} step={1} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Exchange Rates</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="marketRate" hint="(Google / True value)">Actual Market Rate</FieldLabel>
                <NumInput id="marketRate" value={marketRate} onChange={setMarketRate} min={0} step={0.5} />
              </div>
              <div>
                <FieldLabel htmlFor="platRate" hint="(What platform gives you)">Platform / Bank Rate</FieldLabel>
                <NumInput id="platRate" value={platformRate} onChange={setPlatformRate} min={0} step={0.5} />
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline label="You Actually Receive" value={`${actualLocalPayout.toLocaleString(undefined, {maximumFractionDigits: 0})} ${localCurrency}`} sub={`Out of an ideal ${idealLocalPayout.toLocaleString(undefined, {maximumFractionDigits: 0})} ${localCurrency}`} />
            
            <div className="px-4 py-4 space-y-1">
              <ResultRow label="Total Value Lost" value={`${totalLeakage.toLocaleString(undefined, {maximumFractionDigits: 0})} ${localCurrency}`} highlight />
              <ResultRow label="Effective Tax/Fee Rate" value={`${leakagePercent.toFixed(1)}%`} />
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Where did it go?</p>
                <ResultRow label="Platform Cut" value={`${platformFeeLocal.toLocaleString(undefined, {maximumFractionDigits: 0})} ${localCurrency}`} sub={`${platformFeePercent}% of invoice`} />
                <ResultRow label="Withdrawal Fee" value={`${withdrawalFeeLocal.toLocaleString(undefined, {maximumFractionDigits: 0})} ${localCurrency}`} sub={`${invoiceCurrency}${withdrawalFee} fixed fee`} />
                <ResultRow label="Exchange Rate Loss" value={`${exchangeRateLoss.toLocaleString(undefined, {maximumFractionDigits: 0})} ${localCurrency}`} sub={`Lost on conversion spread`} />
              </div>
            </div>
            <div className="px-4 pb-4">
              <CopyButton getText={getCopyText} />
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
