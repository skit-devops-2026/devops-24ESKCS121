import React from "react";
import { WorkspaceLayout } from "./WorkspaceLayout";
import { ROUTES } from "../../app/routes";

const navigation = [[ROUTES.teacherDashboard, "Dashboard"], [ROUTES.teacherApplication, "Application"], [ROUTES.teacherClassrooms, "Classrooms"], [ROUTES.teacherStudents, "Students"], [ROUTES.teacherProfile, "Profile"]];
export function TeacherLayout() {
  return <WorkspaceLayout role="teacher" navigation={navigation} />;
}
