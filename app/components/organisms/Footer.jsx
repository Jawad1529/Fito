'use client';

import Link from 'next/link';
import Icon from '../atoms/Icon';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Divider from '../atoms/Divider';
import { Caption, Text } from '../atoms/Typography';

const shopLinks = [
  { label: 'All Products', href: '/shop' },
  { label: 'Protein Powder', href: '/shop/protein-powder' },
  { label: 'Protein Bars', href: '/shop/protein-bars' },
  { label: 'Creatine', href: '/shop/creatine' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Consultation', href: '/consultation' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const supportLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping Info', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'Track Order', href: '/track-order' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const socialLinks = [
  { name: 'facebook', href: 'https://facebook.com' },
  { name: 'instagram', href: 'https://instagram.com' },
  { name: 'twitter', href: 'https://twitter.com' },
  { name: 'youtube', href: 'https://youtube.com' },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <Caption className="text-white/50">{title}</Caption>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add newsletter subscription logic here
  };

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold text-white tracking-tight"
            >
              Fito
            </Link>

            <Text muted className="mt-3 max-w-xs text-sm">
              Premium supplements and personalized diet consultation to help
              you reach your fitness goals, faster.
            </Text>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/60 hover:text-black hover:bg-yellow-400 hover:border-yellow-400 transition-colors"
                >
                  <Icon name={social.name} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Support" links={supportLinks} />

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Caption className="text-white/50">
              Stay in the loop
            </Caption>

            <Text muted className="mt-4 text-sm">
              New drops, diet tips, and member-only offers — no spam.
            </Text>

            <form
              onSubmit={handleSubmit}
              className="mt-4 flex items-center gap-2"
            >
              <Input
                type="email"
                placeholder="you@email.com"
                icon={<Icon name="mail" className="w-4 h-4" />}
                aria-label="Email address"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="shrink-0"
                aria-label="Subscribe"
                icon={<Icon name="arrowRight" className="w-4 h-4" />}
              />
            </form>
          </div>
        </div>

        <Divider className="mt-12 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Fito. All rights reserved.</p>

          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}