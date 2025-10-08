"use client";

import { ReactNode, useEffect } from "react";
import { observer } from "mobx-react";
import { Outlet, useNavigate } from "react-router";
import { LogoSpinner } from "@/components/common/logo-spinner";
import { NewUserPopup } from "@/components/new-user-popup";
import { useUser } from "@/hooks/store";
import { AdminHeader } from "../../../app/(all)/(dashboard)/header";
import { AdminSidebar } from "../../../app/(all)/(dashboard)/sidebar";

const AuthenticatedLayoutComponent = ({ children }: { children?: ReactNode }) => {
	const navigate = useNavigate();
	const { isUserLoggedIn } = useUser();

	useEffect(() => {
		if (isUserLoggedIn === false) {
			void navigate("/", { replace: true });
		}
	}, [isUserLoggedIn, navigate]);

	if (isUserLoggedIn === undefined) {
		return (
			<div className="relative flex h-screen w-full items-center justify-center">
				<LogoSpinner />
			</div>
		);
	}

	if (!isUserLoggedIn) {
		return null;
	}

	return (
		<div className="relative flex h-screen w-screen overflow-hidden">
			<AdminSidebar />
			<main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-100">
				<AdminHeader />
				<div className="h-full w-full overflow-hidden">
					{children ?? <Outlet />}
				</div>
			</main>
			<NewUserPopup />
		</div>
	);
};

export default observer(AuthenticatedLayoutComponent);
