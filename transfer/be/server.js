const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Jun@2024',
  database: 'pm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Existing endpoints for menu
app.get('/api/menu', async (req, res) => {
  try {
    const menuData = await fetchMenuData();
    res.json(menuData);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/menu', async (req, res) => {
  const { label, type, parent_id } = req.body;
  const query = 'INSERT INTO menu_items (label, type, parent_id) VALUES (?, ?, ?)';
  const values = [label, type, parent_id];
  

  try {
    const result = await pool.query(query, values);
    const newMenuId = result.rows[0].id; // Get the insertId from the query result
    console.log('Newly inserted row ID:', newMenuId);
    res.status(201).json({ id: newMenuId }); // Return the new ID in the response
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Server error');
  }
});


app.delete('/api/menu/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM menu_items WHERE id = ?';
  try {
    const [result] = await pool.execute(query, [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Menu item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Menu item not found' });
    }
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ error: 'Error deleting menu item' });
  }
});


app.put('/api/menu/:id', async (req, res) => {
  const id = req.params.id;
  const { label } = req.body;
  const query = 'UPDATE menu_items SET label = ? WHERE id = ?';
  const values = [label, id];

  try {
    // Execute SQL query to update menu item
    const [result] = await pool.execute(query, values);
    if (result.affectedRows > 0) {
      res.json({ message: 'Menu item updated successfully' });
    } else {
      res.status(404).json({ error: 'Menu item not found' });
    }
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ error: 'Error updating menu item' });
  }
});


async function fetchMenuData() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM menu_items');
    const menuData = buildMenuTree(rows);
    return menuData;
  } finally {
    connection.release();
  }
}

async function insertMenuData(data) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO menu_items (label, type, parent_id) VALUES (?, ?, ?)';
    await connection.query(query, [data.label, data.type, data.parent_id]);
  } finally {
    connection.release();
  }
}

function buildMenuTree(items, parentId = null) {
  const result = [];
  for (const item of items) {
    if (item.parent_id === parentId) {
      const children = buildMenuTree(items, item.id);
      if (children.length) {
        item.children = children;
      }
      result.push(item);
    }
  }
  return result;
}

