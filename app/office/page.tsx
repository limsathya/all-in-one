import Link from "next/link"
import { ArrowLeft, File, FileText, FolderOpen, MoreHorizontal, Plus, Table } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfficePage() {
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
          <h1 className="text-2xl font-bold">Office</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Create and edit text documents with formatting.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">5 recent documents</span>
              <Button variant="ghost" size="sm">
                Open
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Table className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Spreadsheets</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Create and manage data with spreadsheets.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">3 recent spreadsheets</span>
              <Button variant="ghost" size="sm">
                Open
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <File className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Presentations</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Create and deliver beautiful presentations.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">2 recent presentations</span>
              <Button variant="ghost" size="sm">
                Open
              </Button>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Recent Documents</h2>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">Document Name {i}</p>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <FolderOpen className="h-3 w-3 mr-1" />
                      <span>Personal</span>
                      <span className="mx-2">•</span>
                      <span>Edited 2 days ago</span>
                    </div>
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

