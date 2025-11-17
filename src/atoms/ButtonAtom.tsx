export const ButtonAtom = (props: {
  text: string;
  onClick: () => any;
  full?: boolean;
}) => {
  return (
    <button
      className={`cursor-pointer px-3 sm:px-4 text-base sm:text-lg md:text-xl py-1.5 sm:py-2 bg-black-russian-700 text-white rounded hover:bg-black-russian-800 ${
        props.full ? 'w-full' : 'w-fit'
      }`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};
