import SubSidebar from "@/components/dashbord/subSidebar";

type LayoutProps = {
  children: React.ReactNode,
};

function AppLayout({ children }: LayoutProps) {
  return (
    <main className="">
      <SubSidebar>
      { children }
      </SubSidebar>
    </main>
  )
}

export default AppLayout