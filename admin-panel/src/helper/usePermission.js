import { useSelector } from "react-redux";

export const usePermission = (module, action) => {
  const permissions = useSelector((state) => state.permission.permissions);

  const perm = permissions.find((p) => p.module.name === module);

  return perm?.all || perm?.[action];
};