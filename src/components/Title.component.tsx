type TitleComponentProps = {
  children: React.ReactNode;
};

const Title = (props: TitleComponentProps) => (
  <h1 className="text-5xl font-white font-bold text-center">{props.children}</h1>
);

export default Title;
