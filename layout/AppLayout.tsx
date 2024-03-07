import Sidebar from "@/components/dashbord/Sidebar";
import Header from "@/components/dashbord/Header"

type LayoutProps = {
  children: React.ReactNode,
};

function AppLayout({ children }: LayoutProps) {
  return (
    <main className="grid lg:flex">
      <Sidebar />
      <div className="grid">
      <Header />
      { children }
      </div>
    </main>
  )
}

export default AppLayout