import { useState } from "react";

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function Input({
  label = "Your name",
  placeholder = "Type something...",
  value,
  onChange,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState("");

  const inputValue = value ?? internalValue;
  const isActive = focused || inputValue.length > 0;

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`fun-input ${focused ? "is-focused" : ""}`}>
      <div className="sparkles" aria-hidden="true">
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
      </div>

      <label className={isActive ? "active" : ""}>{label}</label>

      <input
        value={inputValue}
        placeholder={focused ? placeholder : ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => handleChange(e.target.value)}
      />

      <div className="glow" />
    </div>
  );
}
