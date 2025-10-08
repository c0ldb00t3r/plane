import Image from "next/image";
import { useTheme } from "next-themes";
import logoSpinnerDark from "@/app/assets/images/logo-spinner-dark.gif?url";
import logoSpinnerLight from "@/app/assets/images/logo-spinner-light.gif?url";

export const InstanceLoading = () => {
  const { resolvedTheme } = useTheme();

  const logoSrc = resolvedTheme === "dark" ? logoSpinnerLight : logoSpinnerDark;

  return (
    <div className="flex items-center justify-center">
      <Image src={logoSrc} alt="logo" className="h-6 w-auto sm:h-11" />
    </div>
  );
};
