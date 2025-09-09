import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";

export default function MyTeamMembersSkeleton() {
  return (
    <div className="rounded-lg border border-black/10">
      <Table>
        <TableBody>
          {[...Array(3)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {/* Avatar skeleton */}
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                  <div className="flex flex-col gap-2">
                    {/* Name skeleton */}
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    {/* Tech stacks skeleton */}
                    <div className="flex gap-1">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="h-5 w-12 animate-pulse rounded-full bg-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {/* Label skeleton */}
                  <div className="h-3 w-8 animate-pulse rounded bg-gray-200" />
                  {/* Role skeleton */}
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {/* Label skeleton */}
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                  {/* Date skeleton */}
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </div>
              </TableCell>
              <TableCell>
                {/* Button skeleton */}
                <div className="h-8 w-8 animate-pulse rounded border bg-gray-200" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
