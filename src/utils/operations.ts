import { csvDataArrayType } from '@/types/Builder.dto';

export const sortData = (
  data: csvDataArrayType,
  key: string,
  order: 'asc' | 'dsc',
) => {
  const sortedData = [...data].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });

  return sortedData;
};
