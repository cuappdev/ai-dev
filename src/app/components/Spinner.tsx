interface SpinnerProps {
  width: string;
  height: string;
}

export default function Spinner({ width, height }: SpinnerProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={`animate-spin rounded-full border-2 border-gray-200 border-t-primaryColor`}
        style={{ width: `${width}rem`, height: `${height}rem` }}
      ></div>
    </div>
  );
}
