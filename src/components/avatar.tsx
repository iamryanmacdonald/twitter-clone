import Image from "next/image";

export const Avatar = ({ src }: { src: string }) => {
  return (
    <Image
      src={src}
      alt="user avatar"
      className="rounded-full"
      height={48}
      width={48}
    />
  );
};
