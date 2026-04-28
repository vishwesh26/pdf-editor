import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-bold text-lg">PDFTextEdit Pro</p>
          <p className="text-sm text-muted-foreground mt-1">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <div className="flex space-x-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
