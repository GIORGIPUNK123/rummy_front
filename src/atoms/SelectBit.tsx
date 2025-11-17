export const SelectBit = (props: {
  active: boolean;
  text: string;
  onClick: () => void;
  full?: boolean;
}) => {
  return (
    <div
      className={`flex ${
        props.full ? 'w-full' : 'w-44'
      } items-center gap-2 sm:gap-3 cursor-pointer rounded-xl border px-3 sm:px-4 py-2 sm:py-3 font-medium transition-all text-center relative text-sm sm:text-base
        ${
          props.active
            ? 'bg-black-russian-700 text-white border-black-russian-800 shadow-md'
            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
        }
      `}
      onClick={props.onClick}
    >
      <div
        className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 shrink-0 transition-all
          ${
            props.active
              ? 'bg-white border-transparent'
              : 'bg-gray-200 border-gray-300'
          }
        `}
      ></div>

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        {props.text}
      </div>
    </div>
  );
};
