import { type ReactNode } from 'react'
import { Footer } from '../shared/components/Footer'
import { Navbar } from '../shared/components/Navbar'

type MainLayoutProps = { children: ReactNode }

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout diary-workspace">
      <Navbar />
      <div className="workspace-main">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
