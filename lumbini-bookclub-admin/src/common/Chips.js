import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/solid";

function Primary({
  className,
  checked = false,
  onClick = (checked) => {},
  children,
}) {
  if (checked) {
    return (
      <Chip
        className={`bg-indigo-600 hover:bg-indigo-700 text-white ${className}`}
        onClick={() => onClick(!checked)}
      >
        <CheckCircleIcon className="w-5 h-5 mr-1" /> {children}
      </Chip>
    );
  }

  return (
    <Chip
      className={`text-gray-600 bg-gray-200 hover:bg-gray-300 ${className}`}
      onClick={() => onClick(!checked)}
    >
      {children}
    </Chip>
  );
}

function Default({ className, onClick, children }) {
  return (
    <Chip
      className={`text-gray-600 bg-gray-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </Chip>
  );
}

function DeleteAction({ className, onClick }) {
  return (
    <div role="button" onClick={onClick} className={`ml-2 ${className}`}>
      <MinusCircleIcon className="w-[22px] h-[22px] text-gray-600 hover:text-gray-800" />
    </div>
  );
}

export function Chip({ className, onClick, children }) {
  return (
    <div
      role="button"
      className={`flex items-center px-2 py-1 rounded-full font-medium select-none ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

Chip.Primary = Primary;
Chip.Default = Default;
Chip.DeleteAction = DeleteAction;

export function ChipGroups({
  list = [],
  checkedList = [],
  onCheckedListChange = (list) => {},
}) {
  function handleCheckChange(e, checked) {
    let cList = [...checkedList];
    if (checked) {
      cList.push(e);
    } else {
      let i = cList.findIndex((v) => v === e);
      cList.splice(i, 1);
    }

    onCheckedListChange(cList);
  }

  return (
    <div className="flex flex-wrap">
      {list.map((e, i) => (
        <Chip.Primary
          key={i}
          onClick={(checked) => handleCheckChange(e, checked)}
          checked={checkedList.find((v) => v === e)}
          className="mr-2 mb-2"
        >
          {e}
        </Chip.Primary>
      ))}
    </div>
  );
}
