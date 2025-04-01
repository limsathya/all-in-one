import Link from "next/link"
import { Mail, FileText, HardDrive, CreditCard, HeadphonesIcon } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              W
            </div>
            <h1 className="text-xl font-bold">Workspace</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/mail" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Mail
            </Link>
            <Link href="/office" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Office
            </Link>
            <Link href="/storage" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Storage
            </Link>
            <Link href="/billing" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Billing
            </Link>
            <Link href="/support" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Support
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Welcome to your Workspace</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/mail" className="group">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">Mail System</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Access your emails, manage contacts, and organize your inbox.
              </p>
            </div>
          </Link>

          <Link href="/office" className="group">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                Office System
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Create, edit and collaborate on documents, spreadsheets and presentations.
              </p>
            </div>
          </Link>

          <Link href="/storage" className="group">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <HardDrive className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                Cloud Storage
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Store, share and access your files from anywhere securely.
              </p>
            </div>
          </Link>

          <Link href="/billing" className="group">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-600 transition-colors">
                Billing System
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Manage subscriptions, view invoices and handle payments.
              </p>
            </div>
          </Link>

          <Link href="/support" className="group">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
                <HeadphonesIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-rose-600 transition-colors">Online Support</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Get help from our support team and access knowledge base.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}

