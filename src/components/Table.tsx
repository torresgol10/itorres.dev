import { cn } from "@/lib/utils";

export const Table = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
        <table
            className={cn("w-full border-collapse text-sm", className)}
            {...props}
        />
    </div>
);

export const Thead = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn("[&_tr]:border-b", className)} {...props} />
);

export const Tbody = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

export const Tr = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
        className={cn(
            "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
            className
        )}
        {...props}
    />
);

export const Th = ({
    className,
    ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
        className={cn(
            "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
);

export const Td = ({
    className,
    ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    />
);
