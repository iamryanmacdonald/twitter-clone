import Image from "next/image";

export const Avatar = ({
  className,
  size,
  src,
}: {
  className?: string;
  size?: "large" | "micro";
  src: string;
}) => {
  const sizeMap = {
    large: 96,
    micro: 24,
  };

  return (
    <Image
      src={src}
      alt="user avatar"
      className={`rounded-full ${className ?? ""}`}
      height={size ? sizeMap[size] : 48}
      width={size ? sizeMap[size] : 48}
    />
  );
};
