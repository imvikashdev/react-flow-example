import {
  csvDataArrayType,
  filterTypes,
  filterTypesEnum,
} from '@/types/Builder.dto';

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

export const sliceData = (
  data: csvDataArrayType,
  startIndex: number,
  endIndex: number,
) => {
  const slicedData = [...data].slice(startIndex, endIndex);

  return slicedData;
};

export const filterData = (
  data: csvDataArrayType,
  filterType: filterTypes,
  columnKey: string,
  value: string,
  invert: boolean,
) => {
  const filteredData = [...data].filter((row) => {
    if (row[columnKey] === undefined) return false;
    switch (filterType) {
      case filterTypesEnum.string:
        return invert
          ? row[columnKey].toString() !== value
          : row[columnKey].toString() === value;
      case filterTypesEnum.number:
        return invert
          ? row[columnKey] !== Number(value)
          : row[columnKey] === Number(value);
      case filterTypesEnum.contains:
        return invert
          ? !row[columnKey].toString().includes(value)
          : row[columnKey].toString().includes(value);
      case filterTypesEnum['greater-than']:
        return Number(row[columnKey]) > Number(value);
      case filterTypesEnum['less-than']:
        return Number(row[columnKey]) < Number(value);
      case filterTypesEnum.regex: {
        const sanitizedRegexString = value.slice(1, -1).replace(/\\\\/g, '\\');
        const regex = new RegExp(sanitizedRegexString);
        return regex.test(row[columnKey].toString());
      }
    }
  });

  return filteredData;
};

export const groupData = (
  data: csvDataArrayType,
  columnKey: string,
): {
  [key: string]: csvDataArrayType;
} => {
  const groupedData = [...data].reduce(
    (
      acc: {
        [key: string]: csvDataArrayType;
      },
      row,
    ) => {
      if (!row[columnKey]) return acc;
      const key = row[columnKey].toString();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(row);
      return acc;
    },
    {},
  );

  return groupedData;
};
