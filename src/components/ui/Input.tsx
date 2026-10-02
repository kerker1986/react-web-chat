type InputProps = {
  type?: string;
  value?: string;
  placeholder?: string;
  inputHandler?: (value: string) => void;
};

function Input({
  type = 'text',
  value = '',
  placeholder = '',
  inputHandler = () => undefined,
}: InputProps) {
  return (
    <input
      className="ui-input"
      value={value}
      type={type}
      onChange={(event) => inputHandler(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder || undefined}
    />
  );
}

export default Input;
