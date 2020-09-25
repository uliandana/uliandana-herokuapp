import { useEffect, useState } from 'react';

export function useFlash(data) {
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems([]);
  }, [data]);

  useEffect(() => {
    (!items.length && data.length) && setItems(data);
  }, [items]);

  return items;
}
