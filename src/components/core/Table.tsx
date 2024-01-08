import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

declare type Props = {
  data: Array<{
    [key: string]: string | number | boolean;
  }>;
  columns: Array<string>;
};

export function DataTable({ data, columns }: Props) {
  return (
    <Table className="rounded-lg overflow-hidden">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow className="!bg-gray-950">
          {columns.map((column) => (
            <TableHead className="!text-white text-xs" key={column}>
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((data, index) => (
          <TableRow key={index} className="!bg-gray-950">
            {Object.keys(data).map((key) => (
              <TableCell className="!text-white text-xs !py-2" key={key}>
                {data[key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
