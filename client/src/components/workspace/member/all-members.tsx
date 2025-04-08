import { ChevronDown, Loader } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-member";
import { changeWorkspaceMemberRoleMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
const AllMembers = () => {
  const { user, hasPermission } = useAuthContext();
  const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];
  const roles = data?.roles || [];
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
  });
  const handleSelect = (roleId: string, memberId: string) => {
    if (!roleId || !memberId) return;
    const payload = {
      workspaceId,
      data: {
        roleId,
        memberId,
      },
    };
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["members", workspaceId],
        });
        toast({
          title: "Success",
          description: "Member's role changed successfully",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "You do not have permission to change this member's role.",
          variant: "destructive",
        });
      },
    });
  };
  return (
    <div className="grid gap-6 pt-2">
      {isPending ? (
        <Loader className="w-8 h-8 animate-spin place-self-center flex" />
      ) : null}
      {members.map((member) => {
        const name = member.userId?.name;
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);
        return (
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={member.userId?.profilePicture || ""}
                  alt="Image"
                />
                <AvatarFallback className={avatarColor}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-sm text-muted-foreground">
                  {member.userId.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto min-w-24 capitalize disabled:opacity-95 disabled:pointer-events-none"
                    disabled={isLoading ||
                      !canChangeMemberRole || member.userId._id === user?._id} // Vô hiệu hóa nút nếu là người dùng hiện tại
                  >
                    {member.role.name?.toLowerCase()}{" "}
                    {member.userId._id !== user?._id && ( // Chỉ hiển thị icon chevron khi không phải người dùng hiện tại
                      <ChevronDown className="text-muted-foreground" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Select new role..."

                    />
                    <CommandList>
                      {isLoading ? (
                        <Loader className="w-8 h-8 animate-spin place-self-center flex my-4" />
                      ) : (
                        <>
                          <CommandEmpty>No roles found.</CommandEmpty>
                          <CommandGroup>
                            {roles?.map(
                              (role) =>
                                role.name !== "OWNER" && (
                                  <CommandItem
                                    key={role._id}
                                    disabled={isLoading}
                                    className="disabled:pointer-events-none gap-1 mb-1  flex flex-col items-start px-4 py-2 cursor-pointer"
                                    onSelect={() => {
                                      handleSelect(
                                        role._id,
                                        member.userId._id);
                                    }}
                                  >
                                    <p className="capitalize">
                                      {role.name?.toLowerCase()}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {role.name === "ADMIN" &&
                                        `Can view, create, edit tasks, project and manage settings .`}
                                      {role.name === "MEMBER" &&
                                        `Can view,edit only task created by.`}
                                    </p>
                                  </CommandItem>
                                )
                            )}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllMembers;
