import { useState, useEffect } from "react"
import Note from './components/Note'
import axios from 'axios'
import noteService from './services/notes'



const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNote => {
        setNotes(initialNote)
    })
  }, [])


  const notesToShow = showAll ? 
    notes : notes.filter(note => note.important)

  const addNote = (event) => {
    console.log(event)
    event.preventDefault()
    const noteObj = {
      content: newNote, 
      date: new Date(),
      important: Math.random() < .5,
      //id: notes.length + 1
      }

    noteService
      .create(noteObj)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important:!note.important}

    noteService.update(id, changedNote).then(updatedNote => {
      setNotes(notes.map(note => (note.id !== id) ? note : updatedNote))
    })
    .catch(err => {
      alert(
          `the note ${note.content} was already deleted from server` 
      )
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
    </div>
  );
}

export default App;
