"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";

import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types/project";
import { ProjectDialog } from "./components/project-dialog";
import { ServerDataTable } from "@/components/ui/server-data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { getColumns } from "./columns";

import { useProjects, useDeleteProject } from "@/lib/hooks/use-projects";

export function ProjectsClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [questionType, setQuestionTypeState] = useState("all");

  useEffect(() => {
    const saved = sessionStorage.getItem("projects_filter");
    if (saved) setQuestionTypeState(saved);
  }, []);

  const setQuestionType = (val: string) => {
    setQuestionTypeState(val);
    sessionStorage.setItem("projects_filter", val);
  };

  const {
    currentPage,
    limit,
    search,
    sorting,
    columnVisibility,
    handleSearch,
    handleNextPage,
    handlePrevPage,
    handlePageChange,
    setLimit,
    setSorting,
    setColumnVisibility,
  } = useTablePagination();

  const sortBy = sorting[0]?.id || "createdAt";
  const sortDir = sorting[0]?.desc ? "desc" : "asc";

  const { data, isFetching, refetch } = useProjects(currentPage, limit, search, sortBy, sortDir, questionType === "all" ? "" : questionType);

  const deleteMutation = useDeleteProject();
  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success("Project deleted successfully.");
          setDeleteId(null);
        },
        onError: (error) => {
          toast.error("Failed to delete project.", {
            description: getErrorMessage(error),
          });
          setDeleteId(null);
        },
      });
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProject(null);
    setIsDialogOpen(true);
  };

  const columns = getColumns(handleEdit, setDeleteId);

  
  const CustomActions = (
    <div className="w-[250px]">
      <Select value={questionType} onValueChange={setQuestionType}>
        <SelectTrigger>
          <div className="flex flex-1 text-left line-clamp-1">
              {questionType === "upload" ? "Upload Question Projects" : questionType === "no-question" ? "No-Question Projects" : "All Projects"}
            </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectItem value="upload">Upload Question Projects</SelectItem>
          <SelectItem value="no-question">No-Question Projects</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const projects = data?.items || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your game projects and their settings.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <ServerDataTable
        columns={columns}
        data={projects}
        searchPlaceholder="Search projects..."
        onSearch={handleSearch}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onPageChange={handlePageChange}
        hasNextPage={!data?.last}
        hasPrevPage={currentPage > 0}
        isLoading={isFetching}
        currentPage={currentPage}
        totalPages={data?.totalPages}
        totalElements={data?.totalElements}
        limit={limit}
        onLimitChange={setLimit}
        sorting={sorting}
        onSortingChange={setSorting}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        onRefresh={refetch}
        CustomActions={CustomActions}
      />

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={selectedProject}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        description="This will permanently delete the project and all associated folders and questions."
      />
    </div>
  );
}
