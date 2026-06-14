export const DraggableNode = ({ type, label, Icon }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType }),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, type)}
      className="group flex min-w-[110px] cursor-grab flex-col items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800 p-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:cursor-grabbing"
    >
      <span>{label}</span>
      {Icon && (
        <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-400" />
      )}
    </div>
  );
};
