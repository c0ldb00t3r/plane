"use client";

import { ReactNode } from "react";
import { Outlet } from "react-router";

const PublicLayout = ({ children }: { children?: ReactNode }) => (
  <div className="relative z-10 flex flex-col items-center w-screen h-screen overflow-hidden overflow-y-auto pt-6 pb-10 px-8">
    {children ?? <Outlet />}
  </div>
);

export default PublicLayout;
