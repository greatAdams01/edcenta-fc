import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from "@/components/dashbord/AdminSide";

type LayoutProps = {
  children: React.ReactNode,
};

function AdminLayout({ children }: LayoutProps) {
  return (
    <main className="">
      <Sidebar>
      { children }
      <ToastContainer />
      </Sidebar>
    </main>
  )
}

export default AdminLayout