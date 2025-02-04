import React from "react";
import { cn } from "../../utils/class-utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export function SimpleCard({
  className,
  title,
  content,
  headerClasses,
  contentClasses,
  action,
}: {
  className?: string;
  title: string;
  content: React.ReactNode;
  headerClasses?: string;
  contentClasses?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader
        action={action}
        className={cn("sm:tw-min-h-[71px]", headerClasses)}
      >
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn(contentClasses)}>{content}</CardContent>
    </Card>
  );
}
