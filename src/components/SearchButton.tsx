import { SearchIcon } from './icons/SearchIcon';

interface SearchButtonProps {
  onClick?: () => void;
}

export const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <button
      type='button'
      className='flex cursor-pointer justify-center border-none bg-transparent'
      onClick={onClick}
    >
      <SearchIcon />
    </button>
  );
};
