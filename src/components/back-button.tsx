import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

export const BackButton = ({
  className,
  type,
}: {
  className?: string;
  type?: string;
}) => {
  const router = useRouter();

  return (
    <div
      className={`flex w-fit items-center gap-1 rounded-sm px-2 py-2 hover:cursor-pointer ${
        type === "light" ? "hover:bg-slate-900" : "hover:bg-slate-950"
      } ${className ?? ""}`}
      onClick={() => void router.back()}
    >
      <ArrowLeft />
      <span>Back</span>
    </div>
  );
};
