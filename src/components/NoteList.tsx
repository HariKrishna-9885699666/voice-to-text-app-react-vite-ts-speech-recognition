import React from "react";
import { Row, Col } from "react-bootstrap";
import Note from "./Note";

interface Note {
  id: string;
  content: string;
}

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onDelete, onUpdate }) => {
  return (
    <Row>
      {notes
        .slice()
        .sort((a, b) => parseInt(b.id) - parseInt(a.id))
        .map((note) => (
          <Col key={note.id} sm={4} className="mb-4">
            <Note note={note} onDelete={onDelete} onUpdate={onUpdate} />
          </Col>
        ))}
    </Row>
  );
};

export default NoteList;
