import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import NoteList from "./components/NoteList";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import FloatingIcon from "./FloatingIcon";

interface Note {
  id: string;
  content: string;
}

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{
    content: string;
  }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes);
      if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
        setNotes(parsedNotes);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (isRecording) {
      setValue("content", transcript);
    }
  }, [transcript, isRecording, setValue]);

  const onSubmit = (data: { content: string }) => {
    const newNote: Note = { id: Date.now().toString(), ...data };
    setNotes([...notes, newNote]);
    reset({ content: "" });
    resetTranscript();
    setShowNotification(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleUpdateNote = (id: string, content: string) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, content } : note))
    );
  };

  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
    setIsRecording(true);
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
    setShowNotification(true);
  };

  useEffect(() => {
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  }, [showNotification]);

  const content = watch("content") || "";

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <header
            className="d-flex justify-content-center align-items-center mb-5"
            style={{ backgroundColor: "#f0f0f0", padding: "2rem" }}
          >
            <h3 className="text-center text-dark">
              Voice to text using react, vite, ts, react speech recognition,
              bootstrap
            </h3>
          </header>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 mt-2 position-relative">
                  <textarea
                    className={`form-control ${
                      errors.content ? "is-invalid" : ""
                    }`}
                    {...register("content", {
                      required: "Content is required",
                      maxLength: {
                        value: 3000,
                        message: "Content cannot exceed 3000 characters",
                      },
                    })}
                    placeholder="Content"
                    rows={10}
                    maxLength={3000}
                  ></textarea>
                  <div
                    className="text-muted position-absolute"
                    style={{ bottom: "10px", right: "10px" }}
                  >
                    {content.length}/3000
                  </div>
                  {errors.content && (
                    <div className="invalid-feedback">
                      {errors.content.message}
                    </div>
                  )}
                </div>
                <Button variant="primary" type="submit" className="me-2">
                  Add Note
                </Button>
                <Button
                  variant={isRecording ? "danger" : "success"}
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording
                    ? "Stop Voice Recording"
                    : "Start Voice Recording"}
                </Button>
              </form>
              {showNotification && (
                <div
                  className="notification"
                >
                  You have stopped recording. Don't forget to save your note!
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} className="mt-3">
          <NoteList
            notes={notes}
            onDelete={handleDeleteNote}
            onUpdate={handleUpdateNote}
          />
        </Col>
      </Row>
      <FloatingIcon />
    </Container>
  );
};

export default App;
