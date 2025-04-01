import Link from "next/link"
import { ArrowLeft, Book, HelpCircle, MessageSquare, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <header className="border-b bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Support Center</h1>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input type="search" placeholder="Search for help articles..." className="pl-10 py-6 text-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Get in touch with our support team for personalized help with your issues.
            </p>
            <Button>Start a Conversation</Button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Browse our comprehensive documentation and tutorials for self-service support.
            </p>
            <Button variant="outline">Browse Articles</Button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <HelpCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">FAQs</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Find answers to commonly asked questions about our services and features.
            </p>
            <Button variant="outline">View FAQs</Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Popular Articles</h2>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {[
              "How to set up your account",
              "Managing team members and permissions",
              "Integrating with third-party services",
              "Billing and subscription management",
              "Security best practices",
            ].map((article, i) => (
              <Link href="#" key={i} className="block px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Book className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{article}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last updated 3 days ago</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

