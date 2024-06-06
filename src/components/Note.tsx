import React from "react";
import { Card, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

interface NoteProps {
  note: {
    id: string;
    content: string;
  };
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

const Note: React.FC<NoteProps> = ({ note, onDelete, onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    content: string;
  }>();

  const onSubmit = (data: { content: string }) => {
    onUpdate(note.id, data.content);
  };

  return (
    <Card>
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <textarea
              className={`form-control ${errors.content ? "is-invalid" : ""}`}
              {...register("content", { required: "Content is required" })}
              defaultValue={note.content}
            ></textarea>
            {errors.content && (
              <div className="invalid-feedback">{errors.content.message}</div>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Update
            </Button>
            <Button variant="danger" onClick={() => onDelete(note.id)}>
              Delete
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default Note;
