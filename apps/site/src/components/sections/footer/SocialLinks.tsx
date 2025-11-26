/**
 * SocialLinks sub-component - Extracted from Footer
 * Maps to: FR-5, NFR-3
 * Task: T4.2
 */

interface SocialLink {
  name: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

interface SocialLinksProps {
  links: SocialLink[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="flex justify-center mt-4 md:mt-0 md:order-2">
      {links.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="text-charcoal-400 hover:text-eucalyptus-600 mx-2 transition-colors"
          aria-label={`${item.name} social link`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="sr-only">{item.name}</span>
          <item.icon aria-hidden="true" className="h-6 w-6" />
        </a>
      ))}
    </div>
  );
}

