const SERVER_URL = 'http://localhost:4000';

test('1+2=3, empty array is empty', () => {
  expect(1 + 2).toBe(3);
  expect([].length).toBe(0);
});

const postNote = async (title, content) => {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  expect(postNoteRes.status).toBe(200);
  const postNoteBody = await postNoteRes.json();
  return postNoteBody.insertedId;
};

const clearNotes = async () => {
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  expect(deleteAllNotesRes.status).toBe(200);

  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(0);
};

beforeEach(clearNotes);
afterEach(clearNotes);

test('/postNote - Post a note', async () => {
  const title = 'NoteTitleTest';
  const content = 'NoteTitleContent';

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();
  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe('Note added succesfully.');
});

test('/getAllNotes - Return list of zero notes for getAllNotes', async () => {
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(0);
});

test('/getAllNotes - Return list of two notes for getAllNotes', async () => {
  await postNote('New note', 'Note content');
  await postNote('Another note', 'More content');

  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(2);
});

test('/deleteNote - Delete a note', async () => {
  const noteId = await postNote('New note', 'Note content');

  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const deleteNoteBody = await deleteNoteRes.json();
  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${noteId} deleted.`);
});

test('/patchNote - Patch with content and title', async () => {
  const noteId = await postNote('A note', 'Some content');

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'New title',
      content: 'New content',
    }),
  });

  const patchNoteBody = await patchNoteRes.json();
  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${noteId} patched.`);
});

test('/patchNote - Patch with just title', async () => {
  const noteId = await postNote('A note', 'Some content');

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'New title',
    }),
  });

  const patchNoteBody = await patchNoteRes.json();
  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${noteId} patched.`);
});

test('/patchNote - Patch with just content', async () => {
  const noteId = await postNote('A note', 'Some content');

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: 'New content',
    }),
  });

  const patchNoteBody = await patchNoteRes.json();
  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${noteId} patched.`);
});

test('/deleteAllNotes - Delete one note', async () => {
  await postNote('A note', 'Some content');

  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const deleteAllNotesBody = await deleteAllNotesRes.json();
  expect(deleteAllNotesRes.status).toBe(200);
  expect(deleteAllNotesBody.response).toBe('1 note(s) deleted.');

  // Verify that no notes remain
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(0);
});

test('/deleteAllNotes - Delete three notes', async () => {
  await postNote('A note', 'Some content');
  await postNote('Another note', 'More content');
  await postNote('A third note', 'Some more content');

  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const deleteAllNotesBody = await deleteAllNotesRes.json();
  expect(deleteAllNotesRes.status).toBe(200);
  expect(deleteAllNotesBody.response).toBe('3 note(s) deleted.');

  // Verify that no notes remain
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(0);
});

test('/updateNoteColor - Update color of a note to red (#FF0000)', async () => {
  const noteId = await postNote('A note', 'Some content');

  const updateNoteColorRes = await fetch(
    `${SERVER_URL}/updateNoteColor/${noteId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        color: '#FF0000',
      }),
    }
  );

  const updateNoteColorBody = await updateNoteColorRes.json();
  expect(updateNoteColorRes.status).toBe(200);
  expect(updateNoteColorBody.message).toBe('Note color updated successfully.');
});
