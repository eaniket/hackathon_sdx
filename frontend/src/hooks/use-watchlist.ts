import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "creator-market-watchlist";

export function useWatchlist(): {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
} {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored) as string[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const api = useMemo(
    () => ({
      items,
      has: (slug: string) => items.includes(slug),
      toggle: (slug: string) => {
        setItems((current) =>
          current.includes(slug)
            ? current.filter((item) => item !== slug)
            : [...current, slug],
        );
      },
    }),
    [items],
  );

  return api;
}
