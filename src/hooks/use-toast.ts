import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
};

export function useToast() {
  const toast = ({ title, description, action, variant = "default" }: ToastProps) => {
    // Choose the appropriate toast function based on variant
    switch (variant) {
      case "destructive":
        sonnerToast.error(title, {
          description,
          action,
          style: { 
            backgroundColor: 'white', 
            borderLeft: '4px solid rgba(220, 38, 38, 1)' 
          }
        });
        break;
      case "success":
        sonnerToast.success(title, {
          description,
          action,
          style: { 
            backgroundColor: 'white', 
            borderLeft: '4px solid rgba(34, 197, 94, 1)' 
          }
        });
        break;
      case "warning":
        sonnerToast.warning(title, {
          description,
          action,
          style: { 
            backgroundColor: 'white', 
            borderLeft: '4px solid rgba(245, 158, 11, 1)' 
          }
        });
        break;
      case "info":
        sonnerToast.info(title, {
          description,
          action,
          style: { 
            backgroundColor: 'white', 
            borderLeft: '4px solid rgba(59, 130, 246, 1)' 
          }
        });
        break;
      default:
        sonnerToast(title, {
          description,
          action,
          style: { 
            backgroundColor: 'white',
            borderLeft: '4px solid rgba(110, 65, 226, 1)' // psyched-purple
          }
        });
    }
  };
  
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    error: (title: string, description?: string) => toast({
      title,
      description,
      variant: "destructive",
    }),
    success: (title: string, description?: string) => toast({
      title,
      description,
      variant: "success",
    }),
    warning: (title: string, description?: string) => toast({
      title,
      description,
      variant: "warning",
    }),
    info: (title: string, description?: string) => toast({
      title,
      description,
      variant: "info",
    }),
  };
}

export { sonnerToast as toast };
