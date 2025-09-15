import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "./pagination";

export default function PaginationComponent() {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <div className="flex gap-1">
          <PaginationItem>
            <PaginationLink href="#" className="text-primary text-xs">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="text-muted-foreground border-none text-xs"
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="text-muted-foreground border-none text-xs"
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis className="text-muted-foreground text-xs" />
          </PaginationItem>
        </div>
        <PaginationItem>
          <PaginationNext href="#" className="text-muted-foreground text-xs" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
