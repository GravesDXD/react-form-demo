import * as React from "react";

export default function useFieldChange(store, name, onChange) {
  React.useEffect(() => {
    if (!name || !store) return;

    return store.subscribe((n) => {
      if (name === "*" || n === name || n === "*") {
        onChange(name);
      }
    });
  }, [name, store]);
}
