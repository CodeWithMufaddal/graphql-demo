import { useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { ServerDataTable } from "@/components/data-table/server-data-table";
import {
  TableToolbar,
  type TableToolbarField,
} from "@/components/data-table/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { showDialog } from "@/components/ui/global-confirmation-dialog";
import { useDataTable } from "@/hooks/use-data-table";
import {
  deleteUserById,
  fetchFilterOptions,
  fetchUsersTable,
  type FilterOptionsRequest,
  type UsersServerFilters,
  type UsersTableRow,
} from "@/modules/users/endpoints";
import { statusVariant } from "@/features/dashboard/ui-utils";

const defaultFilters: UsersServerFilters = {
  roles: [],
  statuses: [],
  companies: [],
  createdFrom: "",
  createdTo: "",
};

export function UsersPage() {
  const navigate = useNavigate();

  const loadRoles = useCallback((request: FilterOptionsRequest) => {
    return fetchFilterOptions("roles", request);
  }, []);

  const loadStatuses = useCallback((request: FilterOptionsRequest) => {
    return fetchFilterOptions("statuses", request);
  }, []);

  const loadCompanies = useCallback((request: FilterOptionsRequest) => {
    return fetchFilterOptions("companies", request);
  }, []);

  const {
    afterDelete,
    serverDataTableProps,
    globalSearchInput,
    setGlobalSearchInput,
    filters,
    setFilters,
    resetFilters,
  } = useDataTable<UsersTableRow, UsersServerFilters>({
    fetchData: fetchUsersTable,
    defaultFilters,
    loadingErrorMessage: "Unable to load users table data.",
  });

  const handleDeleteUser = useCallback(
    async (target: UsersTableRow) => {
      const confirmed = await showDialog({
        title: "Delete user",
        description: `Are you sure you want to delete ${target.name}? This action cannot be undone.`,
        confirmLabel: "Delete",
        confirmingLabel: "Deleting...",
        confirmVariant: "destructive",
      });

      if (!confirmed) return false;

      try {
        await deleteUserById(target.id);
        toast.success(`Deleted ${target.name}.`);
        afterDelete(target.id);
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to delete user.";
        toast.error(message);
        return false;
      }
    },
    [afterDelete],
  );

  const fields = useMemo<TableToolbarField<UsersServerFilters>[]>(
    () => [
      {
        type: "asyncSelect",
        name: "roles",
        label: "Roles",
        loadOptions: loadRoles,
      },
      {
        type: "asyncSelect",
        name: "statuses",
        label: "Statuses",
        loadOptions: loadStatuses,
      },
      {
        type: "asyncSelect",
        name: "companies",
        label: "Companies",
        loadOptions: loadCompanies,
      },
      {
        type: "dateRange",
        name: "createdAt",
        label: "Created date",
        fromKey: "createdFrom",
        toKey: "createdTo",
      },
    ],
    [loadCompanies, loadRoles, loadStatuses],
  );

  const columns = useMemo<ColumnDef<UsersTableRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{row.original.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              @{row.original.username}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "company",
        header: "Company",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableResizing: false,
        size: 96,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(`/users/${row.original.id}/edit`)}
            >
              <PencilIcon />
              <span className="sr-only">Edit row {row.original.id}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => void handleDeleteUser(row.original)}
            >
              <Trash2Icon />
              <span className="sr-only">Delete row {row.original.id}</span>
            </Button>
          </div>
        ),
      },
    ],
    [handleDeleteUser, navigate],
  );

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link to="/users/new">
            <PlusIcon data-icon="inline-start" />
            Create User
          </Link>
        </Button>
      </div>

      <TableToolbar
        globalSearchInput={globalSearchInput}
        onGlobalSearchChange={setGlobalSearchInput}
        searchPlaceholder="Search name, username, email, company..."
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        fields={fields}
      />

      <ServerDataTable
        columns={columns}
        {...serverDataTableProps}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
