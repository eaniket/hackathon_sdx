import { Button } from "./ui/button";

type WatchlistButtonProps = {
  active: boolean;
  onToggle: () => void;
};

export function WatchlistButton({
  active,
  onToggle,
}: WatchlistButtonProps): JSX.Element {
  return (
    <Button variant="secondary" onClick={onToggle}>
      {active ? "Watching" : "Add to watchlist"}
    </Button>
  );
}
