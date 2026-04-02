'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/pedidos', label: 'Pedidos', icon: <ShoppingCart size={18} /> },
  { href: '/admin/productos', label: 'Productos', icon: <Package size={18} /> },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gold/20">
        <div className="flex items-center justify-between">
          <h1 className="font-playfair text-gold font-bold text-lg leading-tight">
            ✦ Lluvia de<br />Bendiciones
          </h1>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-cream/60 hover:text-cream"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-cream/40 text-xs mt-1">Panel de Administración</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`admin-nav-link ${pathname === href ? 'active' : 'text-cream/70'}`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-gold/20 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="admin-nav-link text-cream/50 text-xs"
        >
          <ExternalLink size={16} />
          <span>Ver sitio web</span>
        </Link>
        <button
          onClick={handleLogout}
          className="admin-nav-link text-cream/50 hover:text-red-400 w-full"
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark border-b border-gold/20 flex items-center justify-between px-4 py-3">
        <span className="font-playfair text-gold font-bold">✦ Admin</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-cream"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark border-r border-gold/20 fixed left-0 top-0 bottom-0 z-30">
        <SidebarContent />
      </aside>
    </>
  )
}
