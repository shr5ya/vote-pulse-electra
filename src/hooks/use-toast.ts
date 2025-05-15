
import { useToast as useToastLib } from "@/components/ui/toast";

export const useToast = useToastLib;
export const toast = {
  success: (message: string) => {
    const { toast } = useToast();
    return toast({
      title: "Success",
      description: message,
      variant: "default"
    });
  },
  error: (message: string) => {
    const { toast } = useToast();
    return toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  },
  warning: (message: string) => {
    const { toast } = useToast();
    return toast({
      title: "Warning",
      description: message,
      variant: "default"
    });
  },
  info: (message: string) => {
    const { toast } = useToast();
    return toast({
      title: "Info",
      description: message,
      variant: "default"
    });
  }
};
