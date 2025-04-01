import Link from "next/link"
import { ArrowLeft, File, FileText, FolderOpen, Image, MoreHorizontal, Music, Upload, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function StoragePage() {
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
          <h1 className="text-2xl font-bold">Cloud Storage</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FolderOpen className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Storage Used</h3>
            </div>
            <div className="mb-2">
              <Progress value={35} className="h-2" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">3.5 GB of 10 GB used</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium">Documents</h3>
            </div>
            <div className="text-xl font-semibold">128</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">1.2 GB</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Image className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium">Images</h3>
            </div>
            <div className="text-xl font-semibold">432</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">1.8 GB</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Video className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-sm font-medium">Videos</h3>
            </div>
            <div className="text-xl font-semibold">15</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">0.5 GB</div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent Files</h2>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {[
              { name: "Project Proposal.docx", type: "document", size: "2.3 MB", date: "2 days ago" },
              { name: "Company Logo.png", type: "image", size: "1.5 MB", date: "3 days ago" },
              { name: "Quarterly Report.xlsx", type: "spreadsheet", size: "4.2 MB", date: "1 week ago" },
              { name: "Product Demo.mp4", type: "video", size: "24.5 MB", date: "2 weeks ago" },
              { name: "Meeting Notes.pdf", type: "document", size: "0.8 MB", date: "3 weeks ago" },
            ].map((file, i) => (
              <div key={i} className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    {file.type === "document" && <FileText className="h-5 w-5 text-blue-500" />}
                    {file.type === "image" && <Image className="h-5 w-5 text-purple-500" />}
                    {file.type === "spreadsheet" && <File className="h-5 w-5 text-green-500" />}
                    {file.type === "video" && <Video className="h-5 w-5 text-red-500" />}
                    {file.type === "audio" && <Music className="h-5 w-5 text-amber-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <span>{file.size}</span>
                      <span className="mx-2">•</span>
                      <span>Modified {file.date}</span>
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

