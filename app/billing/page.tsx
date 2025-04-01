import Link from "next/link"
import { ArrowLeft, CreditCard, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BillingPage() {
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
          <h1 className="text-2xl font-bold">Billing & Subscription</h1>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
            <div className="mb-4">
              <div className="text-2xl font-bold">Business Pro</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">$29.99/month</div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              <p>
                Your next billing date is <strong>May 1, 2025</strong>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Change Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Expires 12/25</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit Payment Method
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
            <div className="text-sm mb-6">
              <p className="mb-1">John Doe</p>
              <p className="mb-1">123 Business Street</p>
              <p className="mb-1">Suite 100</p>
              <p className="mb-1">San Francisco, CA 94103</p>
              <p>United States</p>
            </div>
            <Button variant="outline" size="sm">
              Edit Address
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Billing History</h2>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {[
              { date: "Apr 1, 2025", amount: "$29.99", status: "Paid" },
              { date: "Mar 1, 2025", amount: "$29.99", status: "Paid" },
              { date: "Feb 1, 2025", amount: "$29.99", status: "Paid" },
              { date: "Jan 1, 2025", amount: "$29.99", status: "Paid" },
              { date: "Dec 1, 2024", amount: "$29.99", status: "Paid" },
            ].map((invoice, i) => (
              <div key={i} className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Invoice {i + 1}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">{invoice.amount}</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {invoice.status}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

