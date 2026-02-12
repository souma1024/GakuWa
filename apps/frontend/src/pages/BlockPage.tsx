import { Outlet, useOutletContext } from 'react-router-dom';
import { User } from "../type/user";

export default function BlockPage() {
  const user = useOutletContext<User | null>();
  return <Outlet context={ user } />;
}