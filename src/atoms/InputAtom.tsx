export const InputAtom = (props: {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;
  className?: string;
  full?: boolean;
}) => {
  return (
    <input
      type={props.type || 'text'}
      value={props.value}
      onChange={
        props.onChange ? (e) => props.onChange!(e.target.value) : undefined
      }
      placeholder={props.placeholder}
      readOnly={props.readOnly}
      className={`
        px-3 sm:px-4 py-2 sm:py-2.5
        bg-gray-800 border border-gray-700 rounded
        text-white text-sm sm:text-base
        placeholder:text-gray-500
        focus:outline-none focus:ring-2 focus:ring-black-russian-600 focus:border-black-russian-600
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${props.full ? 'w-full' : 'w-auto'}
        ${props.className || ''}
      `}
    />
  );
};
