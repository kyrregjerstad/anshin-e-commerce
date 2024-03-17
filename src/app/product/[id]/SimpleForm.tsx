import { SubmitButton as Button } from './SubmitButton';

type Props = {
  action: (formData: FormData) => void;

  render: ({
    SubmitButton,
  }: {
    SubmitButton: typeof Button;
  }) => React.ReactNode;
};

export const SimpleForm = ({ action, render }: Props) => {
  return <form action={action}>{render({ SubmitButton: Button })}</form>;
};
