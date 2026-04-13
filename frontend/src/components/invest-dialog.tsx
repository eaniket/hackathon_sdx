import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createInvestment } from "../lib/api";
import { useToast } from "../contexts/toast-context";
import { cn, formatNumber } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type InvestDialogProps = {
  opportunityId: string;
  creatorName: string;
  opportunityName: string;
  instrumentType: string;
  payoutTimeline: string;
  triggerLabel?: string;
  triggerClassName?: string;
};

const amounts = [10, 25, 50];

export function InvestDialog({
  opportunityId,
  creatorName,
  opportunityName,
  instrumentType,
  payoutTimeline,
  triggerLabel = "Invest",
  triggerClassName,
}: InvestDialogProps): JSX.Element {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirmingAmount, setConfirmingAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("250");
  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const parsedAmount = Number(customAmount);
  const mutation = useMutation({
    mutationFn: (amount: number) => createInvestment(opportunityId, amount),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      showToast("Investment confirmed", `${opportunityName} was added to your portfolio. Open Portfolio to track payouts.`);
      setConfirmingAmount(null);
      setShowCustomAmount(false);
      setShowSuccess(true);
    },
  });

  function requestConfirm(amount: number): void {
    setShowCustomAmount(false);
    setConfirmingAmount(amount);
  }

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen);
    if (!nextOpen) {
      setConfirmingAmount(null);
      setShowCustomAmount(false);
      setShowSuccess(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button className={cn("w-full", triggerClassName)}>{triggerLabel}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-2rem)] w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-panel p-6">
          {showSuccess ? (
            <>
              <div className="flex flex-1 flex-col items-center justify-center py-4 text-center">
                <div className="relative mb-8 flex h-36 w-36 items-center justify-center rounded-[2rem] bg-[linear-gradient(180deg,rgba(244,251,248,0.92),rgba(223,238,231,0.88))] shadow-[0_24px_60px_rgba(16,185,129,0.12)]">
                  <div className="absolute left-5 top-6 h-14 w-16 rounded-2xl border border-white/70 bg-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
                  <div className="absolute left-9 top-10 h-4 w-5 rounded-md border border-white/70 bg-white/65" />
                  <div className="absolute bottom-4 right-3 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(180deg,#22c55e,#16a34a)] text-4xl font-semibold text-white shadow-[0_10px_24px_rgba(34,197,94,0.35)]">
                    ✓
                  </div>
                </div>
                <Dialog.Title className="text-[2rem] font-semibold tracking-[-0.04em] text-white">
                  Investment Successful
                </Dialog.Title>
                <Dialog.Description className="mt-4 max-w-sm text-base leading-8 text-muted">
                  Your investment in {creatorName} was completed successfully. You can
                  track this position from your portfolio now.
                </Dialog.Description>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full rounded-full border-emerald-400/70 bg-[linear-gradient(180deg,#3ecf8e,#31b97f)] py-3 text-base font-semibold text-white shadow-[0_14px_40px_rgba(52,211,153,0.28)]"
                  onClick={() => {
                    handleOpenChange(false);
                    navigate("/portfolio");
                  }}
                >
                  Go to portfolio
                </Button>
                <Dialog.Close asChild>
                  <Button variant="ghost" className="w-full rounded-full">
                    Close
                  </Button>
                </Dialog.Close>
              </div>
            </>
          ) : (
            <>
              <Dialog.Title className="text-lg font-semibold text-white">
                Confirm investment
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted">
                Review the instrument details before committing capital.
              </Dialog.Description>
              <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
                <div className="rounded-xl border border-border bg-black/10 p-4 text-sm text-slate-200">
                  <p><span className="text-muted">Instrument:</span> {instrumentType === "revenue_share" ? "Revenue share note" : "Project finance round"}</p>
                  <p><span className="text-muted">Creator:</span> {creatorName}</p>
                  <p><span className="text-muted">Opportunity:</span> {opportunityName}</p>
                  <p><span className="text-muted">Payout timeline:</span> {payoutTimeline}</p>
                  <p><span className="text-muted">Minimum:</span> $5 · <span className="text-muted">Maximum:</span> $10,000</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {amounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="secondary"
                      onClick={() => requestConfirm(amount)}
                      disabled={mutation.isPending}
                    >
                      ${amount}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setConfirmingAmount(null);
                      setShowCustomAmount(true);
                    }}
                    disabled={mutation.isPending}
                  >
                    Custom amount
                  </Button>
                </div>
                {showCustomAmount ? (
                  <div className="space-y-3">
                    <Input
                      type="number"
                      min="5"
                      max="10000"
                      step="1"
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                      placeholder="Enter custom amount"
                    />
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => requestConfirm(parsedAmount)}
                      disabled={mutation.isPending || Number.isNaN(parsedAmount) || parsedAmount < 5 || parsedAmount > 10000}
                    >
                      Invest
                    </Button>
                  </div>
                ) : null}
                {confirmingAmount !== null ? (
                  <div className="space-y-3 rounded-xl border border-border bg-black/10 p-4">
                    <p className="text-sm text-slate-200">
                      You are committing ${formatNumber(confirmingAmount)} to {opportunityName}.
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => mutation.mutate(confirmingAmount)}
                      disabled={mutation.isPending}
                    >
                      Invest
                    </Button>
                  </div>
                ) : null}
                <div className="text-sm text-muted">
                  {!Number.isNaN(parsedAmount) && parsedAmount > 10000 ? " Enter an amount below $10,000." : null}
                </div>
              </div>
              <div className="mt-4">
                <Dialog.Close asChild>
                  <Button variant="ghost" className="w-full">
                    Close
                  </Button>
                </Dialog.Close>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
