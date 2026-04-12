import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createInvestment } from "../lib/api";
import { Button } from "./ui/button";

type InvestDialogProps = {
  creatorId: number;
  creatorName: string;
};

const amounts = [10, 25, 50, 100];

export function InvestDialog({ creatorId, creatorName }: InvestDialogProps): JSX.Element {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (amount: number) => createInvestment(creatorId, amount),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="w-full">Invest</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-panel p-6">
          <Dialog.Title className="text-lg font-semibold text-white">
            Simulate an investment in {creatorName}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted">
            Choose a fixed ticket size. This MVP uses simulated investing only.
          </Dialog.Description>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {amounts.map((amount) => (
              <Button
                key={amount}
                variant="secondary"
                onClick={() => mutation.mutate(amount)}
                disabled={mutation.isPending}
              >
                ${amount}
              </Button>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted">
            {mutation.isSuccess ? "Position added to portfolio." : null}
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
