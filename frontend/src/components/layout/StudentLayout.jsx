import React from "react";
import { WorkspaceLayout } from "./WorkspaceLayout";
import { ROUTES } from "../../app/routes";

const navigation = [[ROUTES.studentDashboard, "Dashboard"], [ROUTES.studentClassrooms, "Classrooms"], [ROUTES.studentLearning, "Learning"], [ROUTES.studentProgress, "Progress"], [ROUTES.studentProfile, "Profile"]];
export function StudentLayout() {
  return <WorkspaceLayout role="student" navigation={navigation} />;
}
