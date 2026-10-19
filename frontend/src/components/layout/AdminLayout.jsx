import React from "react";
import { WorkspaceLayout } from "./WorkspaceLayout";
import { ROUTES } from "../../app/routes";

const navigation = [[ROUTES.adminDashboard, "Dashboard"], [ROUTES.adminApplications, "Applications"], [ROUTES.adminUsers, "Users"], [ROUTES.adminClassrooms, "Classrooms"]];
export function AdminLayout() {
  return <WorkspaceLayout role="admin" navigation={navigation} />;
}
