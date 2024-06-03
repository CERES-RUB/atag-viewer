
import { Children, useState } from 'react';
import ReactAutosuggest from 'react-autosuggest';

import './Autosuggest.css';

interface AutosuggestProps {

  disabled?: boolean;

  className?: string;

  value: string;

  placeholder?: string;

  getSuggestions: (query: string) => string[];

  onChange(value: string): void;

  onSelect?(selected: string): void;

}

export const Autosuggest = <T extends { id: string }>(props: AutosuggestProps) => {
 
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onGetSuggestions = ({ value }: { value: string }) =>
    setSuggestions(props.getSuggestions(value));

  const renderSuggestion = (suggestion: string, { isHighlighted }: { isHighlighted: boolean }) => (
    <div data-highlighted={isHighlighted ? 'true' : undefined}>
      {suggestion}
    </div>
  )

  return (
    <ReactAutosuggest
      suggestions={suggestions} 
      onSuggestionSelected={(_, arg) => props.onSelect && props.onSelect(arg.suggestion)}
      onSuggestionsFetchRequested={onGetSuggestions}
      onSuggestionsClearRequested={() => setSuggestions([])}
      getSuggestionValue={suggestion => suggestion}
      renderSuggestionsContainer={({ containerProps, children }) => Children.toArray(children).length > 0 ? (
        <div {...containerProps} className="react-autosuggest">
          {children}
        </div>
      ) : null}
      renderSuggestion={renderSuggestion}
      containerProps={{
        className: 'relative'
      }}
      inputProps={{
        disabled: props.disabled,
        placeholder: props.placeholder,
        value: props.value || '',
        onChange: (_, { newValue }) => props.onChange && props.onChange(newValue)
      }} />
  )
  
}
