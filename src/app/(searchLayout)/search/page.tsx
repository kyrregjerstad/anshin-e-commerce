import React from 'react';
import { SearchPage } from '../SearchPage';

type Props = {
  searchParams?: {
    q?: string;
  };
};

const page = ({ searchParams }: Props) => {
  const query = searchParams?.q ?? '';

  return <SearchPage query={query} />;
};

export default page;
