import * as React from "react";
import { cn } from "@/utils/utils";

export interface InputAreaProps
  extends Omit<React.ComponentProps<"input">, "width"> {
  variant?: "default" | "rounded";
  width?: string | number;
  rightElement?: React.ReactNode;
}

const InputArea = React.forwardRef<HTMLInputElement, InputAreaProps>(
  ({ className, type, variant = "default", width, readOnly, rightElement, ...props }, ref) => {
    const widthStyle = width
      ? typeof width === "number"
        ? `${width}px`
        : width
      : "100%";

    return (
      <div className="relative" style={{ width: widthStyle }}>
        <input
          type={type}
          readOnly={readOnly}
          className={cn(
            // 기본 스타일
            "flex w-full bg-transparent text-[#1A1A1A] transition-colors typo-text-field md:text-[1rem] md:font-normal",
            "px-[1.25rem] py-[0.75rem]",
            "border border-[#74777D]",
            "placeholder:text-[#74777D]",

            // variant
            variant === "rounded" && "rounded-[6.25rem]",
            variant === "default" && "rounded-[0.5rem]",

            // readOnly
            readOnly && "cursor-default bg-gray-50",
            
            // rightElement가 있을 때 padding 조정
            rightElement && "pr-[3rem]",
            
            className
          )}
          ref={ref}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-[1.25rem] top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

InputArea.displayName = "InputArea";

export default InputArea;
