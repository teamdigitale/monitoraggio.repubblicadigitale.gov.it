declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassName;
  export default classNames;
}
