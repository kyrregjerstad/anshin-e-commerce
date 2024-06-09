/* eslint-disable drizzle/enforce-delete-with-where */
'use client';
import debounce from 'lodash/debounce';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useState } from 'react';
import { Input } from './ui/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Label } from './ui/label';

export const SearchBar = () => {
  const [value, setValue] = useState('');
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const debouncedSearch = debounce(handleSearch, 200);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    debouncedSearch(e.currentTarget.value, searchParams, replace);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <Label htmlFor={`search`} className="sr-only">
        Search
      </Label>
      <Input
        placeholder="Search"
        value={value}
        onChange={handleChange}
        name="search"
        id={`search`}
        defaultValue={searchParams.get('q')?.toString()}
      />
      <MagnifyingGlassIcon
        className="absolute right-2 top-1 size-8 stroke-neutral-500"
        strokeWidth={1.3}
      />
    </div>
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
