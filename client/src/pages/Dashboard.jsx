import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, Calendar, Users, AlertCircle, X, 
  CheckCircle2, Clock, LayoutDashboard, Trash2 
} from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]); // NEW: State to store members
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const { user } = useContext(AuthContext);

  const today = new Date().toISOString().split('T')[0];

  const fetchTasks = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) return;
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('https://tasktracker-production-9ded.up.railway.app/api/tasks', config);
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // NEW: Fetch member list for the dropdown
  const fetchMembers = async () => {
    try {
      const { data } = await axios.get('https://tasktracker-production-9ded.up.railway.app/api/auth/members');
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') {
      fetchMembers(); // Only fetch members if user is an Admin
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await axios.post('https://tasktracker-production-9ded.up.railway.app/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setShowModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchTasks();
    } catch (err) {
      alert("Error: Assignment failed. Please select a valid member.");
    }
  };

  const updateStatus = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await axios.patch(`https://tasktracker-production-9ded.up.railway.app/api/tasks/${id}`, { status: 'Completed' }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error("Update failed", err);
    }
  };
  const deleteTask = async (id) => {
  if (window.confirm("Are you sure you want to delete this task?")) {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.delete(`https://tasktracker-production-9ded.up.railway.app/api/tasks/${id}`, config);
      
      fetchTasks(); // Refresh list after deletion
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete task.");
    }
  }
};

  // Calculations
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const overdueCount = tasks.filter(t => t.status !== 'Completed' && t.dueDate?.split('T')[0] < today).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div style={styles.wrapper}>
      <div style={styles.mainContent}>
        
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>
              {user?.role === 'Admin' ? 'Team Management' : 'My Personal Board'}
            </h1>
            <p style={styles.welcome}>Active User: **{user?.name}** ({user?.role})</p>
          </div>
          {user?.role === 'Admin' && (
            <button onClick={() => setShowModal(true)} style={styles.addBtn}>
              <Plus size={18}/> New Assignment
            </button>
          )}
        </div>

        {/* STATS ROW */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={{...styles.iconBox, background: '#e0e7ff'}}><Users color="#4338ca" size={20}/></div>
            <div style={{flex: 1}}>
              <p style={styles.statLabel}>Team Completion</p>
              <h3 style={styles.statVal}>{completedCount} / {totalTasks} Done</h3>
              <div style={styles.progressBg}>
                <div style={styles.progressFill(progressPercent)}></div>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.iconBox, background: overdueCount > 0 ? '#fee2e2' : '#f1f5f9'}}>
              <AlertCircle color={overdueCount > 0 ? '#b91c1c' : '#64748b'} size={20}/>
            </div>
            <div>
              <p style={styles.statLabel}>Overdue Alerts</p>
              <h3 style={{...styles.statVal, color: overdueCount > 0 ? '#dc2626' : '#1e293b'}}>
                {overdueCount} {overdueCount === 1 ? 'Task' : 'Tasks'}
              </h3>
            </div>
          </div>
        </div>

        {/* TASK GRID */}
        <div style={styles.grid}>
          {tasks.length === 0 ? (
            <div style={styles.emptyState}>
              <LayoutDashboard size={48} color="#cbd5e1" />
              <p>No tasks found. Assignments will appear here.</p>
            </div>
          ) : tasks.map(task => {
            const isOverdue = task.status !== 'Completed' && task.dueDate?.split('T')[0] < today;
            
            return (
              <div key={task._id} style={{
                ...styles.taskCard,
                borderTop: isOverdue ? '5px solid #dc2626' : (task.status === 'Completed' ? '5px solid #10b981' : '5px solid #e2e8f0')
              }}>
                <div style={styles.cardHeader}>
                  <div style={styles.statusContainer}>
                    <span style={styles.statusBadge(task.status)}>
                      {task.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {task.status}
                    </span>
                    {user?.role === 'Admin' && (
      <Trash2 
        size={16} 
        color="#dc2626" 
        style={{ cursor: 'pointer', marginLeft: '10px' }} 
        onClick={() => deleteTask(task._id)} 
      />
    )}
                    {isOverdue && (
                      <span style={styles.urgentBadge}>
                        <AlertCircle size={10} /> OVERDUE
                      </span>
                    )}
                  </div>
                  <span style={styles.dateText}>
                    <Calendar size={12}/> {task.dueDate?.split('T')[0] || 'No Date'}
                  </span>
                </div>

                <h3 style={styles.taskTitle}>{task.title}</h3>
                <p style={styles.taskDesc}>{task.description}</p>

                <div style={styles.cardFooter}>
                  <div style={styles.assigneeBox}>
                    <div style={styles.miniAvatar}>{task.assignedTo?.name?.charAt(0) || 'U'}</div>
                    <span>{task.assignedTo?.name || 'Member'}</span>
                  </div>
                  {task.status !== 'Completed' && (
                    <button onClick={() => updateStatus(task._id)} style={styles.doneBtn}>
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADMIN ASSIGNMENT MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <form style={styles.modal} onSubmit={handleCreate}>
            <div style={styles.modalHeader}>
              <h3>Assign New Task</h3>
              <X style={{cursor:'pointer'}} onClick={() => setShowModal(false)} />
            </div>

            <label style={styles.label}>Project Title</label>
            <input required style={styles.input} placeholder="e.g., API Integration" 
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})} />

            {/* UPDATED: Dropdown instead of Text Input */}
            <label style={styles.label}>Assign To Member</label>
            <select 
              required 
              style={styles.select} 
              value={newTask.assignedTo}
              onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
            >
              <option value="">-- Select Member --</option>
              {members.map(m => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>

            <label style={styles.label}>Deadline Date</label>
            <input type="date" min={today} required style={styles.input} 
              value={newTask.dueDate}
              onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />

            <label style={styles.label}>Task Description</label>
            <textarea style={{...styles.input, height: '80px'}} placeholder="What needs to be done?" 
              value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})} />

            <button type="submit" style={styles.submitBtn}>Confirm Assignment</button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  // ... Keep all your existing styles exactly the same ...
  // ADD THIS NEW STYLE FOR THE SELECT DROPDOWN:
  select: {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px',
    fontSize: '14px',
    background: 'white',
    outlineColor: '#2563eb',
    cursor: 'pointer'
  },
  // Ensure the rest of the styles (wrapper, mainContent, etc.) are below
  wrapper: { background: '#f1f5f9', minHeight: '100vh', width: '100vw', overflowX: 'hidden' },
  mainContent: { width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '40px 5%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  pageTitle: { fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: '800' },
  welcome: { color: '#64748b', fontSize: '14px', marginTop: '5px' },
  addBtn: { background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' },
  statCard: { flex: '1 1 300px', background: 'white', padding: '25px', borderRadius: '16px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #e2e8f0' },
  iconBox: { padding: '12px', borderRadius: '12px' },
  statLabel: { fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', margin: 0 },
  statVal: { fontSize: '20px', margin: '5px 0', fontWeight: '700' },
  progressBg: { width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', marginTop: '10px' },
  progressFill: (w) => ({ width: `${w}%`, height: '100%', background: '#2563eb', borderRadius: '10px', transition: 'width 0.5s ease-in-out' }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
  taskCard: { background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  statusContainer: { display: 'flex', gap: '8px', alignItems: 'center' },
  statusBadge: (s) => ({ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '8px', background: s === 'Completed' ? '#dcfce7' : '#fef9c3', color: s === 'Completed' ? '#166534' : '#854d0e' }),
  urgentBadge: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '900', padding: '4px 8px', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' },
  dateText: { fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' },
  taskTitle: { fontSize: '19px', color: '#1e293b', margin: '0 0 10px 0', fontWeight: '700' },
  taskDesc: { fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '25px', flex: 1 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' },
  assigneeBox: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#475569' },
  miniAvatar: { width: '28px', height: '28px', background: '#6366f1', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' },
  doneBtn: { background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: 'white', padding: '35px', borderRadius: '24px', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '14px', outlineColor: '#2563eb' },
  submitBtn: { background: '#2563eb', color: 'white', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  emptyState: { gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', background: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0', color: '#94a3b8', gap: '15px' }
};

export default Dashboard;