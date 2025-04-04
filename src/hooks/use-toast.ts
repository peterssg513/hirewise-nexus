
import { Toast, toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
};

const toasts: ToastProps[] = [];

export function useToast() {
  const toast = ({ title, description, action, variant = "default" }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Choose the appropriate toast function based on variant
    switch (variant) {
      case "destructive":
        sonnerToast.error(title, {
          id,
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
          id,
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
          id,
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
          id,
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
          id,
          description,
          action,
          style: { 
            backgroundColor: 'white',
            borderLeft: '4px solid rgba(110, 65, 226, 1)' // psyched-purple
          }
        });
    }
    
    // Store the toast for reference
    toasts.push({ id, title, description, action, variant } as any);
    
    return id;
  };
  
  return {
    toast,
    toasts,
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
