import axios from "axios";
import { useForm } from "react-hook-form";
import { useUserStore } from "../stores/user-store";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function CommentForm({
  setAddComment,
  author,
  relatedShow,
  parentComment = null,
  setRecentComments,
  type,
  setEdit,
  commentId,
  currentContent,
  setEditedComment,
  index,
  replies,
}) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { content: currentContent ?? " " },
  });
  const content = watch("content");

  async function addNew(data) {
    const body = {
      comment: {
        ...data,
        author,
        relatedShow,
      },
    };

    try {
      const request = api.post("/comments/add", body);
      toast.promise(request, {
        loading: "Posting",
        success: "Comment added",
        error: (error) => error.response.data.message || error.message,
      });
      const response = await request;
      setRecentComments((prev) => [response.data, ...prev]);
      setAddComment(false);
    } catch (error) {
      setError("content", { message: error.message });
    }
  }

  async function addReply(data) {
    const body = {
      comment: {
        ...data,
        author,
        relatedShow,
        parentComment,
      },
    };

    try {
      const request = api.post("/comments/add", body);

      toast.promise(request, {
        loading: "Posting",
        success: "Reply added",
        error: (error) => error.response.data.message || error.message,
      });
      const response = await request;
      const updated = [...replies];
      updated.splice(index + 1, 0, response.data);
      setRecentComments(updated);
      setAddComment(false);
    } catch (error) {
      setError("content", { message: error.message });
    }
  }

  async function editComment(data) {
    const body = {
      ...data,
      commentId,
    };

    try {
      const request = api.patch("/comments/edit", body);
      toast.promise(request, {
        loading: "Posting",
        success: "Comment edited",
        error: (error) => error.response.data.message || error.message,
      });
      const response = await request;
      setEditedComment(response.data.commentsData);
      setEdit(false);
    } catch (error) {
      setError("content", { message: error.message });
    }
  }

  return (
    <form
      className="w-full border relative z-10"
      onSubmit={handleSubmit(
        type === "edit" ? editComment : type === "reply" ? addReply : addNew
      )}
    >
      <div className="p-4 bg-primary">
        <div>
          <textarea
            className="bg-white w-full text-black"
            autoFocus
            rows={4}
            {...register("content")}
          ></textarea>
        </div>
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={() => {
              if (type === "edit") {
                setEdit(false);
              } else setAddComment(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={content.trim().length === 0 || isSubmitting}
            className="disabled:text-gray-400 disabled:cursor-default!"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default CommentForm;
