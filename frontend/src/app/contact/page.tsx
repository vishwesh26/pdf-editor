import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-4">Contact Support</h1>
        <p className="text-xl text-muted-foreground">We're here to help. Reach out to us anytime.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold">Email Us</h3>
                <p className="text-muted-foreground mb-1">Our friendly team is here to help.</p>
                <a href="mailto:support@pdftextedit.pro" className="text-blue-600 dark:text-blue-400 font-medium">support@pdftextedit.pro</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="font-bold">Live Chat</h3>
                <p className="text-muted-foreground mb-1">Available Mon-Fri, 9am - 5pm EST.</p>
                <button className="text-purple-600 dark:text-purple-400 font-medium">Start Chat</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-black/10 dark:border-white/10 shadow-lg">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input type="text" id="name" className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" placeholder="Jane Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input type="email" id="email" className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" placeholder="jane@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea id="message" rows={4} className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
