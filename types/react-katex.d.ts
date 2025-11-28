declare module "react-katex" {
  import { ComponentType } from "react";

  interface MathProps {
    math: string;
  }

  export const BlockMath: ComponentType<MathProps>;
  export const InlineMath: ComponentType<MathProps>;
}

