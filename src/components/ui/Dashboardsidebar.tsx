'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const links = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Create Post', href: '/dashboard/post-new' },
  { label: 'All Posts', href: '/dashboard/all-posts' },
  { label: 'Create Page', href: '/dashboard/page-new' },
  { label: 'Create Project', href: '/dashboard/project-new' },
  { label: 'All Projects', href: '/dashboard/all-projects' },
  { label: 'All Pages', href: '/dashboard/all-pages' }, // ✅ added this
  { label: 'Media Library', href: '/dashboard/media' },
  { label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-gray-100 p-6 border-r">
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              'block px-3 py-2 rounded text-sm font-medium transition-colors',
              pathname === link.href
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
