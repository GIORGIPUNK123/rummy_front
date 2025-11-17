export const LeaveRummyModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  onLeave: () => void;
}) => {
  const { isOpen, onClose, onLeave } = props;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50'
        onClick={() => onClose()}
        aria-hidden
      />

      <div
        role='dialog'
        aria-modal='true'
        className='relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg'
      >
        <h2 className='mb-2 text-lg font-semibold text-black '>Leave Game</h2>
        <p className='mb-4 text-sm text-black'>
          Are you sure you want to leave the current game? Other players will be
          notified and the room state may change.
        </p>

        <div className='flex justify-end gap-3'>
          <button
            className='rounded-md border px-3 py-1 text-sm'
            onClick={() => onClose()}
          >
            Cancel
          </button>

          <button
            className=' cursor-pointer rounded-md bg-red-600 px-3 py-1 text-sm text-white'
            onClick={() => onLeave()}
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRummyModal;
