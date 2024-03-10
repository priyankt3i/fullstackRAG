import { Skeleton } from "@/components/ui/skeleton"

export default function ChatSkeleton() {
  return (
    <div className="flex p-4 items-center space-x-4">
      <Skeleton className="h-12 w-12 bg-gray-400 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[500px] bg-gray-400" />
        <Skeleton className="h-4 w-[400px] bg-gray-400" />
      </div>
    </div>
  )
}
