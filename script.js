    // --- DATA & STATE ---
    const subjects = [
      'Sosiologi Perdesaan',
      'Penulisan Karya Ilmiah dan Publikasi',
      'Analisis dan Perancangan Sistem Informasi',
      'Struktur Data dan Algoritma',
      'Sistem Operasi dan Infrastruktur TI',
      'Pemrograman Berorientasi Objek',
      'Sistem Pendukung Keputusan'
    ];

    const encouragements = {
      add: [
        "Gas, satu target baru masuk list. Fokus dulu, hasilnya ikut nyusul.",
        "Jangan ngeremehin langkah kecil. Satu set selesai, level naik.",
        "Ambil target ini dulu. Kelas akan mulai saat kamu bergerak."
      ],
      complete: [
        "Mantap, satu tugas selesai. Level kamu naik. ✓",
        "Wih, progres makin solid. Keep pushing, bukan nyerah. ✓",
        "Selesai juga. Ini yang bikin hari ini makin worth it. ✓",
        "Kamu lagi di ritme yang bener. Lanjutkan, jangan stop. ✓"
      ]
    };

    const taskAccents = [
      { accent: '#7c5ce7', dark: '#6344c0', tint: '#f5f1ff', border: '#e5dcff' },
      { accent: '#e87956', dark: '#bb5639', tint: '#fff3ed', border: '#f8dfd2' },
      { accent: '#319b88', dark: '#247565', tint: '#edf9f5', border: '#d3eee5' },
      { accent: '#d39a32', dark: '#9b6d16', tint: '#fff8e8', border: '#f2e5c4' },
      { accent: '#d96886', dark: '#ad4563', tint: '#fff1f5', border: '#f5d9e2' },
      { accent: '#5484c7', dark: '#3f68a5', tint: '#eff5ff', border: '#d9e5f7' }
    ];

    let tasks = [];

    // --- DOM ELEMENTS ---
    const subjectSelect = document.getElementById('subjectInput');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const taskListContainer = document.getElementById('taskListContainer');
    const gardenContainer = document.getElementById('gardenContainer');
    const gardenCount = document.getElementById('gardenCount');
    const progressSection = document.getElementById('progressSection');
    const encouragementText = document.getElementById('encouragementText');
    // --- INITIALIZATION ---
    function init() {
      // Populate subjects
      subjects.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub;
        option.textContent = sub;
        subjectSelect.appendChild(option);
      });

      // Load data from localStorage
      const savedTasks = localStorage.getItem('azkaTasksVanilla');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        tasks = parsedTasks.filter(task => ![101, 102, 103].includes(task.id));
      }

      render();
      lucide.createIcons(); // Initialize icons
    }

    // --- RENDER LOGIC (The Vanilla JS alternative to React's Virtual DOM) ---
    function render() {
      renderTasks();
      renderGarden();
      saveData();
      lucide.createIcons(); // Re-initialize icons for newly added DOM elements
    }

    function renderTasks() {
      taskListContainer.innerHTML = '';
      const pendingTasks = tasks.filter(t => !t.completed);

      if (pendingTasks.length === 0) {
        const emptyStateMessage = tasks.length === 0
          ? 'Belum ada target. Tambahkan tugas pertama dan mulai bangun momentum.'
          : 'Semua target udah clear. <br/>Sekarang tinggal eksekusi level berikutnya.';
        taskListContainer.innerHTML = `
          <div class="empty-state bg-[#0d1d2d] border-2 border-dashed border-[#1d3557] rounded-[32px] p-8 text-center text-[#9fb5ca]">
            <i data-lucide="check-circle-2" style="width: 32px; height: 32px;" class="mx-auto mb-3 opacity-80 text-[#7dd3fc]"></i>
            <p class="font-semibold text-[#dfeeff]">${emptyStateMessage}</p>
          </div>
        `;
        return;
      }

      pendingTasks.forEach((task, index) => {
        const accent = taskAccents[index % taskAccents.length];
        const deadlineHtml = task.deadline ? `
          <span class="task-deadline text-xs font-semibold text-[#cfe8ff] bg-[#12263b] px-2 py-1 rounded-xl flex items-center gap-1 w-max border border-[#1d3557]">
            <i data-lucide="calendar" style="width: 12px; height: 12px;"></i> ${formatDateFriendly(task.deadline)}
          </span>
        ` : '';

        const taskEl = document.createElement('div');
        taskEl.className = "task-card bg-[#0d1d2d] p-5 rounded-3xl flex items-center justify-between gap-4 soft-shadow group hover:bg-[#11273b] transition-colors border border-[#1d3557]";
        taskEl.style.setProperty('--task-accent', accent.accent);
        taskEl.style.setProperty('--task-accent-dark', accent.dark);
        taskEl.style.setProperty('--task-tint', accent.tint);
        taskEl.style.setProperty('--task-border', accent.border);
        taskEl.innerHTML = `
          <div class="task-main flex items-center gap-4 flex-1">
            <button onclick="toggleComplete(${task.id})" class="task-complete w-8 h-8 rounded-full border-2 border-[#60a5fa] hover:bg-[#60a5fa] hover:text-[#081724] flex items-center justify-center transition-all flex-shrink-0 text-[#7dd3fc] hover:text-[#081724]" aria-label="Tandai tugas selesai">
              <i data-lucide="check" style="width: 16px; height: 16px; stroke-width: 3;"></i>
            </button>
            <div class="task-content">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="task-subject text-xs font-bold text-[#dfeeff] bg-[#12263b] px-2 py-1 rounded-xl block w-max border border-[#1d3557]">
                  ${task.subject}
                </span>
                ${deadlineHtml}
              </div>
              <p class="font-semibold text-lg text-[#edf6ff]">${task.text}</p>
            </div>
          </div>
          <button onclick="deleteTask(${task.id})" class="task-delete text-[#fca5a5] hover:text-[#f87171] hover:bg-[#1f2937] p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Hapus tugas">
            <i data-lucide="trash-2" style="width: 20px; height: 20px;"></i>
          </button>
        `;
        taskListContainer.appendChild(taskEl);
      });
    }

    function renderGarden() {
      gardenContainer.innerHTML = '';
      const completedTasks = tasks.filter(t => t.completed);
      const totalTasks = tasks.length;

      progressSection.classList.toggle('hidden', completedTasks.length === 0);
      
      gardenCount.textContent = `${completedTasks.length}/${totalTasks} selesai`;

      if (completedTasks.length === 0) {
        return;
      }

      completedTasks.forEach((task, index) => {
        const accent = taskAccents[index % taskAccents.length];
        const progressEl = document.createElement('div');
        progressEl.className = "level-card flex items-center gap-3 rounded-2xl border border-[#1d3557] bg-[#12263b] px-4 py-3 min-w-[180px]";
        progressEl.style.setProperty('--task-accent', accent.accent);
        progressEl.style.setProperty('--task-accent-dark', accent.dark);
        progressEl.style.setProperty('--task-tint', accent.tint);
        progressEl.style.setProperty('--task-border', accent.border);
        progressEl.style.animationDelay = `${(index % 10) * 0.08}s`;
        progressEl.innerHTML = `
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0d1d2d] border border-[#1d3557] text-[#7dd3fc]">
            <i data-lucide="check" style="width: 18px; height: 18px; stroke-width: 3;"></i>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] uppercase tracking-[0.18em] text-[#8aa4bf] mb-1">Done</p>
            <p class="font-semibold text-[#edf6ff] truncate max-w-[200px]">${task.subject}</p>
          </div>
        `;
        gardenContainer.appendChild(progressEl);
      });
    }

    // --- ACTIONS & HANDLERS ---
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const text = taskInput.value.trim();
      const subject = subjectSelect.value;
      const deadline = deadlineInput.value;

      if (!text || !subject) return;

      const newTask = {
        id: Date.now(),
        text: text,
        subject: subject,
        completed: false,
        deadline: deadline,
        createdAt: new Date().toISOString()
      };

      tasks.unshift(newTask); // Add to beginning
      
      // Reset form
      taskInput.value = '';
      deadlineInput.value = '';
      subjectSelect.selectedIndex = 0;
      
      setEncouragement(encouragements.add[Math.floor(Math.random() * encouragements.add.length)]);
      render();
    });

    window.toggleComplete = function(id) {
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex > -1) {
        const task = tasks[taskIndex];
        if (!task.completed) {
          setEncouragement(encouragements.complete[Math.floor(Math.random() * encouragements.complete.length)]);
          task.completed = true;
        } else {
          task.completed = false; // Allow unchecking
        }
        
        checkAllCompleted();
        render();
      }
    };

    window.deleteTask = function(id) {
      tasks = tasks.filter(t => t.id !== id);
      render();
    };

    // --- HELPERS & EFFECTS ---
    function setEncouragement(text) {
      encouragementText.style.opacity = 0;
      setTimeout(() => {
        encouragementText.textContent = text;
        encouragementText.style.opacity = 1;
      }, 300);
    }

    function checkAllCompleted() {
      if (tasks.filter(t => !t.completed).length === 0 && tasks.length > 0) {
        setEncouragement("Semua target selesai. Kamu lagi di mode paling siap dan paling fokus. ✓");
      }
    }

    function formatDateFriendly(dateString) {
      if (!dateString) return '';
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    function saveData() {
      localStorage.setItem('azkaTasksVanilla', JSON.stringify(tasks));
    }

    // Start App
    init();

