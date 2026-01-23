import * as React from "react";
import { cn } from "@/utils/utils";

export interface SpanAreaProps
  extends Omit<React.ComponentProps<"span">, "width" | "height"> {
  width?: string | number;
  height?: string | number;
}

const SpanArea = React.forwardRef<HTMLSpanElement, SpanAreaProps>(
  ({ className, width, height, children, ...props }, ref) => {
    const widthStyle = width
      ? typeof width === "number"
        ? `${width}px`
        : width
      : "100%";

    const heightStyle = height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : "auto";

    return (
      <span
        className={cn(
          // 기본 스타일
          "inline-block w-full text-[1rem] font-normal text-[#1A1A1A] leading-[160%]",
          "px-[1.5rem] py-[1.25rem]",
          "rounded-[1rem]",
          "border border-[#74777D]",
          className
        )}
        style={{ width: widthStyle, height: heightStyle }}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

SpanArea.displayName = "SpanArea";

export default SpanArea;
