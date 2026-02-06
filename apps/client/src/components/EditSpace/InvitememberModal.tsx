import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { X, Mail, Send, XCircle } from "lucide-react";
import { inviteUsersToSpace } from "@/api/SpaceApi";
import { toast } from "sonner";
import type { SpaceI } from "@repo/types";

interface InviteMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceDetails: SpaceI | null;
setSpaceDetails: React.Dispatch<React.SetStateAction<SpaceI | null>>;
}

function InviteMembersModal({ open, onOpenChange, spaceDetails,setSpaceDetails }: InviteMembersModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add email from input
  const addEmail = () => {
    const email = emailInput.trim();
    if (email && isValidEmail(email) && !emails.includes(email)) {
      setEmails([...emails, email]);
      setEmailInput("");
    }
  };

  // Remove email from list
  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  // Handle Enter key and comma
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addEmail();
    }
    if (e.key === "Backspace" && emailInput === "" && emails.length > 0) {
      e.preventDefault();
      setEmailInput(emails[emails.length - 1]);
      removeEmail(emails[emails.length - 1]);
    }
  };

  // Handle paste multiple emails
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const pastedEmails = pastedText
      .split(/[,\s\n]+/)
      .map(email => email.trim())
      .filter(email => isValidEmail(email) && !emails.includes(email));
    
    if (pastedEmails.length > 0) {
      setEmails([...emails, ...pastedEmails]);
    } else {
      setEmailInput(pastedText);
    }
  };

  // Send invitations
  const handleSendInvites = async () => {
    if (emails.length === 0) return;
    
    setIsSending(true);
     try {
            const response = await inviteUsersToSpace(spaceDetails?.slug|| "", emails, window.location.origin);
            const invites=response.data.invites;
            setSpaceDetails((prev)=> {
              if(!prev) return prev;
              return {  
                ...prev,
                invites:invites
              }
            });
            toast.success("Invitations sent successfully",{duration:1000});
             onOpenChange(false);
            setEmails([]);
            setEmailInput("");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to send invitations"
           ,{duration:1500}); 
        } finally {
            setIsSending(false);
        }
  };

  const OnClose=() =>{
    setEmails([]);
    setEmailInput("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={OnClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bricogrotesque">
                Invite to {spaceDetails?.name || ""}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Invite members to collaborate on this space
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="space-y-6 py-1">
            {/* Email Input Section */}
            <div className="space-y-3">
              <Label htmlFor="email-input" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email addresses
              </Label>
              
              <div className="relative">
                <div className={`
                  border rounded-lg p-3 bg-background transition-all
                  ${emails.length > 0 ? "pb-8" : ""}
                  focus-within:ring-2 focus-within:ring-primary focus-within:border-primary
                  hover:border-muted-foreground/50
                `}>
                  {/* Email Chips */}
                  {emails.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {emails.map(email => (
                        <Badge
                          key={email}
                          variant="secondary"
                          className="pl-3 pr-2 py-1.5 group hover:bg-muted/80"
                        >
                          <span className="text-sm font-medium">{email}</span>
                          <button
                            onClick={() => removeEmail(email)}
                            className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
                            type="button"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex items-center gap-2">
                    <input
                      id="email-input"
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      placeholder="name@example.com"
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                      autoComplete="off"
                    />
                    
                    {emailInput && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={addEmail}
                        className="h-7 px-2 text-xs"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>

                {/* Helper Text */}
                <p className="text-xs text-muted-foreground mt-2 px-1">
                  Press Enter, comma, or space to add emails. Paste multiple emails separated by commas.
                </p>
              </div>
            </div>

            {/* Invitation Preview */}
            {emails.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Invitation preview ({emails.length})
                </Label>
                <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                  {emails.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{email}</div>
                          <div className="text-xs text-muted-foreground">
                            Will receive invitation email
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmail(email)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {emails.length === 0 ? (
                "Add at least one email to continue"
              ) : (
                <span className="text-green-600 dark:text-green-400">
                  Ready to send {emails.length} invitation{emails.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={OnClose}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleSendInvites}
                disabled={emails.length === 0 || isSending}
                className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invites
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default InviteMembersModal;