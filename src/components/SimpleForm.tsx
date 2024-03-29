import { SubmitButton as Button } from '../app/product/[id]/SubmitButton';

type Props = {
  action: (formData: FormData) => void;
  spinner?: boolean;
  render: ({
    SubmitButton,
  }: {
    SubmitButton: typeof Button;
    spinner?: boolean;
  }) => React.ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>;

export const SimpleForm = ({ action, render, spinner, ...rest }: Props) => {
  return (
    <form action={action} {...rest}>
      {render({ SubmitButton: Button, spinner })}
    </form>
  );
};
