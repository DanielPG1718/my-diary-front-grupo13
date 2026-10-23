import { type ReactNode } from 'react'
import { Footer } from '../shared/components/Footer'
import { Navbar } from '../shared/components/Navbar'
import { Sidebar } from '../shared/components/Sidebar'

type MainLayoutProps = {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="main-layout__body">
        <Sidebar />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  )
}
