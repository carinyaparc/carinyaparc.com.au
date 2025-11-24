import Link from 'next/link';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-lg px-2 py-1 text-sm text-eucalyptus-600 hover:bg-eucalyptus-100 hover:text-eucalyptus-600"
    >
      {children}
    </Link>
  );
}
