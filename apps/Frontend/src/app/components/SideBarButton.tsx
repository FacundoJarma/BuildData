function SideBarButton({ text, handleClick }: { text: string, handleClick: () => void }) {
  return (
    <button 
    onClick={handleClick}
    className="cursor-pointer text-sm font-medium text-slate-700 w-full text-start px-11 py-2 border-l-2 border-transparent hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-r">
      {text}
    </button>
  );
}

export default SideBarButton;
