import Image from "next/image";

export const Avatar = ({
  className,
  size,
  src,
}: {
  className?: string;
  size?: string;
  src: string;
}) => {
  return (
    <Image
      src={src}
      alt="user avatar"
      className={`rounded-full ${className ?? ""}`}
      height={size === "large" ? 96 : 48}
      width={size === "large" ? 96 : 48}
    />
  );
};
