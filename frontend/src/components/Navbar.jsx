import { useState } from 'react'
import { Droplets, Menu, X, ArrowUpRight } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-green-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

        <a href="#home" className="flex items-center gap-2">
          <div className="bg-green-800 p-2.5 rounded-xl">
            <Droplets size={23} className="text-white" />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-green-950">
            Dairy<span className="text-green-600">Flow.</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-9">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-gray-600 hover:text-green-700 transition"
            >
              {link.name}
            </a>
          ))}
        </div>

        <a
          href="#dashboard"
          className="hidden md:flex items-center gap-2 bg-green-800 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition"
        >
          Get Started <ArrowUpRight size={17} />
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-green-900"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-green-100 px-6 py-6 flex flex-col gap-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-semibold text-green-900"
            >
              {link.name}
            </a>
          ))}

          <a
            href="#dashboard"
            onClick={() => setMenuOpen(false)}
            className="bg-green-800 text-white p-3 rounded-xl text-center font-bold"
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  )
}