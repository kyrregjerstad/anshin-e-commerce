/* eslint-disable drizzle/enforce-delete-with-where */
'use client';
import {
  ReadonlyURLSearchParams,
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useState } from 'react';
import { Input } from './ui/input';
import debounce from 'lodash/debounce';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const SearchBar = () => {
  const [value, setValue] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace, push } = useRouter();

  const debouncedSearch = debounce(handleSearch, 200);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    debouncedSearch(e.currentTarget.value, searchParams, replace);
  };

  return (
    <Input
      className="w-full"
      placeholder="Search"
      value={value}
      onChange={handleChange}
      defaultValue={searchParams.get('q')?.toString()}
    />
  );
};

const handleSearch = (
  searchTerm: string,
  searchParams: ReadonlyURLSearchParams,
  replace: AppRouterInstance['replace']
) => {
  const params = new URLSearchParams(searchParams);
  if (searchTerm && searchTerm.trim().length > 0) {
    params.set('q', searchTerm);
    replace(`/search?${params.toString()}`);
  } else {
    params.delete('q');
    replace(`/`);
  }
};
