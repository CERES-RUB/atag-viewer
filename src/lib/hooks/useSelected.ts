import { useMemo } from 'react';
import { useSelection, type Annotation } from '@annotorious/react';

export const useSelected = <T extends Annotation>() => {

  const selection = useSelection();

  const selected: T | undefined = useMemo(() => (
    selection.selected.length > 0 
      ? selection.selected[0].annotation as T : undefined
  ), [selection.selected.map(s => s.annotation.id).join(',')]);

  return selected;
  
}