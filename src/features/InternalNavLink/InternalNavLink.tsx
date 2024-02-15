import { NavLink as RouterLink } from "react-router-dom";
import { NavLink } from "@mantine/core";

function InternalNavLink({ to, label }: InternalNavLinkProps) {
  return <NavLink component={RouterLink} to={to} label={label} />;
}

interface InternalNavLinkProps {
  to: string;
  label: string;
}

export default InternalNavLink;
