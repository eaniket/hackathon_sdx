import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { verifyBrandDeal } from "../lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type VerificationDialogProps = {
  slug: string;
};

export function VerificationDialog({ slug }: VerificationDialogProps): JSX.Element {
  const queryClient = useQueryClient();
  const [brandName, setBrandName] = useState("");
  const [platform, setPlatform] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [evidenceText, setEvidenceText] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      verifyBrandDeal(slug, {
        brand_name: brandName,
        platform,
        campaign_type: campaignType,
        evidence_text: evidenceText,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["creator", slug] });
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary" className="w-full">
          Submit verified deal
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-panel p-6">
          <Dialog.Title className="text-lg font-semibold text-white">
            Add creator-submitted verification
          </Dialog.Title>
          <div className="mt-4 space-y-3">
            <Input value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Brand name" />
            <Input value={platform} onChange={(event) => setPlatform(event.target.value)} placeholder="Platform" />
            <Input value={campaignType} onChange={(event) => setCampaignType(event.target.value)} placeholder="Campaign type" />
            <Input value={evidenceText} onChange={(event) => setEvidenceText(event.target.value)} placeholder="Evidence text" />
          </div>
          <Button onClick={() => mutation.mutate()} className="mt-4 w-full" disabled={mutation.isPending}>
            Save verification
          </Button>
          <div className="mt-3 text-sm text-muted">
            {mutation.isSuccess ? "Verified record added." : null}
          </div>
          <Dialog.Close asChild>
            <Button variant="ghost" className="mt-6 w-full">
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
