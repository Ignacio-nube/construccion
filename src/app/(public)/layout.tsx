import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CarritoDrawer from '@/components/carrito/CarritoDrawer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <CarritoDrawer />
      <WhatsAppButton />
    </>
  )
}