// New endpoints for widgets
app.get('/api/widgets', async (req, res) => {
  try {
    const widgets = await fetchWidgets();
    res.json(widgets);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/widgets', async (req, res) => {
  try {
    const newWidget = req.body;
    const widgetId = await insertWidget(newWidget);
    res.status(200).json({ id: widgetId });
  } catch (error) {
    console.error('Error inserting widget:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/widgets/:id', async (req, res) => {
  try {
    const widgetId = req.params.id;
    const widgetData = req.body;
    await updateWidget(widgetId, widgetData);
    res.status(200).send('Widget updated successfully');
  } catch (error) {
    console.error('Error updating widget:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/widgets/:id', async (req, res) => {
  try {
    const widgetId = req.params.id;
    await deleteWidget(widgetId);
    res.status(200).send('Widget deleted successfully');
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function fetchWidgets() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM widgets');
    return rows;
  } finally {
    connection.release();
  }
}

// async function insertWidget(widget) {
//   const connection = await pool.getConnection();
//   try {
//     const query = 'INSERT INTO widgets (pdt,version_name, upgrade, maintenance) VALUES (?,?, ?, ?)';
//     const [result] = await connection.query(query, [widget.pdt,widget.version_name, widget.upgrade, widget.maintenance]);
//     return result.insertId;
//   } finally {
//     connection.release();
//   }
// }

async function updateWidget(id, widget) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE widgets SET label=?, value=? WHERE id = ?';
    await connection.query(query, [widget.label, widget.value, id]);
  } finally {
    connection.release();
  }
}

async function deleteWidget(id) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM widgets WHERE id = ?';
    await connection.query(query, [id]);
  } finally {
    connection.release();
  }
}

// New endpoints for immediate milestones
app.get('/api/immediate-milestones', async (req, res) => {
  try {
    const milestones = await fetchImmediateMilestones();
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching immediate milestones:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/immediate-milestones', async (req, res) => {
  try {
    const newMilestone = req.body;
    const milestoneId = await insertImmediateMilestone(newMilestone);
    res.status(200).json({ id: milestoneId });
  } catch (error) {
    console.error('Error inserting immediate milestone:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/immediate-milestones/:id', async (req, res) => {
  try {
    const milestoneId = req.params.id;
    const milestoneData = req.body;
    await updateImmediateMilestone(milestoneId, milestoneData);
    // res.status(200).send('Immediate milestone updated successfully');
  } catch (error) {
    console.error('Error updating immediate milestone:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/immediate-milestones/:id', async (req, res) => {
  try {
    const milestoneId = req.params.id;
    await deleteImmediateMilestone(milestoneId);
    // res.status(200).send('Immediate milestone deleted successfully');
  } catch (error) {
    console.error('Error deleting immediate milestone:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function fetchImmediateMilestones() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM immediate_milestones');
    return rows;
  } finally {
    connection.release();
  }
}

async function insertImmediateMilestone(milestone) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO immediate_milestones (project_name, str, deadline) VALUES (?, ?, ?)';
    const [result] = await connection.query(query, [milestone.project_name, milestone.str, milestone.deadline]);
    return result.insertId;
  } finally {
    connection.release();
  }
}

async function updateImmediateMilestone(id, milestone) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE immediate_milestones SET project_name = ?, str = ?, deadline = ? WHERE id = ?';
    await connection.query(query, [milestone.project_name, milestone.str, milestone.deadline, id]);
  } finally {
    connection.release();
  }
}

async function deleteImmediateMilestone(id) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM immediate_milestones WHERE id = ?';
    await connection.query(query, [id]);
  } finally {
    connection.release();
  }
}

// New endpoints for urgent tasks
app.get('/api/urgent-tasks', async (req, res) => {
  try {
    const tasks = await fetchUrgentTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching urgent tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/urgent-tasks', async (req, res) => {
  try {
    const newTask = req.body;
    const taskId = await insertUrgentTask(newTask);
    res.status(200).json({ id: taskId });
  } catch (error) {
    console.error('Error inserting urgent task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/urgent-tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskData = req.body;
    await updateUrgentTask(taskId, taskData);
    // res.status(200).send('Urgent task updated successfully');
  } catch (error) {
    console.error('Error updating urgent task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/urgent-tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await deleteUrgentTask(taskId);
    // res.status(200).send('Urgent task deleted successfully');
  } catch (error) {
    console.error('Error deleting urgent task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function fetchUrgentTasks() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM urgent_tasks');
    return rows;
  } finally {
    connection.release();
  }
}

async function insertUrgentTask(task) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO urgent_tasks (project_name, type, deadline) VALUES (?, ?, ?)';
    const [result] = await connection.query(query, [task.project_name, task.type, task.deadline]);
    return result.insertId;
  } finally {
    connection.release();
  }
}

async function updateUrgentTask(id, task) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE urgent_tasks SET project_name = ?, type = ?, deadline = ? WHERE id = ?';
    await connection.query(query, [task.project_name, task.type, task.deadline, id]);
  } finally {
    connection.release();
  }
}

async function deleteUrgentTask(id) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM urgent_tasks WHERE id = ?';
    await connection.query(query, [id]);
  } finally {
    connection.release();
  }
}





app.get('/api/blocks', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM blocks');
  res.json(rows);
});

// Add a new block
app.post('/api/blocks', async (req, res) => {
  const { title } = req.body;
  const [result] = await pool.query('INSERT INTO blocks (title) VALUES (?)', [title]);
  res.json({ id: result.insertId, title });
});

// Update block title
app.put('/api/blocks/:blockId', async (req, res) => {
  const { blockId } = req.params;
  const { title } = req.body;
  await pool.query('UPDATE blocks SET title = ? WHERE id = ?', [title, blockId]);
  res.json({ id: blockId, title });
});

// Delete block
app.delete('/api/blocks/:blockId', async (req, res) => {
  const { blockId } = req.params;
  await pool.query('DELETE FROM blocks WHERE id = ?', [blockId]);
  res.sendStatus(204);
});

// Get widgets for a block
app.get('/api/blocks/:blockId/widgets', async (req, res) => {
  const { blockId } = req.params;
  const [rows] = await pool.query('SELECT * FROM widgets WHERE block_id = ?', [blockId]);
  res.json(rows);
});

// Add a new widget to a block
app.post('/api/blocks/:blockId/widgets', async (req, res) => {
  const { blockId } = req.params;
  const { label, value } = req.body;
  const [result] = await pool.query('INSERT INTO widgets (block_id, label, value) VALUES (?, ?, ?)', [blockId, label, value]);
  res.json({ id: result.insertId, label, value, editable: false });
});








// fileview component
// app.get('/api/projects', async (req, res) => {
//   try {
//     const connection = await pool.getConnection();
//     try {
//       const [rows] = await connection.query('SELECT * FROM Projects');
//       res.json(rows);
//     } finally {
//       connection.release();
//     }
//   } catch (error) {
//     console.error('Error fetching projects:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.get('/api/projects/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const connection = await pool.getConnection();
//     try {
//       const [rows] = await connection.query('SELECT * FROM Projects WHERE id = ?', [id]);
//       if (rows.length === 0) {
//         res.status(404).json({ error: 'Project not found' });
//       } else {
//         res.json(rows[0]);
//       }
//     } finally {
//       connection.release();
//     }
//   } catch (error) {
//     console.error('Error fetching project:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.post('/api/projects', async (req, res) => {
//   try {
//     const { name, usercount, kernelversion, labels } = req.body;
//     const connection = await pool.getConnection();
//     try {
//       const query = 'INSERT INTO Projects (name, usercount, kernelversion, labels) VALUES (?, ?, ?, ?)';
//       const [result] = await connection.query(query, [name, usercount, kernelversion, JSON.stringify(labels)]);
//       res.status(200).json({ id: result.insertId, name, usercount, kernelversion, labels });
//     } finally {
//       connection.release();
//     }
//   } catch (error) {
//     console.error('Error inserting project:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.put('/api/projects/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, usercount, kernelversion, labels } = req.body;
//     const connection = await pool.getConnection();
//     try {
//       const query = 'UPDATE Projects SET name = ?, usercount = ?, kernelversion = ?, labels = ? WHERE id = ?';
//       await connection.query(query, [name, usercount, kernelversion, JSON.stringify(labels), id]);
//       res.status(200).json({ id, name, usercount, kernelversion, labels });
//     } finally {
//       connection.release();
//     }
//   } catch (error) {
//     console.error('Error updating project:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.delete('/api/projects/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const connection = await pool.getConnection();
//     try {
//       await connection.query('DELETE FROM Projects WHERE id = ?', [id]);
//       res.status(204).send();
//     } finally {
//       connection.release();
//     }
//   } catch (error) {
//     console.error('Error deleting project:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// async function insertMenuData(data) {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();
    
//     let projectId = null;
//     if (data.type === 'file') {
//       const projectQuery = 'INSERT INTO Projects (name, usercount, kernelversion, labels) VALUES (?, ?, ?, ?)';
//       const [projectResult] = await connection.query(projectQuery, [data.label, 0, '', '{}']);
//       projectId = projectResult.insertId;
//     }

//     const menuQuery = 'INSERT INTO menu_items (label, type, parent_id, project_id) VALUES (?, ?, ?, ?)';
//     await connection.query(menuQuery, [data.label, data.type, data.parent_id, projectId]);

//     await connection.commit();
//   } catch (error) {
//     await connection.rollback();
//     throw error;
//   } finally {
//     connection.release();
//   }
// }


// app.get('/api/projects/:id', (req, res) => {
//   const projectId = req.params.id;
//   pool.query('SELECT * FROM projects WHERE p_id = ?', [projectId], (error, results) => {
//     if (error) {
//       console.error('Error fetching project:', error);
//       res.status(500).send('Error fetching project');
//     } else if (results.length === 0) {
//       res.status(404).send('Project not found');
//     } else {
//       res.json(results);
//     }
//   });
// });

// // Update project labels
// app.put('/api/projects/:id', (req, res) => {
//   const projectId = req.params.id;
//   const updatedLabels = JSON.stringify(req.body.labels); // Convert labels to JSON string for storage
//   pool.query('UPDATE projects SET labels = ? WHERE p_id = ?', [updatedLabels, projectId], (error, results) => {
//     if (error) {
//       console.error('Error updating project:', error);
//       res.status(500).send('Error updating project');
//     } else if (results.affectedRows === 0) {
//       res.status(404).send('Project not found');
//     } else {
//       res.json({ message: 'Project labels updated successfully' });
//     }
//   });
// });






//admin validation
app.post('/api/check-admin', async (req, res) => {
  const { empId } = req.body;
  const query = 'SELECT * FROM admin_data WHERE emp_id = ?';

  try {
    const [results] = await pool.query(query, [empId]);
    if (results.length > 0) {
      res.send({ isAdmin: true });
    } else {
      res.send({ isAdmin: false });
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).send('Server error');
  }
});





// New routes for status bars
app.get('/status_bars/:id', async (req, res) => {
  const projectId = req.params.id;
  const sql = `SELECT * FROM status_bars WHERE project_id = ?`;

  try {
    const [results] = await pool.query(sql, [projectId]);
    if (results.length > 0) {
      const stages = results[0]; // Assuming it returns the first row
      res.json(stages);
    } else {
      res.json([]); // or handle accordingly if no data found
    }
  } catch (err) {
    console.error('Error fetching status bars:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/status_bars/:id', async (req, res) => {
  const projectId = req.params.id;
  const initialStatus = JSON.stringify({ state: 'not started', url: '' });

  const sql = `
    INSERT INTO status_bars (project_id, Pre_XTS, Preparation, Selfcheck, Testing, OTA_Released)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    await pool.query(sql, [projectId, initialStatus, initialStatus, initialStatus, initialStatus, initialStatus]);
    res.send('Status bar initialized...');
  } catch (err) {
    console.error('Error initializing status bar:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/status_bars/:id', async (req, res) => {
  const projectId = req.params.id;
  const { stages } = req.body;

  const sql = `
    UPDATE status_bars 
    SET Pre_XTS = ?, Preparation = ?, Selfcheck = ?, Testing = ?, OTA_Released = ?
    WHERE project_id = ?
  `;

  try {
    await pool.query(sql, [
      JSON.stringify(stages.Pre_XTS),
      JSON.stringify(stages.Preparation),
      JSON.stringify(stages.Selfcheck),
      JSON.stringify(stages.Testing),
      JSON.stringify(stages.OTA_Released),
      projectId
    ]);
    res.send('Status bars updated...');
  } catch (err) {
    console.error('Error updating status bars:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







// version block component
app.get('/api/version_block/:projectId', async (req, res) => {
  const projectId = req.params.projectId;
  const sql = 'SELECT * FROM version_block WHERE project_id = ?';
  try {
    const [results] = await pool.query(sql, [projectId]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching versions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new version
app.post('/api/version_block', async (req, res) => {
  const { name, value, url, status, project_id } = req.body;
  const sql = 'INSERT INTO version_block (name, value, url, status, project_id) VALUES (?, ?, ?, ?, ?)';
  try {
    const [result] = await pool.query(sql, [name, value, url, status, project_id]);
    res.json({ id: result.insertId, name, value, url, status, project_id });
  } catch (err) {
    console.error('Error adding version:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a version
app.put('/api/version_block/:id', async (req, res) => {
  const { id } = req.params;
  const { name, value, url, status } = req.body;
  const sql = 'UPDATE version_block SET name = ?, value = ?, url = ?, status = ? WHERE id = ?';
  try {
    await pool.query(sql, [name, value, url, status, id]);
    res.send('Version updated');
  } catch (err) {
    console.error('Error updating version:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a version
app.delete('/api/version_block/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM version_block WHERE id = ?';
  try {
    await pool.query(sql, [id]);
    res.send('Version deleted');
  } catch (err) {
    console.error('Error deleting version:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







// Fetch all labels for a specific project
// app.get('/api/labels/:projectId', async (req, res) => {
//   const projectId = req.params.projectId;
//   const sql = 'SELECT * FROM labels WHERE project_id = ?';
//   try {
//     const [results] = await pool.query(sql, [projectId]);
//     res.json(results);
//   } catch (err) {
//     console.error('Error fetching labels:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Add new labels
// app.post('/api/labels', async (req, res) => {
//   const { labels } = req.body;
//   const sql = 'INSERT INTO labels (label, text, project_id, tab) VALUES ?';
//   const values = labels.map(label => [label.label, label.text, label.project_id, label.tab]);
//   try {
//     const [result] = await pool.query(sql, [values]);
//     res.json({ insertedIds: result.insertId });
//   } catch (err) {
//     console.error('Error adding labels:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update a label
// app.put('/api/labels/:id', async (req, res) => {
//   const { id } = req.params;
//   const { label, text, project_id, tab } = req.body;
//   const sql = 'UPDATE labels SET label = ?, text = ?, project_id = ?, tab = ? WHERE id = ?';
//   try {
//     await pool.query(sql, [label, text, project_id, tab, id]);
//     res.send('Label updated');
//   } catch (err) {
//     console.error('Error updating label:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a label
// app.delete('/api/labels/:id', async (req, res) => {
//   const { id } = req.params;
//   const sql = 'DELETE FROM labels WHERE id = ?';
//   try {
//     await pool.query(sql, [id]);
//     res.send('Label deleted');
//   } catch (err) {
//     console.error('Error deleting label:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Fetch a project by ID
// app.get('/api/menu/:id', async (req, res) => {
//   const { id } = req.params;
//   const sql = 'SELECT * FROM menu_items WHERE id = ?';
//   try {
//     const [results] = await pool.query(sql, [id]);
//     res.json(results);
//   } catch (err) {
//     console.error('Error fetching project:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update a project
// app.put('/api/menu/:id', async (req, res) => {
//   const { id } = req.params;
//   const { labels } = req.body;
//   const sql = 'UPDATE menu_items SET labels = ? WHERE id = ?';
//   try {
//     await pool.query(sql, [JSON.stringify(labels), id]);
//     res.send('Project updated');
//   } catch (err) {
//     console.error('Error updating project:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.get('/api/projects', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM projects');
    res.send(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// app.post('/api/projects', async (req, res) => {
//   try {
//     const newProject = req.body;
//     const sql = 'INSERT INTO projects (id,name, usercount, kernelversion, labels) VALUES (?,?, ?, ?, ?)';
//     const [result] = await pool.query(sql, [newProject.id,newProject.name, newProject.usercount, newProject.kernelversion, JSON.stringify(newProject.labels)]);
//     res.send('Project added...');
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });
app.post('/api/projects', async (req, res) => {
  const { id, name, usercount, kernelversion, labels } = req.body;

  try {
    // Example SQL query to insert into projects table
    const query = 'INSERT INTO projects (id, name, usercount, kernelversion, labels) VALUES (?, ?, ?, ?, ?)';
    const values = [id, name, usercount, kernelversion, JSON.stringify(labels)];

    await pool.query(query, values);

    // Respond with success message or inserted ID
    res.status(201).json({ message: 'Project created successfully', projectId: id });
  } catch (error) {
    console.error('Error creating new project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = req.body;
    const sql = 'UPDATE projects SET labels = ? WHERE id = ?';
    const [result] = await pool.query(sql, [JSON.stringify(updatedProject.labels), req.params.id]);
    res.send('Project updated...');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const sql = 'DELETE FROM projects WHERE id = ?';
    const [result] = await pool.query(sql, [req.params.id]);
    res.send('Project deleted...');
  } catch (err) {
    res.status(500).send(err.message);
  }
});







app.post('/api/input_fields', async (req, res) => {
  const inputFields = req.body;
  try {
    const results = [];
    for (const field of inputFields) {
      if (field.id) {
        await pool.query(
          'UPDATE input_fields SET name = ?, value = ? WHERE id = ?',
          [field.name, field.value, field.id]
        );
      } else {
        const [result] = await pool.query(
          'INSERT INTO input_fields (version_block_id, name, value) VALUES (?, ?, ?)',
          [field.version_block_id, field.name, field.value]
        );
        field.id = result.insertId;
      }
      results.push(field);
    }
    res.status(201).json(results);
  } catch (error) {
    console.error('Error saving input fields:', error);
    res.status(500).json({ error: 'Error saving input fields' });
  }
});

app.get('/api/input_fields/:version_block_id', async (req, res) => {
  const { version_block_id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM input_fields WHERE version_block_id = ?',
      [version_block_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching input fields:', error);
    res.status(500).json({ error: 'Error fetching input fields' });
  }
});

app.put('/api/input_fields/:id', async (req, res) => {
  const { id } = req.params;
  const { name, value } = req.body;
  try {
    await pool.query(
      'UPDATE input_fields SET name = ?, value = ? WHERE id = ?',
      [name, value, id]
    );
    res.json({ id, name, value });
  } catch (error) {
    console.error('Error updating input field:', error);
    res.status(500).json({ error: 'Error updating input field' });
  }
});

app.delete('/api/input_fields/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM input_fields WHERE id = ?', [id]);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting input field:', error);
    res.status(500).json({ error: 'Error deleting input field' });
  }
});











app.get('/api/version_scope/:version_block_id', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM version_scope WHERE version_block_id = ?', [req.params.version_block_id]);
    res.send(results);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a new version scope item
app.post('/api/version_scope', async (req, res) => {
  const { version_block_id, label, link, completed } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO version_scope (version_block_id, label, link, completed) VALUES (?, ?, ?, ?)', [version_block_id, label, link, completed]);
    res.send({ id: result.insertId, version_block_id, label, link, completed });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a version scope item
app.put('/api/version_scope/:id', async (req, res) => {
  const { label, link, completed } = req.body;
  try {
    await pool.query('UPDATE version_scope SET label = ?, link = ?, completed = ? WHERE id = ?', [label, link, completed, req.params.id]);
    res.send('Version scope item updated...');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a version scope item
app.delete('/api/version_scope/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM version_scope WHERE id = ?', [req.params.id]);
    res.send('Version scope item deleted...');
  } catch (error) {
    res.status(500).send(error.message);
  }
});






// project configuration component

app.get('/api/ConfigProject/:parentId', async (req, res) => {
  const { parentId } = req.params;
  const query = 'SELECT * FROM menu_items WHERE parent_id = ?';

  try {
    const [results] = await pool.query(query, [parentId]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Endpoint to fetch menu items with parent_id null
app.get('/api/ConfigProject', async (req, res) => {
  const query = 'SELECT * FROM menu_items WHERE parent_id IS NULL';

  try {
    const [results] = await pool.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



const query = async (sql, params) => {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

app.get('/api/dropdown1', async (req, res) => {
  try {
    const results = await query('SELECT * FROM menu_items WHERE parent_id IS NULL');
    res.json(results);
  } catch (error) {
    console.error('Error fetching Dropdown 1 options:', error);
    res.status(500).json({ error: 'Failed to fetch Dropdown 1 options' });
  }
});

// Route to fetch options for Dropdown 2 (based on parent_id)
app.get('/api/dropdown2/:parentId', async (req, res) => {
  const { parentId } = req.params;
  try {
    const results = await query('SELECT * FROM menu_items WHERE parent_id = ?', [parentId]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching Dropdown 2 options:', error);
    res.status(500).json({ error: 'Failed to fetch Dropdown 2 options' });
  }
});

// Route to fetch options for Dropdown 3 (based on parent_id)
app.get('/api/dropdown3/:parentId', async (req, res) => {
  const { parentId } = req.params;
  try {
    const results = await query('SELECT * FROM menu_items WHERE parent_id = ?', [parentId]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching Dropdown 3 options:', error);
    res.status(500).json({ error: 'Failed to fetch Dropdown 3 options' });
  }
});

// Route to fetch options for Dropdown 4 (based on parent_id)
app.get('/api/dropdown4/:parentId', async (req, res) => {
  const { parentId } = req.params;
  try {
    const results = await query('SELECT * FROM menu_items WHERE parent_id = ?', [parentId]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching Dropdown 4 options:', error);
    res.status(500).json({ error: 'Failed to fetch Dropdown 4 options' });
  }
});

















app.get('/api/titles', async (req, res) => {
  const { startDate, endDate } = req.query;

  const query = `
    SELECT 
      id, 
      title, 
      DATE_FORMAT(date, '%M') AS month, 
      DATE_FORMAT(date, '%Y') AS year,
      SUM(pdt) AS pdt, 
      SUM(upgrade) AS upgrade, 
      SUM(maintenance) AS maintenance
    FROM titles
    WHERE date BETWEEN ? AND ?
    GROUP BY id, title, month, year
    ORDER BY date
  `;

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(query, [startDate, endDate]);
    connection.release();
    res.json(results);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).send(error.message);
  }
});


// Fetch child folders and files
app.get('/api/menu_items/:category', async (req, res) => {
  const { category } = req.params;
  const { titleId } = req.query;

  const query = `
    SELECT * FROM menu_items
    WHERE parent_id IS NULL
  `;

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(query);

    const fetchChildren = async (parentId) => {
      const [children] = await connection.query('SELECT * FROM menu_items WHERE parent_id = ?', [parentId]);
      for (const child of children) {
        child.children = await fetchChildren(child.id);
      }
      return children;
    };

    for (const result of results) {
      result.children = await fetchChildren(result.id);
    }

    connection.release();
    res.json(results);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).send(error.message);
  }
});




// Example endpoint to fetch version block details
// app.get('/api/versions_block', async (req, res) => {
//   const { month, year } = req.query;
//   const query = `
//   WITH RECURSIVE MenuHierarchy AS (
//     SELECT 
//         id,
//         label,
//         parent_id,
//         label AS path
//     FROM 
//         pm.menu_items
//     WHERE 
//         parent_id IS NULL
    
//     UNION ALL
    
//     SELECT 
//         mi.id,
//         mi.label,
//         mi.parent_id,
//         CONCAT(mh.path, ' - ', mi.label) AS path
//     FROM 
//         pm.menu_items mi
//     JOIN 
//         MenuHierarchy mh ON mi.parent_id = mh.id
// ),
// JulyVersions AS (
//     SELECT 
//         *
//     FROM 
//         pm.version_block
//     WHERE 
//         MONTH(deadline) = 7 AND YEAR(deadline) = 2024
// )
// SELECT 
//     mh.id,
//     mh.label,
//     mh.path,
//     jv.name
// FROM 
//     MenuHierarchy mh
// JOIN 
//     pm.menu_items mi ON mh.id = mi.id
// JOIN 
//     JulyVersions jv ON mi.id = jv.project_id
// WHERE 
//     mi.type = 'file';

//   `;
  
//   try {
//     console.log('Executing query:', query);
//     const [results] = await pool.query(query, [month, year]);
//     console.log('Results:', results);
//     res.json(results);
//   } catch (err) {
//     console.error('Error fetching versions:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.get('/api/menuHierarchy', async (req, res) => {
  try {
      // SQL query to retrieve menu hierarchy with version block data
      const sqlQuery = `
          WITH RECURSIVE MenuHierarchy AS (
              SELECT 
                  id,
                  label,
                  parent_id,
                  label AS path,
                  label AS root_parent
              FROM 
                  pm.menu_items
              WHERE 
                  parent_id IS NULL
              
              UNION ALL
              
              SELECT 
                  mi.id,
                  mi.label,
                  mi.parent_id,
                  CONCAT(mh.path, ' - ', mi.label) AS path,
                  mh.root_parent
              FROM 
                  pm.menu_items mi
              JOIN 
                  MenuHierarchy mh ON mi.parent_id = mh.id
          )
          SELECT 
              mh.id,
              mh.label,
              mh.path,
              mh.root_parent,
              vb.deadline
          FROM 
              MenuHierarchy mh
          JOIN 
              pm.menu_items mi ON mh.id = mi.id
          JOIN 
              pm.version_block vb ON mi.id = vb.project_id
          WHERE 
              mi.type = 'file';
      `;

      // Execute the query using mysql2/promise
      const [results, fields] = await pool.query(sqlQuery);

      // Send the results as JSON
      res.json(results);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});







// Fetch subfolders (projects) and their versions under PDT
app.get('/api/pdt/:id', async (req, res) => {
  const parentId = req.params.id;
  
  try {
    // Fetch subfolders (projects) under PDT
    const projectsQuery = `
      SELECT id, label, value, url, status, deadline
      FROM menu_items
      WHERE parent_id = ? AND type = 'folder'
    `;
    const [projectsResults] = await pool.query(projectsQuery, [parentId]);
    
    // Fetch versions for each project
    const projects = await Promise.all(projectsResults.map(async (project) => {
      const projectId = project.id;
      const versionsQuery = `
        SELECT *
        FROM version_block
        WHERE project_id = ?
      `;
      const [versionsResults] = await pool.query(versionsQuery, [projectId]);
      return {
        ...project,
        versions: versionsResults
      };
    }));
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching PDT projects:', error);
    res.status(500).json({ error: 'Failed to fetch PDT projects' });
  }
});










app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
