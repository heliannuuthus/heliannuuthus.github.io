import { Card } from "@heroui/react/card";
import { clsx } from "clsx";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

export default function GlassCard({
  children,
  className,
  title,
  description,
  footer,
  hoverable = true
}: GlassCardProps) {
  return (
    <Card
      className={clsx(
        "surface rounded-[20px]",
        hoverable &&
          "hover:surface-raised hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)]",
        className
      )}
    >
      {(title || description) && (
        <Card.Header className="px-7 pt-6 pb-0">
          {title && <Card.Title>{title}</Card.Title>}
          {description && (
            <Card.Description>{description}</Card.Description>
          )}
        </Card.Header>
      )}
      <Card.Content className="px-7 py-6">{children}</Card.Content>
      {footer && <Card.Footer className="px-7 pb-6 pt-0">{footer}</Card.Footer>}
    </Card>
  );
}
