import Link from "next/link"
import { ArrowLeft, Archive, File, Inbox, MoreHorizontal, Send, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MailPage() {
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

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 hidden md:block">
          <Button className="w-full mb-4">Compose</Button>

          <nav className="space-y-1">
            <Link
              href="/mail"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <Inbox className="h-4 w-4" />
              <span>Inbox</span>
              <span className="ml-auto bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full">
                12
              </span>
            </Link>
            <Link
              href="/mail"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Star className="h-4 w-4" />
              <span>Starred</span>
            </Link>
            <Link
              href="/mail"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Send className="h-4 w-4" />
              <span>Sent</span>
            </Link>
            <Link
              href="/mail"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <File className="h-4 w-4" />
              <span>Drafts</span>
              <span className="ml-auto bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium px-2 py-0.5 rounded-full">
                3
              </span>
            </Link>
            <Link
              href="/mail"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Archive className="h-4 w-4" />
              <span>Archive</span>
            </Link>
            <Link
              href="/mail"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Trash2 className="h-4 w-4" />
              <span>Trash</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="px-4 py-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Inbox</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">Sender Name</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">10:30 AM</p>
                    </div>
                    <h3 className="text-sm font-semibold truncate">Email Subject Line</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

