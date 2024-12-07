interface SpinnerProps {
  width?: string;
  height?: string;
}

export default function Spinner({ width = '16', height = '16' }: SpinnerProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <div className={`w-${width} h-${height} border-2 border-gray-200 border-t-primaryColor rounded-full animate-spin`}></div>
    </div>
  );
}
