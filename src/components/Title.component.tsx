import { PropsWithChildren } from 'react';
import { cn } from '@nextui-org/react';

type TitleComponentProps = {
  className?: string;
} & PropsWithChildren;

const Title = (props: TitleComponentProps) => (
  <h1 className={cn('text-5xl font-white font-bold', props.className)}>
    {props.children}
  </h1>
);

export default Title;
