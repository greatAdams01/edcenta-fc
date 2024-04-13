import Sidebar from "@/components/dashbord/AdminSide";

type LayoutProps = {
  children: React.ReactNode,
};

function AdminLayout({ children }: LayoutProps) {
  return (
    <main className="">
      <Sidebar>
      { children }
      </Sidebar>
    </main>
  )
}

export default AdminLayout