export const LeaveRoomBtn = (props: { handleClick: () => void }) => {
  return (
    <button
      onClick={props.handleClick}
      className='z-10 absolute cursor-pointer top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition-colors'
    >
      Leave Room
    </button>
  );
};
