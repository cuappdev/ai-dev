interface SpinnerProps {
  width: string;
  height: string;
}

export default function Spinner({ width, height }: SpinnerProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className={`border-2 border-gray-200 border-t-primaryColor rounded-full animate-spin`}
        style={{ width: `${width}rem`, height: `${height}rem` }}
      ></div>
    </div>
  );
}
