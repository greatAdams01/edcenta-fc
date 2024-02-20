import Sidebar from "@/components/dashbord/Sidebar";

type LayoutProps = {
  children: React.ReactNode,
};

function AppLayout({ children }: LayoutProps) {
  return (
    <main>
      <Sidebar />
      { children }
    </main>
  )
}

export default AppLayout