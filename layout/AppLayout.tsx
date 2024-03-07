import Sidebar from "@/components/dashbord/Sidebar";

type LayoutProps = {
  children: React.ReactNode,
};

function AppLayout({ children }: LayoutProps) {
  return (
    <main className="">
      <Sidebar>
      { children }
      </Sidebar>
    </main>
  )
}

export default AppLayout